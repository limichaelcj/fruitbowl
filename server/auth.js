const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require(process.cwd() + '/models/User')
const Message = require(process.cwd() + '/models/Message')
const bcrypt = require('bcrypt')

module.exports = async function(){
  await passport.use(new LocalStrategy((username, password, done)=>{
    User.findOne({ username: username }, (err, user) => {
      console.log(`${Date()} :: Login attempt by user: ${username}`);
      // code error
      if (err) return done(err);
      // no user found
      if (!user) return done(null, false);
      // password incorrect
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false)
      }
      // all checks passed
      return done(null, user);
    });
  }));

  // passport serialization for session tracking
  await passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  await passport.deserializeUser((id, done) => {
    console.log('deserialize id: ' + id);
    User.findById(id, (err, doc) => {
      done(null, doc);
    })
  })
}
