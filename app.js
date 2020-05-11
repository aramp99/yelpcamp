var express                 = require('express'),
    app                     = express(),
    bodyparse               = require('body-parser'),
    mongoose                = require('mongoose'),
    seedDB                  = require("./seed"),
    Campground              = require("./models/campgrounds"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    passport                = require("passport"),
    flash                   = require('connect-flash'),
    LocalStrategy           = require("passport-local"),
    passportlocalmongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override");

var CampgroundRoutes        = require("./routes/campground"),
    CommentRoutes           = require("./routes/comment"),
    IndexRoutes             = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true } );
app.set("view engine", "ejs");
app.use(flash());
app.use(bodyparse.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); // seed databaase

app.use(require("express-session")({
   secret:"becoming a full stack developer",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

app.use(CampgroundRoutes);
app.use(CommentRoutes);
app.use(IndexRoutes);

//SERVER PORT 5555
app.listen(5555, function(){
    console.log("Yelp server is running..");
});