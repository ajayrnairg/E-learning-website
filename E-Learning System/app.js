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
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
	secret: 'Your secret key',
	resave: true,
	saveUninitialized: true
}));
var db = mongoose.connect("mongodb://localhost:27017/elearnDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
var name="";
const loginSchema = {
 username: String,
 pass: String,
 points: Number,
 quizresult: Number
};

const Student = mongoose.model("Student",loginSchema);
app.get("/teacher", function(req,res){
	res.render("teacher");
});

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
	if(req.session.username){
	res.render("survey");
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/videolec", function(req,res){
	if(req.session.username){
	res.render("videolec");
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/formulasheet", function(req,res){
	if(req.session.username){
	res.render("formulasheet");
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/Books", function(req,res){
	if(req.session.username){
	res.render("Books");
	}
	else{
		res.send("Not logged in");
	}
	
});

app.get("/Quiz", function(req,res){
	if(req.session.username){
	res.render("Quiz");
	}
	else{
		res.send("Not logged in");
	}
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
				req.session.username = req.body.username;
				req.session.pass = req.body.pass;
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
	if(req.session.username){
		Student.findOne({username: req.session.username}, function(err , post){
		console.log("hh");
		console.log(post.points);
		console.log(post.quizresult);
	res.render("dashboard", {username: name , points: post.points , quizres: post.quizresult});
	});
	}
	else{
		res.send("Not logged in");
	}
});

app.post("/videolec", function(req,res){
	var values= [];
	for(var i=0;i<req.body.cbx.length;i++)
	{
		values.push(req.body.cbx[i]);
		
	}
	 var val = 0;
	Student.findOne({username: req.session.username}, function(err , post){
		console.log(post.points);
		req.session.value =post.points  + values.length;
	console.log(values.length);
	console.log(req.session.value);
	Student.findOneAndUpdate({username: req.session.username}, {points: req.session.value}, function(err, foundList){
      if (!err){
		  foundList.save();
      }
    });
	});
	res.redirect("/videolec");
});



app.post("/quiz", function(req,res){
	var c = 0;
	var q1 = req.body.question1;
	var q2 = req.body.question2;
	if(q1 === "Yes")
	{
		c++;
	}
	if(q2 === "I am fine")
	{
		c++;
	}
	console.log(c);
	req.session.quizr = c;
	Student.findOneAndUpdate({username: req.session.username}, {quizresult: req.session.quizr}, function(err, foundList){
      if (!err){
		  foundList.save();
      }
    });
	res.redirect("/quiz");
});

app.get("/logout", function(req,res){
	req.session.destroy();
	res.redirect("/");
})

app.post("/signup", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;  
  const login = new Student ({
   username: req.body.username,
   pass: passhash,
   points: 1,
   quizresult: 0
 });
  login.save(function(err){
   if (!err){
	   res.redirect("/");
   }
 });

});
















