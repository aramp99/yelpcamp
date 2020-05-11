var express     = require('express'),
    router      = express.Router(),
    Campground  = require("../models/campgrounds"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//ADD COMMENTS
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    var content = req.body.content;
    var newcomment = {
            content: content
    }
    Campground.findById(req.params.id, (error, campground)=>{
        if(error){
            console.log(error);
        }
        else{
            Comment.create(newcomment, (err, added) =>{
                if(err){
                    console.log(err);
                }
                else{
                    added.author.id = req.user._id;
                    added.author.username = req.user.username;
                    added.save();
                    campground.comments.push(added);
                    campground.save();
                    console.log("Added new comment");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

//UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentAuth, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuth, (req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;