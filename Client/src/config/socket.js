// socket.js
import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance?.connected && socketInstance.projectId === projectId) {
        return socketInstance;
    }

    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No authentication token found");
        window.location.href = "/login";
        return null;
    }

    socketInstance = socket(import.meta.env.VITE_SOCKET_URL, {
        auth: {
            token: token // Send token as is, server will handle Bearer prefix
        },
        query: { projectId },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        timeout: 20000
    });

    socketInstance.projectId = projectId;

    socketInstance.on("connect", () => {
        console.log("Socket connected successfully");
    });

    socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
            socketInstance.connect();
        }
    });

    socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error?.message);
        switch(error.message) {
            case "Not authorized for this project":
                console.error("You are not a collaborator of this project");
                window.location.href = "/";
                break;
            case "User not found":
                console.error("User account not found");
                localStorage.removeItem("token");
                window.location.href = "/login";
                break;
            case "Invalid token":
                localStorage.removeItem("token");
                window.location.href = "/login";
                break;
            default:
                console.error("Connection failed:", error.message);
        }
    });

    socketInstance.removeAllListeners('user-joined');
    socketInstance.removeAllListeners('active-users');

    socketInstance.on('user-joined', (data) => {
        console.log('User joined:', data);
    });

    socketInstance.on('active-users', (data) => {
        console.log('Active users:', data);
    });

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) {
    console.error("Socket not initialized");
    return;
  }

  socketInstance.on(eventName, (data) => {
    const processedData = {
      ...data,
      _id: data._id,
      timestamp: data.timestamp || Date.now(),
      fromServer: true
    };

    if (data.sender === "BUTO AI" && typeof data.message === "string") {
      try {
        processedData.message = JSON.parse(data.message);
      } catch (error) {
        console.error("Error parsing AI message:", error);
      }
    }

    cb(processedData);
  });
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) {
    console.error("Socket not initialized");
    return;
  }

  const messageData = {
    ...data,
    timestamp: data.timestamp || Date.now()
  };

  socketInstance.emit(eventName, messageData);
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
