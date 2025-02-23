import "dotenv/config";
import http from 'http';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import UserModel from './models/user.model.js';
import app from './app.js';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
import * as messageService from './services/message.service.js';
import { sendOTP, verifyOTP, resetPassword } from './services/auth.service.js';

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket'],
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
});

// Track connected users with project information
const connectedUsers = new Map();

// Authenticate socket connection
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error("Invalid project ID"));
        }

        // Clean up token if it starts with 'Bearer '
        const cleanToken = token?.startsWith('Bearer ') ? token.slice(7) : token;

        if (!cleanToken) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = jwt.verify(cleanToken, process.env.SECRET_KEY);
            
            // Find user by email instead of userId
            const user = await UserModel.findOne({ email: decoded.email });
            if (!user) {
                console.error(`User not found with email: ${decoded.email}`);
                return next(new Error("User not found"));
            }

            // Find project and check if user's email is in users array
            const project = await projectModel.findById(projectId).populate('users');
            if (!project) {
                return next(new Error("Project not found"));
            }

            // Check if user's email is in project's users array
            const isCollaborator = project.users.some(u => u.email === user.email);

            if (!isCollaborator) {
                console.log(`Access denied for ${user.email} to project ${projectId}`);
                return next(new Error("Not authorized for this project"));
            }

            // Attach validated user and project to socket
            socket.user = {
                _id: user._id,
                email: user.email,
                name: user.name
            };
            socket.project = project;

            console.log(`Access granted for ${user.email} to project ${projectId}`);
            next();
        } catch (jwtError) {
            console.error("JWT Verification failed:", jwtError);
            return next(new Error("Invalid token"));
        }
    } catch (error) {
        console.error("Socket authentication error:", error);
        return next(new Error(error.message || "Server Error"));
    }
});

io.on('connection', socket => {
    const projectRoomId = `project_${socket.project._id.toString()}`;
    socket.roomId = projectRoomId;
    
    // Join the room
    socket.join(projectRoomId);
    console.log(`User ${socket.user.email} joined room ${projectRoomId}`);

    // Get all active users in this room
    const roomSockets = io.sockets.adapter.rooms.get(projectRoomId);
    const activeUsers = Array.from(roomSockets || []).map(socketId => {
        const userSocket = io.sockets.sockets.get(socketId);
        return userSocket?.user?.email;
    }).filter(Boolean);

    // Broadcast to all in room including sender
    io.in(projectRoomId).emit('active-users', {
        users: [...new Set(activeUsers)], // Remove duplicates
        count: activeUsers.length
    });

    socket.on("project-message", async data => {
        try {
            const message = data.message;
            const aiIsPresentInMessage = message.toLowerCase().includes("@ai");
            let savedMessage;

            if (aiIsPresentInMessage) {
                // Save and broadcast the user's prompt first
                savedMessage = await messageService.saveMessage({
                    projectId: socket.project._id,
                    sender: socket.user.email,
                    message: message,
                    isAiTargeted: true
                });

                // Broadcast prompt to everyone in room
                io.in(projectRoomId).emit('project-message', {
                    _id: savedMessage._id,
                    message: message,
                    sender: socket.user.email,
                    isAiTargeted: true,
                    timestamp: new Date().getTime()
                });

                // Generate AI response
                const prompt = message.replace("@ai", "").trim();
                const result = await generateResult(prompt, socket.project._id);
                
                // Save AI response
                const aiResponse = await messageService.saveMessage({
                    projectId: socket.project._id,
                    sender: "BUTO AI",
                    message: result,
                    files: result.files || {},
                    buildSteps: result.buildSteps || [],
                    runCommands: result.runCommands || [],
                    prompt: prompt,
                    isAiResponse: true
                });

                // Broadcast AI response to everyone
                io.in(projectRoomId).emit('project-message', {
                    _id: aiResponse._id,
                    message: result,
                    sender: "BUTO AI",
                    prompt: prompt,
                    isAI: true,
                    files: result.files || {},
                    buildSteps: result.buildSteps || [],
                    runCommands: result.runCommands || [],
                    timestamp: new Date().getTime()
                });

            } else {
                // Handle regular chat messages
                savedMessage = await messageService.saveMessage({
                    projectId: socket.project._id,
                    sender: socket.user.email,
                    message: message
                });

                // Only broadcast to others in the room, not back to sender
                socket.broadcast.to(projectRoomId).emit('project-message', {
                    _id: savedMessage._id,
                    message: message,
                    sender: socket.user.email,
                    timestamp: new Date().getTime()
                });
            }
        } catch (error) {
            console.error('Message handling error:', error);
            socket.emit('error', { message: 'Error processing message' });
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected | User: ${socket.user.email} | Room: ${projectRoomId} | Reason: ${reason}`);
        
        // Remove user from tracking
        connectedUsers.delete(socket.userKey);

        // Get updated room users
        const remainingUsers = Array.from(connectedUsers.entries())
            .filter(([key]) => key.endsWith(socket.project._id.toString()))
            .map(([key]) => key.split(':')[0]);

        io.to(projectRoomId).emit('active-users', {
            users: remainingUsers,
            count: remainingUsers.length
        });
    });
});

// Authentication Routes for OTP & Password Reset
app.post('/auth/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const response = await sendOTP(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP" });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const response = await verifyOTP(email, otp);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

app.post("/api/reset-password", async (req, res) => {
    console.log("📝 Reset Password Request Body:", req.body);
    
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        console.error("❌ Missing email or password");
        return res.status(400).json({ success: false, message: "Missing email or new password" });
    }

    const result = await resetPassword(email, newPassword);
    console.log("📩 Reset Password Response:", result);

    res.status(result.success ? 200 : 400).json(result);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const response = await sendOTP(email); // Using existing OTP function for password reset
        res.status(200).json({ message: "Password reset OTP sent", response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error handling forgot password" });
    }
});