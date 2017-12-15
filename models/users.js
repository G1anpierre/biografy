
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
   username : String,
   password : String,
   email : String,
   isAdmin: { type: Boolean, default: false }
});

var User = mongoose.model("User", userSchema);

module.exports= User;