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
    transports: ['websocket']
});

// Track connected users and rooms
const projectRooms = new Map();

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

        const decoded = jwt.verify(cleanToken, process.env.SECRET_KEY);
        
        // Find user by email
        const user = await UserModel.findOne({ email: decoded.email });
        if (!user) {
            return next(new Error("User not found"));
        }

        // Find project and check membership
        const project = await projectModel.findById(projectId).populate('users');
        if (!project) {
            return next(new Error("Project not found"));
        }

        // Check if user is a collaborator
        const isCollaborator = project.users.some(u => u.email === user.email);
        if (!isCollaborator) {
            return next(new Error("Not authorized for this project"));
        }

        // Setup socket data
        socket.user = { _id: user._id, email: user.email, name: user.name };
        socket.project = project;
        socket.roomId = `project_${projectId}`;

        // Track room membership
        if (!projectRooms.has(socket.roomId)) {
            projectRooms.set(socket.roomId, new Set());
        }

        next();
    } catch (error) {
        return next(new Error(error.message || "Authentication Error"));
    }
});

io.on('connection', socket => {
    // Add user to room
    const roomMembers = projectRooms.get(socket.roomId);
    roomMembers.add(socket.user.email);
    socket.join(socket.roomId);

    // Broadcast active users
    io.to(socket.roomId).emit('active-users', {
        users: Array.from(roomMembers),
        count: roomMembers.size
    });

    socket.on("project-message", async data => {
        try {
            const message = data.message;
            const aiIsPresentInMessage = message.toLowerCase().includes("@ai");

            if (aiIsPresentInMessage) {
                // Save and broadcast prompt
                const savedPrompt = await messageService.saveMessage({
                    projectId: socket.project._id,
                    sender: socket.user.email,
                    message: message,
                    isAiTargeted: true
                });

                io.to(socket.roomId).emit('project-message', {
                    _id: savedPrompt._id,
                    message: message,
                    sender: socket.user.email,
                    isAiTargeted: true,
                    timestamp: Date.now()
                });

                // Generate and broadcast AI response
                const prompt = message.replace("@ai", "").trim();
                const result = await generateResult(prompt, socket.project._id);
                
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

                io.to(socket.roomId).emit('project-message', {
                    _id: aiResponse._id,
                    message: result,
                    sender: "BUTO AI",
                    prompt: prompt,
                    isAI: true,
                    files: result.files || {},
                    buildSteps: result.buildSteps || [],
                    runCommands: result.runCommands || [],
                    timestamp: Date.now()
                });
            } else {
                // Handle regular chat messages
                const savedMessage = await messageService.saveMessage({
                    projectId: socket.project._id,
                    sender: socket.user.email,
                    message: message
                });

                socket.broadcast.to(socket.roomId).emit('project-message', {
                    _id: savedMessage._id,
                    message: message,
                    sender: socket.user.email,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Message handling error:', error);
            socket.emit('error', { message: 'Error processing message' });
        }
    });

    socket.on('disconnect', () => {
        // Remove user from room tracking
        const roomMembers = projectRooms.get(socket.roomId);
        if (roomMembers) {
            roomMembers.delete(socket.user.email);
            
            // Update room members or cleanup empty room
            if (roomMembers.size === 0) {
                projectRooms.delete(socket.roomId);
            } else {
                io.to(socket.roomId).emit('active-users', {
                    users: Array.from(roomMembers),
                    count: roomMembers.size
                });
            }
        }
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