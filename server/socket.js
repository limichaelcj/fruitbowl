module.exports = function(io) {
  // socket state
  var userCount = 0;

  io.on('connection', socket => {
    console.log(`${socket.request.user.username} connected.`);
    userCount++;
    io.emit('user', {
      name: socket.request.user.username,
      userCount,
      connected: true
    });

    // configure socket response behavior
    socket.on('disconnect', ()=>{
      userCount--;
      io.emit('user', {
        name: socket.request.user.username,
        userCount,
        connected: false
      });
    });

    socket.on('chat message', message => {
      console.log('message received: ' + message)
      io.emit('chat message', {
        name: socket.request.user.username,
        message
      });
    });

  });
}
