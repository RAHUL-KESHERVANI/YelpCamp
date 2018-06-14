var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//--------------------------------------------------------
//COMMENT ROUTES

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, Foundcampground){
    if(err)
      console.log(err);
    else
      res.render("comments/new", {campground: Foundcampground});
  })
  
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  //find the campground by id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds")
    }
    else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        }
        else{
          //add username and id to comment
          comment.author.username = req.user.username;
          comment.author.id = req.user._id;
          //save comment
          comment.save();
          foundCampground.comments.push(comment);
          foundCampground.save();
          req.flash("success", "Successfully added your comment");
          //redirect to show page
          res.redirect("/campgrounds/" +  req.params.id);
        }
      })
    }
  });
});

//EDIT ROUTE
// /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
      if(err)
        res.redirect("back");
      else{
        res.render("comments/edit", {id: req.params.id, comment:comment});
      }
    })
      
  });

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err)
      res.redirect("back");
    else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});
//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err)
      res.redirect("back");
    else{
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;