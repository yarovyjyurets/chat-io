//@ts-check
const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  USERS_COUNT: 'users_count',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_IS_TYPING: 'user_is_typing',
  USER_IS_NOT_TYPING: 'user_is_not_typing',
  TYPING_USERS: 'typing_users',
}

let _liveConnections = 0;
const typingUsers = [];

const disconectHandler = (io, socket) => {
  socket.on(EVENTS.DISCONNECT, () => {
    console.log('Client disconnected');
    io.emit(EVENTS.USERS_COUNT, { usersCounter: --_liveConnections });
    if (socket.userNickName) {
      socket.broadcast.emit(EVENTS.USER_LOGOUT, socket.userNickName);
    }
  });
}
const newConnectionHandler = (io, socket) => {
  console.log('New client connected');
  io.emit(EVENTS.USERS_COUNT, { usersCounter: ++_liveConnections });
}

const newMessageHandler = (io, socket) => {
  socket.on(EVENTS.NEW_MSG, (msg) => {
    console.log('MSS>>>: ', msg)
    socket.broadcast.emit(EVENTS.NEW_MSG, { msg, userNickName: socket.userNickName });
  });
}

const userLoginHandler = (io, socket) => {
  socket.on(EVENTS.USER_LOGIN, (userNickName) => {
    console.log(`New user: ${userNickName} logged in`);
    socket.userNickName = userNickName;
    socket.broadcast.emit(EVENTS.USER_LOGIN, socket.userNickName);
  });
}

const userIsTypingHandler = (io, socket) => {
  socket.on(EVENTS.USER_IS_TYPING, ({ userNickName }) => {
    console.log(`New user: ${userNickName} is typing`);
    typingUsers.push(userNickName);
    socket.broadcast.emit(EVENTS.TYPING_USERS, typingUsers.join(','));
  });
}

const userIsNotTypingHandler = (io, socket) => {
  socket.on(EVENTS.USER_IS_NOT_TYPING, ({ userNickName }) => {
    console.log(`New user: ${userNickName} stop typing`);
    const index = typingUsers.indexOf(userNickName);
    if (~index) {
      typingUsers.splice(index, 1);
      socket.broadcast.emit(EVENTS.TYPING_USERS, typingUsers.join(','));
    }
  });
}

/**
 * Listeners:
 */
const attachListeners = (io) => {
  io.on(EVENTS.CONNCETION, (socket) => {
    newConnectionHandler(io, socket);
    disconectHandler(io, socket);
    newMessageHandler(io, socket);
    userLoginHandler(io, socket);
    userIsTypingHandler(io, socket);
    userIsNotTypingHandler(io, socket);
  });
}

module.exports = {
  attachListeners
}