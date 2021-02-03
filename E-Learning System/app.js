const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const session = require('express-session');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({secret: "Shh, its a secret!"}));
var db = mongoose.connect("mongodb://localhost:27017/elearnDB", {useNewUrlParser: true, useUnifiedTopology: true});
var name="";
const loginSchema = {
 username: String,
 pass: String
};

const Student = mongoose.model("Student",loginSchema);


app.get("/", function(req,res){
	res.render("home");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/login", function(req,res){
	res.render("login");
});

app.get("/signup", function(req,res){
	res.render("signup");
});

app.get("/survey", function(req,res){
	res.render("survey");
});

app.get("/videolec", function(req,res){
	res.render("videolec");
});

app.get("/formulasheet", function(req,res){
	res.render("formulasheet");
});

app.get("/Books", function(req,res){
	res.render("Books");
});

app.get("/Quiz", function(req,res){
	res.render("Quiz");
});



app.post("/login", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;
	name = req.body.username;
	const pass= req.body.pass;
	Student.exists({username: name , pass: passhash}, function(err,doc){
		if(err){
			console.log(err);
			console.log("Invalid username or password");
		}
		else{
			if(doc===true){
				res.redirect("/dashboard");				
			}
			else if(doc===false)
			{
				console.log("Invalid username or password");
				res.redirect("/login");
			}
		}
	});
});

app.get("/dashboard", function(req,res){
	res.render("dashboard", {username: name});
});

app.get("/videolec", function(req,res){
	req.session.cbx++;
});

app.post("/dash", function(req,res){
	res.render("dash", {points: req.session.cbx});
});

app.post("/signup", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;  
  const login = new Student ({
   username: req.body.username,
   pass: passhash
 });
  login.save(function(err){
   if (!err){
	   res.redirect("/");
   }
 });

});