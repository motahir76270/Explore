const express = require('express');
const router = express.Router();
const userlist = require('../model/user.js');
const expressError = require('../util/error.js');
const flash = require('connect-flash');

router.get('/signup', async(req, res, next) => {
    try {
      res.render('signup.ejs');
    } catch (err) {
      next(err);
    }
  });
  
  router.post('/signup' ,async(req,res) => {
    try {
      const {name ,username,email,password} = req.body;
      let newUser = new userlist({email,username})
       const registeruser = await userlist.register(newUser , password);

      //signp karne ke baad login karne ki jarurat nhi hai automatically login ho jayega user
      req.login(registeruser, (err) => {
        if(err){
          req.flash("error",err.message);
          return res.redirect('/explore');
        }
        req.flash("success","Successfully logged in!");
        res.redirect('/explore');
      });
    } catch (err) {
      req.flash("error",err.message);
      res.redirect('/signup');
    }
  })

module.exports = router ;