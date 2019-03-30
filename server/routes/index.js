const passport = require('passport')
const User = require(process.cwd() + '/models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const router = require('express').Router();

// middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  console.log('Not logged in. Redirect to index.');
  res.redirect('/');
}

router.get('/', (req,res)=>{
  res.render('index');
})

router.get('/chat', ensureAuthenticated, (req,res)=>{
  res.render('chat', {
    user: req.user
  });
})

router.get('/profile', ensureAuthenticated, (req,res)=>{
  res.render('profile', {
    user: req.user
  });
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/profile'
}));

router.post('/register', (req, res, next)=>{
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) next(err);
    // username already exists
    else if (user) res.render('error', {error:{status:500,message:'Username already exists'}});
    else {
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) next(err);
        var timestamp = new Date();
        User.create({
          username: req.body.username,
          password: hash,
          _created_on: timestamp,
          last_login: timestamp,
          login_count: 1,
          total_messages: 0
        }, (err, doc) => {
          if (err) next(err);
          next(null, doc)
        })
      })
    }
  })
}, passport.authenticate('local', {
  failureRedirect: '/'
}), (req, res, next) => {
  res.redirect('/profile');
});

module.exports = router;
