//@ts-check
const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  USERS_COUNT: 'users_count',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
}

let _liveConnections = 0;
let isUserAdded = false;

const disconectHandler = (io, socket) => {
  socket.on(EVENTS.DISCONNECT, () => {
    console.log('Client disconnected');
    io.emit(EVENTS.USERS_COUNT, { usersCounter: --_liveConnections });
    socket.broadcast.emit(EVENTS.USER_LOGOUT, socket.userNickname);
  });
}
const newConnectionHandler = (io, socket) => {
  console.log('New client connected');
  io.emit(EVENTS.USERS_COUNT, { usersCounter: ++_liveConnections });
}

const newMessageHandler = (io, socket) => {
  socket.on(EVENTS.NEW_MSG, (msg) => {
    console.log('MSS>>>: ', msg)
    socket.broadcast.emit(EVENTS.NEW_MSG, msg);
  });
}

const userLoginHandler = (io, socket) => {
  socket.on(EVENTS.USER_LOGIN, (userNickname) => {
    console.log(`New user: ${userNickname} logged in`);
    socket.userNickname = userNickname;
    socket.broadcast.emit(EVENTS.USER_LOGIN, socket.userNickname);
  });
}

const attachListeners = (io) => {
  io.on(EVENTS.CONNCETION, (socket) => {
    newConnectionHandler(io, socket);
    disconectHandler(io, socket);
    newMessageHandler(io, socket);
    userLoginHandler(io, socket);
  });
}

module.exports = {
  attachListeners
}