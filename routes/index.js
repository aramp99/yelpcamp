var express     = require('express'),
    router      = express.Router(),
    User        = require("../models/user"),
    passport    = require('passport');


//LANDING PAGE
router.get("/", (req, res) =>  {
    res.render("index");
});


//AUTH
router.get("/register", (req,res)=>{
    res.render("register");
});

router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, addeduser)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + addeduser.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN
router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }), (res, req)=>{}
);

//LOGOUT
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Successfully Logged out!" );
    res.redirect("/");
});


module.exports = router;