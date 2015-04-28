var express = require('express'); // Express framework
var app = express();
if (app.get('env') == 'development') {
  require('./config/env'); // Load environment if in development mode.
}
var path = require('path'); // Simple module for handling file system paths
var favicon = require('serve-favicon'); // Serves the favicon
var logger = require('morgan'); // Not sure
var cookieParser = require('cookie-parser'); // Parses cookies 
var bodyParser = require('body-parser'); // Parses body
var connectAssets = require('connect-assets'); // Asset pipeline
var mongoose = require('mongoose'); // MongoDB Schemas
var secrets = require('./config/secrets.js'); // Secret values from env vars
var session = require('express-session'); // Express sessions
var passport = require('passport'); // Authentication 
var passportConfig = require ('./config/passport.js'); // Passport configuration

var routes = require('./routes/index'); // Routes under '/'

// var users = require('./routes/users'); // Routes under '/users'

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

/**
 * Views
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // Use the Jade templating engine

/**
 * Configuration
 */
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Rails-like asset pipeline with connect-assets.
// Compiles .less files automatically.
app.use(connectAssets({
  paths: [path.join(__dirname, 'assets/stylesheets'), // CSS
  path.join(__dirname, 'assets/javascripts')] // Javascript
}));

// Leave public routes open for fonts and images
app.use(express.static(path.join(__dirname, 'public')));
// Use express sessions (required for passport sessions)
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret
}));
// Start passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

/**
 * Routes
 */
app.get('/', passportConfig.ensureAuthenticated, routes); // Requires login
app.get('/welcome', routes);

// Github Oauth
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github',
  { successRedirect: '/', failureRedirect: '/welcome' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  }
);

// Logout
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/welcome');
});

/** 
 * Errors
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
