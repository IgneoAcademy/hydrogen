var express = require('express');
var router = express.Router();

/* GET splash page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Weekly view', user: req.user });
});

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { title: 'Welcome!' });
});

module.exports = router;
