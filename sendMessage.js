const mysql = require('mysql2');
const WebSocket = require('ws');
function sendMessage(server,sendable,messageType='no') { 
  sendable.messageType = messageType;
    server.clients.forEach((client) => {
        // client !== ws &&
      if ( client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(sendable));
      }
    });

}

module.exports = {
    sendMessage,
}