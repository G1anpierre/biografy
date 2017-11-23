
var express = require("express");
var router = express.Router();

var User = require("../models/users");
var bcrypt = require("bcryptjs");
var passport = require("passport");

////////////////////////////
// USER AUTHENTICATION ROUTES
////////////////////////////

router.get("/register", function(req, res){
   res.render("authentRoutes/registration"); 
});

router.post("/register", function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    
    req.checkBody("username", "username is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password2", "Passwords do not match").equals(req.body.password);
    
    var errors = req.validationErrors();
    
    if(errors){
        console.log(errors);
    
        res.render("authentRoutes/registration", {
            errores: errors
        });
       
    } else {
            var newuser = new User({
                username: username,
                password: password,
                email : email 
            });
            
            bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newuser.password, salt, function(err, hash) {
                        // Store hash in your password DB. 
                        if(err){
                            console.log(err);
                        }else {
                            newuser.password = hash;
                            
                            newuser.save(function(error, saveItem){
                               if(error){
                                   console.log(error);
                               } else {
                                   console.log(saveItem);
                                   req.flash("success", "You are Succesfully Register");
                                   res.redirect("/login");
                               }
                            });
                        }
                    });
            });
    }
});

router.get("/login", function(req, res){
   res.render("authentRoutes/login"); 
});

router.post("/login", passport.authenticate('local', { successRedirect: '/biografies',
                                                    failureRedirect: '/login',
                                                    successFlash: 'Welcome!' ,
                                                    failureFlash: true
                                                 })
);

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are finally LogOut");
    res.redirect("/");
});


module.exports = router;