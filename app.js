const express = require('express');
const app = express();

app.use(express.static('public'))
app.get('*', (req, res, next) => {
  res.send('<h1>Hello from CHAT-SERVER!<h1>');
});

module.exports = app;