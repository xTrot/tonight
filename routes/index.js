var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/* GET feed page. */
router.get('/feed', function(req, res, next) {
  res.render('pages/feed', {title: "Tonight",ngapp:"podsfeed"});
});

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', {title: "Tonight"});
});

module.exports = router;
