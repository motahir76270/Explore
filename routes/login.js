const express = require('express');
const router = express.Router();
const userlist = require('../model/user.js');
const expressError = require('../util/error.js');
const flash = require('connect-flash');
const passport = require('passport');
const {saveRedirectUrl } =require('../loggedMidlware.js');


router.get('/login', async(req, res, next) => {
    try {
      res.render('login.ejs');
    } catch (err) {
      next(err);
    }
  });

  router.post('/login',saveRedirectUrl,
     passport.authenticate('local' , {failureRedirect:"/login",failureFlash: true}),
     async(req, res) => {
       let {username} = req.body;
       req.flash("success","Welcome to Explore Back!");
       //res.redirect('/explore');

       //post-login page in redirect
       res.redirect(res.locals.redirectUrl || '/explore');
     })

     router.get('/logout', (req, res,next) => {
      req.logout( (err) => {
        if(err) return next(err);
        req.flash("success","You are Logged Out Successfully");
        res.redirect('/explore');
      })

     })
  


module.exports = router ;