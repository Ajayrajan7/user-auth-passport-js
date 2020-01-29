 var express         = require("express"),
     app             = express(),
     mongoose        = require("mongoose"),
     bodyParser      = require("body-parser"),
     User            = require("./models/user.js"),
     passport        = require("passport"),
     localStrategy   = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose")
   
 
 
 mongoose.connect("mongodb://localhost/user_auth");
 
 app.set("view engine","ejs");
 app.use(bodyParser.urlencoded({extended:true}));

//PASSPORT CONFIG

 
  //For requiring and using session
 app.use(require("express-session")({
     secret:"Engineering is ridiculous",
     resave: false,
     saveUninitialized: false
 }));
 
 app.use(passport.initialize());
 app.use(passport.session());
 
 passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 
 

 //ROUTES
 
 //ROOT route
 
 app.get("/",function(req, res){
    res.render("home"); 
 });
 
 //Secret route

//isLoggedIn middleware checks whether user logged in or  not

app.get("/secret",isLoggedIn,function(req, res){
   res.render("secret"); 
});
 
 //Auth route
 
 //To display sign up form
 
 app.get("/register",function(req, res) {
    res.render("register"); 
 });
 
 
 //To store user data using passport
//Here we store onnly username in db, we store encoded password.

app.post("/register",function(req, res){
   
   User.register(new User({username:req.body.username}),req.body.password,function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
         passport.authenticate("local")(req, res, function(){
         res.redirect("/secret"); 
      });
   }); 
}); 


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


///Login routes

app.get("/login",function(req, res) {
   res.render("login"); 
});


//To perform login
//This is called middleware-which runs before the callback function

app.post("/login",passport.authenticate("local",{
      successRedirect:"/secret",
      failureRedirect:"/login"
}),function(req, res){
    
});

//Logout routes

app.get("/logout",function(req, res) {
   req.logout();
   res.redirect("/");
});


 //To start and listen the server
 app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server has started"); 
 });