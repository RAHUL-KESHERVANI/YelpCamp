var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//ROUTES-------------------------------
router.get("/", function(req, res){
   res.render("landing"); 
});


//Authentication ROUTES

//register ROUTEs
router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req,res){
  User.register(new User({username:req.body.username}), req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});
//LOGIN ROUTES
router.post("/login", passport.authenticate("local", {
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}), function(req, res){
  
});


router.get("/login", function(req,res){
res.render("login");
});


//LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
})

module.exports = router;