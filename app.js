const express = require('express');
const app = express();

app.use(express.static('public'))
app.get('*', (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.send(`<h1>Hello!!! Welocme to <a href="${url}/chat.html">CHAT-SERVER >>></a>!<h1>`);
});

module.exports = app;