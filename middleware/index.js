var Campground = require("../models/campgrounds"),
    Comment    = require("../models/comment");

var MiddleObj = {};

MiddleObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You should log-in first to perform action!");
    res.redirect("/login");
}   

MiddleObj.checkCampgroundAuth = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err || !foundCampground){
                req.flash("error", "Sorry that campground does not exist.")
                res.redirect("back");
            }
            else if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You dont have permision to do that.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "You dont have permision to do that.");
        res.redirect("back");
    }
}

MiddleObj.checkCommentAuth = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err || !foundComment){
                req.flash("error", "Sorry that campground does not exist.")
                res.redirect("back");
            }
            else if(foundComment.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You dont have permision to do that.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "You dont have permision to do that."); 
        res.redirect("back");
    }
}

module.exports = MiddleObj;
