const socketIO = require('socket.io');
const {attachListeners} = require('./listeners');

let _ioConnection = null;
const initSocketIO = (httpServer) => {
  _ioConnection = socketIO(httpServer);
  attachListeners(_ioConnection);
  return _ioConnection;
}


module.exports = {
  initSocketIO
}