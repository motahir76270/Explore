const loggedMiddle = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page'); 
        return  res.redirect('/login');
    }
    next();
}

module.exports = loggedMiddle;

//post-login page
module.exports.saveRedirectUrl = (req,res,next) => {
   if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.originalUrl;
   }
   next();
};