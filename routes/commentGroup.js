

var express = require("express");
var router = express.Router();

var Bio = require("../models/biografies");
var Comment = require("../models/comments");

var middleware =  require("../middleware/index.js");


///////////////////////////////////
// COMMENT ROUTES
//////////////////////////////////

router.get("/biografies/:id/comments/newComment", middleware.isLogin ,function(req, res){
    Bio.findById(req.params.id, function(error, BiographFound){
       if(error){
           console.log(error);
       } else {
           console.log(BiographFound);
           res.render("commentRoutes/newComment", {BiographFound: BiographFound});
       }
    });
});

router.post("/biografies/:id/comments", function(req, res){
    Bio.findById(req.params.id, function(error, BiographFound){
       if(error){
           console.log(error);
       } else {
           Comment.create(req.body.comments, function(error, commentCreated){
               if(error){
                   console.log(error);
               }else {
                   commentCreated.author.id = req.user._id;
                   commentCreated.author.username = req.user.username ;
                   commentCreated.save(function(error, saveUpdateComment){
                       if(error){
                           console.log(error);
                       }else{
                           console.log(saveUpdateComment);
                       }
                   });
                   console.log(commentCreated);
                   BiographFound.comments.push(commentCreated);
                   BiographFound.save(function(error, BioWithCommentSave){
                      if(error){
                          console.log(error);
                      } else{
                          console.log(BioWithCommentSave);
                          res.redirect("/biografies/" + req.params.id);
                      }
                   });
               }
           })
       }
    });
});

/////////////////////////////////
// SINGLE COMMENT EDITIONS
/////////////////////////////////

// EDIT SINGLE COMMENT -

router.get("/biografies/:id/comments/:id2/commentedit",function(req, res){
    Comment.findById(req.params.id2, function(error, singleCommentFound){
        if(error){
            console.log(error);
        }else {
            console.log(singleCommentFound);
            console.log(req.params.id);
            res.render("commentRoutes/editSingleComment", {singleCommentFound: singleCommentFound, id : req.params.id});
        }
    });
});



// UPDATE 

router.put("/biografies/:id/comments/:id2",function(req, res){
    console.log(req.body.comment);
   Comment.findByIdAndUpdate(req.params.id2, req.body.update, function(error, updateSingleComment){
      if(error){
          console.log(error);
      } else {
          console.log(req.params.id2);
          console.log(req.body.comment);
          console.log(updateSingleComment);
          res.redirect("/biografies/" + req.params.id );
      }
   }); 
});

router.delete("/biografies/:id/comments/:id2",function(req, res){
   Comment.findByIdAndRemove(req.params.id2, function(error){
       if(error){
           
           console.log(error);
           res.redirect("back");
       }else {
           res.redirect("/biografies/" + req.params.id );
       }
   }); 
});




module.exports = router;