const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      
      // Broadcast vote updates to all connected clients
      if (data.type === 'VOTE_UPDATE') {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'VOTE_UPDATE',
              promptId: data.promptId,
              votes: data.votes
            }));
          }
        });
      }
    });
  });

  return wss;
}

module.exports = setupWebSocket;
