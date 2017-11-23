var express = require("express");
var router = express.Router();

var Bio = require("../models/biografies");

var middleware = require("../middleware/index.js");

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
   Bio.create(req.body.bio, function(error, biografyFound){
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
           res.redirect("/biografies");
       }
   }) ;
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
    Bio.findByIdAndUpdate( req.params.id, req.body.bio, function(error, biographFoundAndUpdate){
       if(error){
           console.log(error);
       } else {
           console.log(biographFoundAndUpdate);
           res.redirect("/biografies/" + req.params.id);
       }
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