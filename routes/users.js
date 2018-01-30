var express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../helpers/auth');

var router = express.Router();

//Load User model
require('../models/User');
const User = mongoose.model('user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Login
router.get('/login', (req, res) => {
  res.render('users/login', {
    title: 'Login',
    bgImage: '../images/tools.png'
  });
});

// Logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Register
router.get('/register', (req, res) => {
  res.render('users/register', {
    title: 'Register',
    bgImage: '../images/tools.png'
  });
});

// Settings
router.get('/settings', ensureAuthenticated, (req, res) => {
  res.render('users/settings', {
    title: 'Settings'
  });
});

//Login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register form post
router.post('/register', (req, res) => {
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }
  if(req.body.password.length< 4){
    errors.push({text: 'Passwords must be at least 4 characters'});
  }
  if(errors.length > 0) {
    res.render('users/register',{
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already taken');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
      
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password,salt,(err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg','You are now registered and can login');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      })
  }
});

// Settings post form
router.put('/settings', ensureAuthenticated, (req, res) => {
  let errors = [];
  if(req.body.currentPassword == req.body.newPassword){
    errors.push({text: 'Passwords cannot match'});
  }
  if(req.body.newPassword.length < 4){
    errors.push({text: 'New password must be more than 4 characters'});
  }
  if(errors.length > 0) {
    res.render('users/settings',{
      errors: errors
    });
  } else {
    User.findOne({email: req.user.email})    
      .then(user => {
        //Match password
        bcrypt.compare(req.body.currentPassword, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newPassword,salt,(err, hash) => {
                if(err) throw err;
                user.password = hash;
                user.save()
                  .then(user => {
                    req.flash('success_msg','Password updated');
                    res.redirect('/ideas');
                  })
                  .catch(err => {
                    console.log(err);
                    return;
                  });
              });
            });
          } else {
            req.flash('error_msg', 'Current password does not match');
            res.redirect('/users/settings');
            return;
          }
        });
      });
  };
});

module.exports = router;
