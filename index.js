const PORT = 3000;

const app = require('./app');
const {initSocketIO} = require('./socketIO');

const httpServer = require('http').createServer(app);
initSocketIO(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});