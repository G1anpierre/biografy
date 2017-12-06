var express = require("express");
var router = express.Router();
var Bio = require("../models/biografies");
var middleware = require("../middleware/index.js");
var geocoder = require("geocoder");

//////////////////////////
// RESFULL ROUTES
//////////////////////////

router.get("/resfull", function(req, res){
   res.render("resfullRoutes/resfull"); 
});

router.get("/", function(req, res){
   res.render("resfullRoutes/home"); 
});

// INDEX

router.get("/biografies", function(req, res){
    Bio.find({}, function(error, biografiesFound){
       if(error){
           console.log(error);
       } else {
           res.render("resfullRoutes/biografias", {bioFound: biografiesFound} );
       }
    });
});

// NEW

router.get("/biografies/new", middleware.isLogin ,function(req, res){
   res.render("resfullRoutes/newForm"); 
});

// CREATE

router.post("/biografies", function(req, res){
   
   var name = req.body.name;
   var picture = req.body.picture;
   var year = req.body.year;
   var country = req.body.country;
   var description = req.body.description ;
   
   geocoder.geocode(req.body.location, function (err, data) {
    if(err){
        console.log('there is an error');
        console.log('err');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    console.log('********');    
   console.log(location);
   var newBio = {
       name: name,
       picture : picture,
       year : year,
       country : country,
       description : description,
       location : location,
       lat: lat,
       lng: lng
   }
   console.log('###########');
   console.log(newBio);
   req.checkBody("name", "name is required").notEmpty();
   req.checkBody("picture", "picture is required").notEmpty();
   req.checkBody("description", "description is required").notEmpty();
   
   var errors = req.validationErrors();
   
       if(errors){
           console.log(errors);
           
           res.render("resfullRoutes/newForm", {
               errores : errors
           });
       }else {
    
                Bio.create(newBio, function(error, biografyFound){
                       if(error){
                           console.log(error);
                       }else {
                           biografyFound.users.id = req.user._id;
                           biografyFound.users.username = req.user.username ;
                           biografyFound.save(function(error, saveUserInfo){
                               if(error){
                                   console.log(error);
                               }else {
                                   console.log(saveUserInfo);
                               }
                           });
                           console.log(biografyFound);
                           req.flash("success", "Biography Succesfully Added");
                           res.redirect("/biografies");
                       }
                }) ;
       }
   });
});

// SHOW Each detail 

router.get("/biografies/:id", function(req, res){
   Bio.findById(req.params.id).populate("comments").exec(function(error, biographFound){
       if(error){
           console.log(error);
       }else {
           console.log(biographFound);
           res.render("resfullRoutes/showDetail", { biographFound: biographFound});
       }
   });
});

//EDIT find biografy and render to a formular

router.get("/biografies/:id/edit", middleware.AuthenticOwnership, function(req, res){
        Bio.findById( req.params.id, function(error, biographFoundEdit){
           if(error){
               console.log(error);
           } else {
               res.render("resfullRoutes/editBioForm", {biographFoundEdit: biographFoundEdit});
           }
        });
});



//UPDATE find the update

router.put("/biografies/:id",function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.picture, year: req.body.year , country: req.body.country , description: req.body.description, location: location, lat: lat, lng: lng};
        Bio.findByIdAndUpdate( req.params.id, {$set: newData}, function(error, biographFoundAndUpdate){
           if(error){
               console.log(error);
           } else {
               console.log(biographFoundAndUpdate);
               res.redirect("/biografies/" + req.params.id);
           }
        });
    });
});

router.delete("/biografies/:id",middleware.AuthenticOwnership ,function(req, res){
   Bio.findByIdAndRemove( req.params.id , function(error, biographFoundAndRemove){
     if(error){
         console.log(error);
     }  else {
         console.log(biographFoundAndRemove);
         console.log("Deleted Succesfully!");
         req.flash("success", "You have succesfully Delete a Biography");
         res.redirect("/biografies");
     }
   });
});

 
            


module.exports = router;