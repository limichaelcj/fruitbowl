const passport = require('passport')
const User = require(process.cwd() + '/models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const router = require('express').Router();

const chooseFrom = function(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

// middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  console.log('Not logged in. Redirect to index.');
  res.redirect('/');
}

router.get('/', (req,res)=>{
  res.render('index', {
    registrationFail: req.query.registrationFail,
    loginFail: req.query.loginFail
  });
})

router.get('/chat', ensureAuthenticated, (req,res)=>{
  const fruits = ['apple', 'blueberries', 'grapes', 'kiwi', 'melon', 'pineapple', 'raspberry', 'tomato'];
  res.render('chat', {
    user: req.user,
    randomIcon: `/assets/icons/${chooseFrom(fruits)}.svg`
  });
})

router.get('/profile/:username', (req,res)=>{
  User.findOne({username: req.params.username}, (err, doc) => {
    if (err) next(err);
    req.isAuthenticated();
    res.render('profile', {
      profile: doc,
      user: req.user || null
    })
  })
});

router.get('/profile', ensureAuthenticated, (req,res) => {
  res.redirect(`/profile/${req.user.username}`);
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/?loginFail=1',
  successRedirect: '/profile'
}));

router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/?logout=1');
})

router.post('/register', (req, res, next)=>{
  req.body.username = req.body.username.trim();
  // 2nd level validation (1st=html, 3rd=mongoose)
  if (/[^a-zA-Z0-9\-\_]/g.test(req.body.username)) res.redirect('/?registrationFail=1');
  if (req.body.password.length < 8) res.redirect('/?registrationFail=2');

  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) next(err);
    // username already exists
    else if (user) res.redirect('/?registrationFail=3');
    else {
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) next(err);
        var timestamp = new Date();
        User.crepate({
          username: req.body.username,
          password: hash,
          favorite_fruit: req.body.fruit,
          _created_on: timestamp,
          last_login: timestamp,
          login_count: 1,
          messages_sent: 0
        }, (err, doc) => {
          if (err) next(err);
          next(null, doc)
        })
      })
    }
  })
}, passport.authenticate('local', {
  failureRedirect: `/?registrationFail=4`
}), (req, res, next) => {
  res.redirect(`/profile/${req.body.username}`);
});

module.exports = router;
