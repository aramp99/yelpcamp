var mongoose = require("mongoose");

//SCHEMA SETUP YELP Campgrounds
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment" // name of the model
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);