const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const User = require('../models/User');

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      
      const result = Joi.validate(req.body, userSchema);
      
      if (result.error) {
        req.flash('error', 'Input is not valid. Please try again.')
        res.redirect('/users/register')
        return;
      }

      //Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });

      if (user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/register')
        return;
      }

      // Hash the password
      const hash = await User.hashPassword(result.value.password);

      //Save user to DB
      delete result.value.confirmationPassword;
      result.value.password = hash;

      const newUser = await new User(result.value)
      await newUser.save();

      req.flash('success', "You may now login");
      res.redirect('/users/login');
    
    } catch(error){

      next(error);

    }

  })

router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }))

module.exports = router;