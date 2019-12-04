const express = require('express');
const app = express();

app.use(express.static('public'))
app.get('*', (req, res, next) => {
  res.send(`<h1>Hello!!! Welocme to <a href="http://10.25.9.35:3000/chat.html">CHAT-SERVER >>></a>!<h1>`);
});

module.exports = app; 