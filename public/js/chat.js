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
  socket.on(EVENTS.USER_LOGIN, (userNickName) => {
    if (isLoggedIn) {
      const msg = `${userNickName} joined the conversation`;
      addMessage({ msg }, {
        classes: {
          p: ['message-info'],
          li: ['left']
        }
      });
    }
  });
}

function handleOtherUserLogoutEvent(socket) {
  socket.on(EVENTS.USER_LOGOUT, (userNickName) => {
    console.log('USER_LOGOUTUSER_LOGOUTUSER_LOGOUTUSER_LOGOUT')
    if (isLoggedIn) {
      const msg = `${userNickName} left the conversation`;
      addMessage({ msg }, {
        classes: {
          p: ['message-info'],
          li: ['left']
        }
      });
    }
  });
}

function handleUserLoginBtnCLick(socket) {
  const msgBtn = document.getElementById('login-btn');
  if (msgBtn) {
    msgBtn.addEventListener('click', async () => {
      const inputMsg = document.getElementById('nick-name');
      const userNickName = inputMsg.value;
      if (!userNickName) {
        return
      }

      isLoggedIn = true;
      socket.emit(EVENTS.USER_LOGIN, userNickName);
      document.getElementById('login-component').style.display = 'none';
      document.getElementById('welcome').innerHTML = `Welcome: ${userNickName}`;
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
      addMessage({ msg }, {
        classes: {
          p: ['message', 'msg-right'],
          li: ['right']
        }
      });
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
  socket.on(EVENTS.NEW_MSG, ({ msg, userNickName }) => {
    addMessage({ msg, userNickName }, {
      classes: {
        p: ['message', 'msg-left'],
        li: ['left']
      }
    });
    scrollToBottom();
  });
}

function addMessage({ msg, userNickName }, { classes }) {
  const ul = document.getElementById("messages");
  const li = document.createElement("li");
  if (classes.li) {
    classes.li.forEach(className => {
      li.classList.add(className);
    });
  }
  const div = document.createElement("div");
  if (userNickName) {
    const pUserNickName = document.createElement("p");
    pUserNickName.textContent = `${userNickName}:`;
    pUserNickName.classList.add('user-nickname');
    div.appendChild(pUserNickName)
  }
  const pUserMsg = document.createElement("p");
  pUserMsg.textContent = msg;
  if (classes.p) {
    classes.p.forEach(className => {
      pUserMsg.classList.add(className);
    });
  }
  div.appendChild(pUserMsg)
  li.appendChild(div);
  ul.appendChild(li);
}

function scrollToBottom() {
  const chat = document.querySelector('.chat-container');
  const shouldScroll = chat.scrollTop + chat.clientHeight === chat.scrollHeight;
  if (!shouldScroll) {
    chat.scrollTop = chat.scrollHeight;
  }
}

function handleUserCount(socket) {
  socket.on(
    EVENTS.USERS_COUNT,
    (msg) => {
      const usersCounter = document.getElementById("users-counter");
      usersCounter.innerHTML = msg.usersCounter
    });
}