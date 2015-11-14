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
  if(req.session.user_id){
    res.redirect('/feed');
  }else{
    res.redirect('/login');
  }
  
});

/* GET login page. */
router.get('/login:error?', function(req, res, next) {
  if(req.session.user_id){
    res.redirect('/feed');
  }
  if (req.query.error) {
    res.render('pages/index', {title: "Tonight",ngapp:"index",
      error:"Wrong Username or password."});
  }else{
    res.render('pages/index', {title: "Tonight",ngapp:"index"});
  }
  
});

/* GET friends page. */
router.get('/friends', function(req, res, next) {
  res.render('pages/friends', {title: "Tonight-Friends",ngapp:"friendsApp"});
});

/* GET group page. */
router.get('/groups', function(req, res, next) {
    res.render('pages/groups', {title: "Tonight-Groups",ngapp:"groupsApp"});
});

/*GET Register page */
router.get('/register', function(req, res, next) {
  res.render('pages/register', {title: "Tonight",ngapp:"registerApp"});
});

/*GET Hang page */
router.get('/hang', function(req, res, next) {
  res.render('pages/hang', {title: "Tonight",ngapp:"hang"});
});

/*GET MyProfile page */
router.get('/profile', function(req, res, next) {
  res.render('pages/myprofile', {title: "Tonight",ngapp:"registerApp"});
});

/*GET hangInfo page */
router.get('/hanginf', function(req, res, next) {
  res.render('pages/hanginfo', {title: "Tonight",ngapp:"registerApp"});
});

/*Get groupinfo page */
router.get('/groupinf', function(req, res, next) {
  res.render('pages/groupinfo', {title: "Tonight",ngapp:"registerApp"});
});

module.exports = router;
