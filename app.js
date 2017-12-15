
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var methodOverride = require('method-override');
var expressValidator = require("express-validator");
var bcrypt = require('bcryptjs');
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Bio = require("./models/biografies");
var User = require("./models/users");
var Comment = require("./models/comments");


var resfullGroup = require("./routes/resfullGroup");
var commentGroup = require("./routes/commentGroup");
var authenticGroup = require("./routes/authenticGroup");

// APPLICATION CONFIG

console.log(process.env.DATABASEURL);

//mongoose.connect('mongodb://localhost/myapp_data');

mongoose.connect(process.env.DATABASEURL);

//This Step from down here was Add it as Enviroment Variable DATABASEURL in Heroku :)
//mongoose.connect('mongodb://gia:italia@ds141328.mlab.com:41328/biography');

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressValidator());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// PASSPORT CONFIGURATION

app.use(session({
    secret: "My Oli Loli is die Beste", 
    resave: false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

// this is use whe the users log in, authenticate

passport.use(new LocalStrategy(
        function(username, password, done){
        
        // Match username
        
        User.findOne({ username: username }, function (err, user) {
            if(err){
                console.log(err);
                return done(err);
            }
            if(!user) {
                return done(null, false, { message: "Incorrect usernanme."});
            }
           // if(!user.validPassword(password)){
        //        return done(null, false, { message: "Incorrect password."});
          //  }
            return done(null, user);
        //Match Password 
            bcrypt.compare(password, user.password, function(err, res) {
                    // res === true 
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    if(res){
                        return done(null, user);
                    } else {
                        return done(null, false, {message : "wrong password"});
                    }
            });
        });
    }
    ));

passport.serializeUser(function(user, done) {
      done(null, user.id);
});

passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
});

app.use(function(req, res, next){
    res.locals.logeado = req.user;
    res.locals.errors = req.flash("error"); 
    res.locals.successes = req.flash("success");
    res.locals.errores = req.flash("errores");
    next();
});

app.use(resfullGroup);
app.use(commentGroup);
app.use(authenticGroup);





app.listen( 3000, function(){
   console.log("Application has Started! on port 3000") ;
});