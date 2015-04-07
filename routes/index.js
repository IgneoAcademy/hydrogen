var express = require('express');
var router = express.Router();

/* GET main page (weekly view). Requires login. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weekly view', user: req.user });
});

// Splash/login page
router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Welcome!' });
});

module.exports = router;
