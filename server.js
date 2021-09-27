const express = require('express');
const helmet = require('helmet');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(helmet());

const server = app.listen(5000, () => console.info('Started on 5000'));

const io = socketio(server);

module.exports = {
  app,
  io,
};
