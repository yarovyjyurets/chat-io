// CONSTANTS
const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  NEW_USER: 'new_user',
  USERS_COUNT: 'users_count',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
}

let isLoggedIn = false;

function handleSocketIO() {
  const socket = io();

  attachSocketIOHandlers(
    handleNewMessagBtnCLick,
    handleNewMessage,
    handleUserCount,
    handleUserLoginBtnCLick,
    handleOtherUserLoginEvent,
    handleOtherUserLogoutEvent,
  )(socket);
}


/**
 * 
 * BUSINESS LOGIC FUNCTIONS
 * 
 */
function handleOtherUserLoginEvent(socket) {
  socket.on(EVENTS.USER_LOGIN, (userNickname) => {
    if (isLoggedIn) {
      addMessage(`${userNickname} joined the conversation`, { classes: ['message-info'] });
    }
  });
}

function handleOtherUserLogoutEvent(socket) {
  socket.on(EVENTS.USER_LOGOUT, (userNickname) => {
    console.log('USER_LOGOUTUSER_LOGOUTUSER_LOGOUTUSER_LOGOUT')
    if (isLoggedIn) {
      addMessage(`${userNickname} left the conversation`, { classes: ['message-info'] });
    }
  });
}

function handleUserLoginBtnCLick(socket) {
  const msgBtn = document.getElementById('login-btn');
  if (msgBtn) {
    msgBtn.addEventListener('click', async () => {
      const inputMsg = document.getElementById('nick-name');
      const userNickname = inputMsg.value;
      if (!userNickname) {
        return
      }

      isLoggedIn = true;
      socket.emit(EVENTS.USER_LOGIN, userNickname);
      document.getElementById('login-component').style.display = 'none';
      document.getElementById('welcome').innerHTML = `Welcome: ${userNickname}`;
      document.getElementById('chat-component').style.display = 'flex';
    });
  }
}

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
      addMessage(msg, { classes: ['message', 'right'] });
      scrollToBottom();
    });
  }
}

function preventSubmitForm(id) {
  const form = document.getElementById(id);
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
  }, true);
}

function handleNewMessage(socket) {
  socket.on(EVENTS.NEW_MSG, (msg) => {
    addMessage(msg, { classes: ['message'] });
    scrollToBottom();
  });
}

function addMessage(msg, { classes }) {
  const ul = document.getElementById("messages");
  const li = document.createElement("li");
  const p = document.createElement("p");
  li.appendChild(p.appendChild(document.createTextNode(msg)));
  classes.forEach(className => {
    li.classList.add(className);
  });
  ul.appendChild(li);
}

function scrollToBottom() {
  const chat = document.querySelector('.chat-container');
  const shouldScroll = chat.scrollTop + chat.clientHeight === chat.scrollHeight;
  console.log('??', chat);
  if (!shouldScroll) {
    chat.scrollTop = chat.scrollHeight;
  }

  // window.scrollTo(0, document.querySelector('.chat-container').scrollHeight);
}

function handleUserCount(socket) {
  socket.on(
    EVENTS.USERS_COUNT,
    (msg) => {
      const usersCounter = document.getElementById("users-counter");
      usersCounter.innerHTML = msg.usersCounter
    });
}