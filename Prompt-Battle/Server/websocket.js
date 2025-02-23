const WebSocket = require('ws');
const Prompt = require('./models/prompt.model');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      
      // Broadcast vote updates to all connected clients
      if (data.type === 'VOTE_UPDATE') {
        wss.broadcast({
          type: 'VOTE_UPDATE',
          promptId: data.promptId,
          votes: data.votes
        });
      }
    });
  });

  // Add broadcast method to wss
  wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  return wss;
};

// Export the setup function directly
module.exports = setupWebSocket;
