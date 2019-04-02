const User = require(process.cwd() + '/models/User')

module.exports = function(io) {
  // socket state
  var userCount = 0;

  io.on('connection', socket => {
    console.log(`Connection to user '${socket.request.user.username}'`);
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
            icon: `/assets/icons/${user.favorite_fruit}.svg`
          });
        }
      );
    });

  });
}
