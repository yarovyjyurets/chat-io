//@ts-check
const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  NEW_USER: 'new_user',
  USERS_COUNT: 'users_count',
}

let _liveConnections = 0;
const DEFAULT_USER_NAME = 'Anonymous'

const disconectHandler = (io, socket) => {
  socket.on(EVENTS.DISCONNECT, () => {
    console.log('Client disconnected');
    io.emit(EVENTS.USERS_COUNT, { usersCounter: --_liveConnections });
    socket.broadcast.emit(EVENTS.NEW_USER, { userName: `${DEFAULT_USER_NAME}${_liveConnections}` });
  });
}
const newConnectionHandler = (io, socket) => {
  console.log('New client connected');
  io.emit(EVENTS.USERS_COUNT, { usersCounter: ++_liveConnections });
  socket.broadcast.emit(EVENTS.NEW_USER, { userName: `${DEFAULT_USER_NAME}${_liveConnections}` });
}
const newMessageHandler = (io, socket) => {
  socket.on(EVENTS.NEW_MSG, (msg) => {
    console.log('MSS>>>:', msg)
    io.emit(EVENTS.NEW_MSG, msg);
  });
}

const attachListeners = (io) => {
  io.on(EVENTS.CONNCETION, (socket) => {
    newConnectionHandler(io, socket);
    disconectHandler(io, socket);
    newMessageHandler(io, socket);
  });
}

module.exports = {
  attachListeners
}