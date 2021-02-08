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
const perf = require("execution-time")();
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
var warnsignlog="";
var timeof="";
const loginSchema = {
 username: String,
 pass: String,
 email: String,
 address: String,
 institution: String,
 plan: String,
 points: Number,
 timeep: Number 
};

const moduleSchema = {
	username: String,
	module: String,
	quizresult: Number
};
const loginSchema1 = {
	username: String,
	pass: String,
	email: String,
  address: String,
  institution: String

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


app.get("/math", function(req,res){
	if(req.session.username)
	{
	res.render("math");
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/", function(req,res){
	console.log(warnsignlog);
	res.render("home");
});

app.post("/", function(req,res){
	var m = req.body.signup;
	var m1 = req.body.login;
	if(m === "signup")
	{
		Student.exists({username: req.body.uname , email: req.body.email}, function(err,doce){
			if(doce === true)
			{
				alert("Account already existsplease login");
				res.redirect("/");
			}
			else if(doce === false)
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
        points: 1,
		timeep: 0
    });
    login.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	res.redirect("/");
    });
	}
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
app.get("/teacher/home", function(req,res){

	res.render("teacherhome");
});


app.post("/teacher/home", function(req,res){
	var m = req.body.signup;
	var m1 = req.body.login;
	if(m === "signup")
	{
		Teacher.exists({username: req.body.uname , email: req.body.email}, function(err,doce){
			if(doce === true)
			{
				alert("Account already existsplease login");
				res.redirect("/teacher/home");
			}
			else if(doce === false)
			{
	    var salt = "Xy";
	    var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
        var passhash = hashed + salt;
        const login1 = new Teacher ({
        username: req.body.uname,
        pass: passhash,
		email: req.body.email,
		address: req.body.addr,
		institution: req.body.insttt,

    });
    login1.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	res.redirect("/teacher/home");
    });
	}
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
	Teacher.exists({username: name , pass: passhash}, function(err,doc){
		if(err){
			console.log(err);
			console.log("Invalid username or password");
		}
		else{
			if(doc===true){
				req.session.username1 = req.body.uname;
				req.session.pass1 = req.body.pass;
				res.redirect("/teacher/dashboard");
			}
			else if(doc===false)
			{
					alert("Invalid username or password or enterned invalid plan");
				console.log("Invalid username or password or enterned invalid plan");
				res.redirect("/teacher/home");
			}
		}
	});
	}
});

app.get("/dashboard", function(req,res){
	if(req.session.username)
	{
	perf.start();
	Student.findOne({username: req.session.username}, function(err , tempe){
		req.session.time = tempe.timeep + timeof;
		Student.findOneAndUpdate({username: req.session.username}, {timeep: req.session.time} , function(err , uptime){
			if(!err){
				uptime.save();
			}
		});
		var s = Math.floor(((req.session.time)/1000) % 60);
		console.log(s);
		var m = Math.floor((req.session.time)/60000 % 60);
		console.log(m);
		var h = Math.floor((req.session.time)/3600000 % 24);
		console.log(h);
	res.render("dashboard", {name: req.session.username , hour: h , second: s , minute: m});
	});
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/logout", function(req,res){
	const results = perf.stop();
	timeof = results.time;
	req.session.destroy();
	res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/teacher/dashboard", function(req,res){
	if(req.session.username1){
		Student.find({}, function(err , postsse){
		console.log("hh");
	    res.render("teacherdashboard", {students: postsse});
	    });
	}
	else{
		res.send("Not logged in");
	}
});
app.get("/progress/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Student.findOne({_id: requestedPostId}, function(err, postsss){
   req.session.username = postsss.username;
   res.redirect("/dashboard");
   });
 });
