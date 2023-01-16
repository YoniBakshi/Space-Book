let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/users');
let homeRouter = require('./routes/home');
let session = require('express-session')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable sessions
app.use(session({
    secret: "someSecretKey",
    resave: false,      // Force save of session for each request
    saveUninitialized: false,  // Save a session that is new, but has not been modified
    cookie: {maxAge: 10 * 60 * 1000}
}))

// Middleware
app.use(function (req, res, next) {
    res.locals.message = req.cookies.message || '';
    res.locals.title = "This is a default title";
    res.locals.registerData = {};

    if (req.cookies.message)
        res.clearCookie('message');
    next();
})

// Middleware function to check for session
app.use(function(req, res, next) {
  if (!req.session.connection && (req.url !== '/' && req.url !== '/users/register')) {
    res.redirect('/');
  } else/* if(req.session.connection)
      res.redirect('/')*/
    next();
});
app.use(function(req, res, next) {
    if (req.session.connection && (req.url === '/' || req.url === '/users/register')) {
        res.redirect('/home');
    } else
        next();
});

// Plug in the routes
app.use('/', loginRouter);
app.use('/users', registerRouter);
app.use('/home', homeRouter);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
