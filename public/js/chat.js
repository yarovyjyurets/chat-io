// CONSTANTS
const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  NEW_USER: 'new_user',
  USERS_COUNT: 'users_count',
}


function handleSocketIO() {
  const socket = io();

  attachSocketIOHandlers(
    handleNewMessagBtnCLick,
    handleNewMessage,
    handleUserCount,
    handleNewUser,
  )(socket);
}


/**
 * 
 * BUSINESS LOGIC FUNCTIONS
 * 
 */
function handleNewMessagBtnCLick(socket) {
  const msgBtn = document.getElementById('send-message-btn');
  if (msgBtn) {
    msgBtn.addEventListener('click', async () => {
      const inputMsg = document.getElementById('input-message')
      const msg = inputMsg.value;
      if (!msg) {
        return
      }
      socket.emit(EVENTS.NEW_MSG, msg);
      inputMsg.value = '';
    });
  }
}

function preventSubmitForm() {
  const form = document.getElementById('chat-form');
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
  }, true);
}

function handleNewMessage(socket) {
  socket.on(
    EVENTS.NEW_MSG,
    (msg) => {
      const ul = document.getElementById("messages");
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(msg));
      ul.appendChild(li);
    });
}

function handleNewUser(socket) {
  socket.on(
    EVENTS.NEW_USER,
    (msg) => {
      console.log('handleNewUser', msg);
    });
}

function handleUserCount(socket) {
  socket.on(
    EVENTS.USERS_COUNT,
    (msg) => {
      const usersCounter = document.getElementById("users-counter");
      usersCounter.innerHTML = msg.usersCounter
    });
}