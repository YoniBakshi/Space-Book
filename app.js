let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/users');
const registerController = require("./controllers/register");

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(function(req, res, next){
  res.locals.message = req.cookies.message || '';
  res.locals.title = "This is a default title";
  res.locals.registerData = {};

  if (req.cookies.message)
    res.clearCookie('message');
  next();
})
// Plug in the routes
app.use('/', loginRouter);
app.use('/users', registerRouter);


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
