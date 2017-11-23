
var Bio = require("../models/biografies");

//All the middleware goes here 
var middleware = {
    
    
    isLogin: function(req, res, next){
                if(req.user){
                    next();
                }else {
                    req.flash("error", "You must Login First!");
                    res.redirect("/login");
                }
            },
    
    AuthenticOwnership: function(req, res, next){
            if(req.isAuthenticated()){
            Bio.findById( req.params.id, function(error, biographFoundEdit){
                   if(error){
                       console.log(error);
                       res.redirect("back");
                   } else {
                       if(biographFoundEdit.users.id.equals(req.user._id)){
                       console.log(biographFoundEdit);
                        next();
                       }else {
                           req.flash("error", "You are not allowed to do that when, You are not the creator of this Post");
                           res.redirect("back");
                       }
                   }
                });
            }else {
                req.flash("error", "You have to Login");
                res.redirect("back");
            }
    }
    
    
}


//var middlewareObj ={}

// middlewareObj.isLogin
// middlewareObj.AthenticOwnership
// middlewareObj.OwnershipAuthentic



module.exports = middleware ;