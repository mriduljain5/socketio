const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socket(server);

const port = 8080;

app.use(express.static(__dirname));

// opening connection b/w client and server
io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  // send given event to client
  socket.emit('message-from-server', {
    greeting: 'Hi from server'
  });

  // listen given event from client
  socket.on('message-from-client', (msg) => {
    console.log(msg);
  });
});

server.listen(port, function () {
  console.log('Listening on port: ' + port);
});
