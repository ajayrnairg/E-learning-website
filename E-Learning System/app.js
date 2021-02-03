const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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
	name = req.body.username;
	const pass= req.body.pass;
	Student.exists({username: name , pass: pass}, function(err,doc){
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

app.post("/signup", function(req, res){
  const login = new Student ({
   username: req.body.username,
   pass: req.body.pass
 });
     console.log(req.body.username);
	 console.log(req.body.pass);
  login.save(function(err){
   if (!err){
	   res.redirect("/");
   }
 });

});