var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")
//INDEX ROUTE
router.get("/", function(req, res){

   Campground.find({}, function(err, all){
      if(err){
          console.log(err);
      }
      else
      {
          res.render("campgrounds/index", {campgrounds:all}); 
      }
   });
   
});
//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
   var name = req.body.name;
   var image = req.body.url;
   var price = req.body.price;
   var desc = req.body.description;
   var author = {
      id:req.user._id,
      username:req.user.username
   };
   var campground = {name:name, image:image, description:desc, author:author, price:price};
   Campground.create(campground, function(err, newlycreated){
       if(err)
            console.log(err);
        else{

            res.redirect("/campgrounds");
        }
   })
});
//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
//SHOW ROUTE
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, Foundcampground){
        if(err)
            console.log(err);
        else{
            res.render("campgrounds/show", {campground:Foundcampground});
        }
    })
   
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, Foundcampground){
          res.render("campgrounds/edit", {campground:Foundcampground});
    });
});

//UPDATE CAMPGROUND ROUTE 
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err)
      res.redirect("/campgrounds");
    else
      res.redirect("/campgrounds/" + req.params.id);
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err)
      res.redirect("/campgrounds");
    else
    res.redirect("/campgrounds");
  })
});

module.exports = router;


