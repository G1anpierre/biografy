
var mongoose = require("mongoose");

var bioSchema = new mongoose.Schema({
   name: String,
   picture: String,
   year: Number,
   country: String, 
   description: String,
   comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
         }
      ],
   users : {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username : String
   }
   
});

var Bio = mongoose.model("Bio", bioSchema);

module.exports = Bio;