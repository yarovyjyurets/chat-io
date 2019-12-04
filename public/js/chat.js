// CONSTANTS

const EVENTS = {
  CONNCETION: 'connection',
  DISCONNECT: 'disconnect',
  NEW_MSG: 'new_msg',
  NEW_USER: 'new_user',
  USERS_COUNT: 'users_count',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_IS_TYPING: 'user_is_typing',
  USER_IS_NOT_TYPING: 'user_is_not_typing',
  TYPING_USERS: 'typing_users',
}

let IS_LOGGED_IN = false;
let USER_NICK_NAME = null;

function handleSocketIO() {
  const socket = io();

  attachSocketIOHandlers(
    handleNewMessagBtnCLick,
    handleNewMessage,
    handleUserCount,
    handleUserLoginBtnCLick,
    handleOtherUserLoginEvent,
    handleOtherUserLogoutEvent,
    handleUserIsTyping,
    handleUsersTyping,
  )(socket);
}


/**
 * 
 * BUSINESS LOGIC FUNCTIONS
 * 
 */
function handleUsersTyping(socket) {
  socket.on(EVENTS.TYPING_USERS, (users) => {
    const typingInfo = document.getElementById('typing-users-info');
    if (!users) {
      typingInfo.textContent = '';
    } else {
      typingInfo.textContent = `${users} typing...`;
    }
  });
}

function handleUserIsTyping(socket) {
  let USER_IS_TYPING = false;
  let USER_IS_TYPING_TIMER = null;
  const USER_IS_TYPING_TIME_DELAY = 1000;

  const removeUserTyping = () => {
    USER_IS_TYPING = false;
    socket.emit(EVENTS.USER_IS_NOT_TYPING, { userNickName: USER_NICK_NAME });
  }

  const msgInput = document.getElementById('input-message');
  if (msgInput) {
    msgInput.addEventListener('keyup', function (e) {
      if (e.keyCode === 13) {
        clearTimeout(USER_IS_TYPING_TIMER);
        socket.emit(EVENTS.USER_IS_NOT_TYPING, { userNickName: USER_NICK_NAME });
        return;
      }

      if (USER_IS_TYPING) {
        clearTimeout(USER_IS_TYPING_TIMER);
        USER_IS_TYPING_TIMER = setTimeout(removeUserTyping, USER_IS_TYPING_TIME_DELAY);
      } else {
        USER_IS_TYPING = true;
        socket.emit(EVENTS.USER_IS_TYPING, { userNickName: USER_NICK_NAME });
        USER_IS_TYPING_TIMER = setTimeout(removeUserTyping, USER_IS_TYPING_TIME_DELAY);
      }
    })
  }
}

function handleOtherUserLoginEvent(socket) {
  socket.on(EVENTS.USER_LOGIN, (userNickName) => {
    if (IS_LOGGED_IN) {
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
    if (IS_LOGGED_IN) {
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

      USER_NICK_NAME = userNickName
      IS_LOGGED_IN = true;
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