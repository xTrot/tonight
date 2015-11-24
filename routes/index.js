var express = require('express');
var router = express.Router();

// Authientication checking middleware.
// To use add checkAuth to a route after
// the routing string.
function checkAuth(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/* GET feed page. */
router.get('/feed',checkAuth, function(req, res, next) {
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
router.get('/friends', checkAuth, function(req, res, next) {
  res.render('pages/friends', {title: "Tonight-Friends",ngapp:"friendsApp"});
});

/* GET group page. */
router.get('/groups', checkAuth, function(req, res, next) {
    res.render('pages/groups', {title: "Tonight-Groups",ngapp:"groupsApp"});
});

/*GET Register page */
router.get('/register:error?', function(req, res, next) {
  if (req.query.error) {
    res.render('pages/register', {title: "Tonight",ngapp:"registerApp",
    error:"Email already registered."});
  }else{
    res.render('pages/register', {title: "Tonight",ngapp:"registerApp"});
  }
});

/*GET Hang page */
router.get('/hang', function(req, res, next) {
  res.render('pages/hang', {title: "Tonight",ngapp:"hang"});
});

/*GET MyProfile page */
router.get('/profile?', function(req, res, next) {
  res.render('pages/myprofile', {title: "Tonight",user: req.query.user,ngapp:"profileApp"});
});

/*GET hangInfo page */
router.get('/hanginf?', function(req, res, next) {
  res.render('pages/hanginfo', {title: "Tonight",hangname: req.query.hangname,time: req.query.time,ngapp:"hang-friendsApp"});
});

/*Get groupinfo page */
router.get('/groupinf',checkAuth, function(req, res, next) {
  res.render('pages/groupinfo', {title: "Tonight",ngapp:"registerApp"});
});

/*Get businessinfo page */
router.get('/businessinf', function(req, res, next) {
  res.render('pages/businessinfo', {title: "Tonight",ngapp:"registerApp"});
});

/*Get business page */
router.get('/businesses', function(req, res, next){
  res.render('pages/business', {title: "tonight", ngapp:"businessApp"});
});

/*Get hanglist page */
router.get('/hangs', function(req, res, next){
  res.render('pages/hanglist', {title: "tonight", ngapp:"hangsApp"});
});

//Get search result page
router.get('/searchresults?', function(req, res, next) {
  res.render('pages/searchresult', {title: "Tonight",search: req.query.search ,ngapp:"searchApp"});
});

//Get business profile page
router.get('/businessprofile?', function(req, res, next) {
  res.render('pages/businessprofile', {title: "Tonight",b_id: req.query.b_id ,ngapp:"businessprofileApp"});
});

//Get group profile page
router.get('/groupprofile?', function(req, res, next) {
  res.render('pages/groupprofile', {title: "Tonight",group_id: req.query.group_id ,ngapp:"groupprofileApp"});
});

//Get update group page
router.get('/updategroup?', function(req, res, next) {
  res.render('updates/groupupdate', {title: "Tonight",group_id: req.query.group_id ,ngapp:"groupupdateApp"});
});

module.exports = router;
