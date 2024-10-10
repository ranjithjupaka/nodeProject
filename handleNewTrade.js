
const { sendMessage } = require('./sendMessage');
function handleNewTrade(server,sendable) {
  sendMessage(server,sendable,'newTrade');
}

module.exports = {
    handleNewTrade,
}