const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 8080;

// stores users list who have joined chat
var users = [];

app.use(express.static(path.join(__dirname, "public")));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

io.on('connection', function(socket) {
  console.log('new connection made');

  // Join private room
  socket.on('join-private', function(data) {
    socket.join('private');
    console.log(data.nickname + ' joined private');
  });

  socket.on('private-chat', function(data) {
    socket.broadcast.to('private').emit('show-message', data.message);
  });

  // Show all users when first logged on
  socket.on('get-users', function(data) {
    // using socket.emit to not broadcast to all users but only to the socket that made the request
    socket.emit('all-users', users);
  });

  // When a new user joins
  socket.on('join', function(data) {
    // create a reference to socket name
    socket.nickname = data.nickname;
    var userObj = {
      nickname: data.nickname,
      socketid: socket.id // automatically created
    }
    // to track the user
    users.push(userObj);
    // using io.emit to broadcast to all connected users
    io.emit('all-users', users);
  });

  // On Sending a message
  socket.on('send-message', function(data) {
    io.emit('message-received', data);
  });

  // Send a 'like' to the user of your choice
  socket.on('send-like', function(data) {
    socket.broadcast.to(data.like).emit('user-liked', data);
  });

  socket.on('disconnect', function() {
    users = users.filter(function(item) {
      return item.nickname !== socket.nickname;
    });
    io.emit('all-users', users);
  });
});

server.listen(port, function() {
  console.log("Listening on port " + port);
});