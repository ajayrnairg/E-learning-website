const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const session = require('express-session');
const fs = require("fs");
var XLSV = require("xlsx");
var alert = require("alert");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
	secret: 'Your secret key',
	resave: true,
	saveUninitialized: true
}));
var db = mongoose.connect("mongodb://localhost:27017/educationDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
var name="";
const loginSchema = {
 username: String,
 pass: String,
 email: String,
 address: String,
 institution: String,
 plan: String,
 points: Number
};

const moduleSchema = {
	username: String,
	module: String,
	quizresult: Number
};
const loginSchema1 = {
	username: String,
	pass: String

};

const counselingSchema = {
	studentusername: String,
	teacherusername: String,
	description: String,
	time: String
}

const Student = mongoose.model("Student",loginSchema);
const Module = mongoose.model("Module",moduleSchema);
const Teacher = mongoose.model("Teacher", loginSchema1);
const Counseling = mongoose.model("Counseling", counselingSchema);


app.get("/", function(req,res){
	res.render("home");
});

app.post("/", function(req,res){
	var m = req.body.signup;
	var m1 = req.body.login;
	if(m === "signup")
	{
	    var salt = "Xy";
	    var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
        var passhash = hashed + salt;
        const login = new Student ({
        username: req.body.uname,
        pass: passhash,
		email: req.body.email,
		address: req.body.addr,
		institution: req.body.insttt,
		plan: req.body.plan,
        points: 1
    });
    login.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	res.redirect("/");
    });
	}
	if(m1 === "login")
	{
		var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;
	var name = req.body.uname;
	const pass= req.body.pass;
	if(req.body.uname<1 && req.body.pass<1)
	{
		alert("Please enter details");
	}
	Student.exists({username: name , pass: passhash , plan: req.body.planlogin}, function(err,doc){
		if(err){
			console.log(err);
			console.log("Invalid username or password");
		}
		else{
			if(doc===true){
				req.session.username = req.body.uname;
				req.session.pass = req.body.pass;
				req.session.plan = req.body.planlogin;
				res.redirect("/dashboard");
			}
			else if(doc===false)
			{
					alert("Invalid username or password or enterned invalid plan");
				console.log("Invalid username or password or enterned invalid plan");
				res.redirect("/");
			}
		}
	});
	}
});


app.get("/dashboard", function(req,res){
	res.render("dashboard");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});