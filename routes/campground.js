var express     = require('express'),
    router      = express.Router(),
    Campground  = require("../models/campgrounds"),
    middleware  = require("../middleware");



// Campground.create({}, (err, newcamp) => {
//     if(err){   
//         console.log(err);   
//     }
//     else{   
//         console.log("NEW CAMP ADDED" + newcamp);    
//     }
// });

// var campgrounds = [ 
//     {   name: "Kodachadri", image: "https://www.nativeplanet.com/img/2014/09/29-kodachadri1.jpg" },
//     {   name: "Mudumalai", image: "https://cdn.s3waas.gov.in/s339461a19e9eddfb385ea76b26521ea48/uploads/bfi_thumb/2018060783-olw8ndkumov6w8asiig4fttve7pfc4b4pylrzxl18q.jpg" },
//     {   name: "Yelagiri", image: "https://k6u8v6y8.stackpathcdn.com/blog/wp-content/uploads/2018/04/places-to-visit-things-to-do-yelagiri-2.png" },
//     {   name: "Godavari River Camp", image: "https://www.nativeplanet.com/img/2014/09/29-godavari1.jpg" }
// ]

//CAMPGROUNDS PAGE - GET
router.get("/campgrounds", (req, res) =>   {
    //res.render("campgrounds", { camp: campgrounds});

    //USING DB
    Campground.find({}, (err, camp_db) => {
        if(err || !camp_db){
            req.flash("error", "Sorry that campground does not exist.")
            res.redirect("back");   
            console.log(err);   
        }
        else{   
             res.render("campgrounds", { camp: camp_db, currentUser: req.user});    
        }

    });
});

//CAMPGROUNDS PAGE - POST
router.post("/campgrounds", middleware.isLoggedIn, (req, res) =>  {
    // var name = req.body.name;
    // var image = req.body.image;
    // var description = req.body.description;
    req.body.campground.author = {
        id: req.user._id,
        username : req.user.username
    }
    // var newcamp = { name: name, image: image, description: description, author: author};
    // // campgrounds.push(newcamp);

    //CREATE NEW OBJ FOR DB
    Campground.create(req.body.campground, (err, newcamp) => {
            if(err){   
                console.log(err);   
            }
            else{   
                console.log("NEW CAMP ADDED" + newcamp); 
                res.redirect("/campgrounds");   
            }
        });
});

//ADD CAMPGROUNDS PAGE 
router.get("/campgrounds/add", middleware.isLoggedIn, (req, res) =>  {
    res.render("addCamp");
});

//CAMPGROUNDS INFO PAGE
router.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, idcamp) => {
        if(err || !idcamp){
            req.flash("error", "Sorry that campground does not exist.")  
            res.redirect("back"); 
            console.log(err);   
        }
        else{   
             res.render("show", { camp: idcamp });    
        }

    });
});

//EDIT CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.checkCampgroundAuth, (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
            res.render("edit", {camp: foundCampground});
        });
});

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundAuth, (req,res)=>{

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated)=>{
            res.redirect("/campgrounds/"+req.params.id);
        });
});

//DELETE
router.delete("/campgrounds/:id", middleware.checkCampgroundAuth, (req,res)=>{
    Campground.findByIdAndDelete(req.params.id, (err)=>{
            res.redirect("/campgrounds");
        });
});

module.exports = router;