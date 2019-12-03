require('./db_connection.js');
require('./config/passport');
//require('./helper.js');
var createError = require('http-errors');
var expressHbs = require('express-handlebars');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
//var handleBar = require('handlebars');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');
var contactRoutes = require('./routes/contact');
var app = express();
app.enable('view cache');
app.use(express.static(__dirname + '/public/images'));
// CORS middleware
app.use(function(req, res, next) {
  // Allow Origins
  res.header('Access-Control-Allow-Origin', '*');
  // Allow Methods
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  );
  
  // Allow Headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Content-Type, Authorization',
  );
  // Handle preflight, it must return 200
  if (req.method === 'OPTIONS') {
    // Stop the middleware chain
    return res.status(200).end();
  }
  // Next middleware
  next();
});
// view engine setup
const hbs = expressHbs.create({
  defaultLayout:'layout',
  extname:'.hbs',
  //create custom helpers... 
  helpers: {
    calculation: function(value){
      return value * 5
    },
    list: function(value, option){
      console.log(value);
      const sortedProducts = value.sort((a,b) => (a.price - b.price));
      let out= "";
      for(let i=0; i < sortedProducts.length; i ++){
           out = out  + option.fn(sortedProducts[i]);
      }
      return out;
    }
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('.hbs',hbs.engine);
// app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  { 
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
