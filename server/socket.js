const User = require(process.cwd() + '/models/User')

module.exports = function(io) {
  // socket state
  var allUsers = [];

  io.on('connection', socket => {
    socket.user = socket.request.user;
    console.log(`Connection to user '${socket.user.username}'`);
    allUsers.push({
      name: socket.request.user.username,
      avatar: socket.request.user.favorite_fruit
    });
    io.emit('user', {
      name: socket.request.user.username,
      connected: true,
      allUsers
    });

    // configure socket response behavior
    socket.on('disconnect', () => {
      var index = allUsers.findIndex(user => user.name == socket.request.user.username);
      allUsers.splice(index, 1);
      io.emit('user', {
        name: socket.request.user.username,
        connected: false,
        allUsers
      });
    });

    socket.on('chat message', message => {
      const user = socket.request.user;
      console.log(user);
      console.log(`Message received from ${user.username}: ${message}`)
      User.updateOne(
        { _id: user._id },
        { $inc: { messages_sent: 1 }},
        (err, doc) => {
          if (err) console.log(err);
          io.emit('chat message', {
            name: user.username,
            message,
            avatar: `/assets/avatars/${user.favorite_fruit}.svg`
          });
        }
      );
    });

  });
}
