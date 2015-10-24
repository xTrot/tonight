var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/* GET feed page. */
router.get('/feed', function(req, res, next) {
  res.render('pages/feed', {title: "Tonight-Feed",ngapp:"podsfeed"});
});

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', {title: "Tonight",ngapp:"index"});
});

/* GET friends page. */
router.get('/friends', function(req, res, next) {
  res.render('pages/friends', {title: "Tonight-Friends",ngapp:"index"});
});

/*GET Register page */
router.get('/register', function(req, res, next) {
  res.render('pages/register', {title: "Tonight",ngapp:"index"});
});

module.exports = router;
