if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const chat = require('./model/listing.js');
const Review = require('./model/review.js');
const userlist = require('./model/user.js');

const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const bodyParser = require('body-parser')

const expressError = require('./util/error.js');


const flash = require('connect-flash');

//routers
const listingsRoutes = require('./routes/listings.js');
const reviewRoutes = require('./routes/reviewR.js');
const signupRoutes = require('./routes/signup.js');
const loginRoutes = require('./routes/login.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const { console } = require('inspector');

const db_url = process.env.ATLASDB_URL ;

const port = process.env.PORT || 5670;
//sudo lsof -t -i :2770 | xargs sudo kill -9
//sudo kill -9 $(sudo lsof -t -i:5670)   //kill automatically

// Middleware for parsing JSON body
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(bodyParser.urlencoded({ extended: true }));


console.log(process.env.SECRET);

main()
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((err) => {
  console.log('Error connecting', err);
});

async function main() {
  await mongoose.connect(db_url)
};

//mongo-connection
const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret: process.env.secret,
  },
  touchAfter: 24*3600,
});

store.on("error" , () => { console.log('Error connecting', err); })

// express-session
app.use(
  session({
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires: new Date(Date.now() + 7*24* 60 * 60 * 1000), 
      maxAge: 7*24* 60 * 60 * 1000,
    }
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userlist.authenticate()));
passport.serializeUser(userlist.serializeUser());
passport.deserializeUser(userlist.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.cuurentuser = req.user;
  next();
})


app.get('/', (req, res) => 
  res.redirect('/explore')
//heloo
);

//reconstructing explore routes
app.use("/explore",listingsRoutes);
app.use('/explore/:id/reviews' ,reviewRoutes)
app.use('/', signupRoutes)
app.use('/', loginRoutes)

app.use((err, req, res, next) => {
  let { status = 502, message = 'Page not found' } = err;
  res.render('error.ejs', {  message });
});

app.all('*', (req, res, next) => {
  next(new expressError(504, 'Page Not Found')); // 404 error
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

