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
var rankss = [];

var ranks=[];
const loginSchema = {
 username: String,
 pass: String,
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
const rankingSchema = {
	username: String,
	rankss: Number 
}
const Student = mongoose.model("Student",loginSchema);
const Module = mongoose.model("Module",moduleSchema);
const Teacher = mongoose.model("Teacher", loginSchema1);
const Counseling = mongoose.model("Counseling", counselingSchema);
const Ranking = mongoose.model("Ranking", rankingSchema);
app.get("/teacher/signup", function(req,res){
	res.render("teachersignup");
});
console.log("ok");
app.get("/teacher/login", function(req, res){
	res.render("teacherlogin");
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

app.get("/counseling", function(req,res){
	if(req.session.username){
		Teacher.find({}, function(err , posttea){
		console.log("hh");
		console.log("postea");
	    res.render("counseling", {teachers: posttea});
	    });
	}
	else{
		res.send("Not logged in");
	}
});

app.get("/doubtsolving", function(req,res){
	res.render("doubtsolving");
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

app.get("/ttcounseling", function(req,res){
		Counseling.find({}, function(err , posttacoun){
		console.log("hh");
		console.log(posttacoun);
	    res.render("ttcounseling", {counselingsss: posttacoun});
	    });
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

app.get("/teacher/counselling", function(req,res){
	if(req.session.username1)
	{
	Counseling.find({}, function(err , postteacoun){
		console.log("hh");
		console.log(postteacoun);
	    res.render("teachercounseling", {counselingss: postteacoun});
	    });
	}
	else{
		res.send("Not log in");
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
app.post("/teacher/login", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;
	name = req.body.username;
	const pass= req.body.pass;
	Teacher.exists({username: name , pass: passhash}, function(err,doc){
		if(err){
			console.log(err);
			console.log("Invalid username or password");
		}
		else{
			if(doc===true){
				req.session.username1 = req.body.username;
				req.session.pass1 = req.body.pass;
				res.redirect("/teacher/dashboard");
			}
			else if(doc===false)
			{
				console.log("Invalid username or password");
				res.redirect("/teacherlogin");
			}
		}
	});
});

app.get("/dashboard", function(req,res){
	if(req.session.username){
		Student.find({}, "username points", function(err , rank){
		Ranking.findOne({username: req.session.username}, function(err , postta){
		Ranking.remove({}, function(err){
			console.log("removed");
		});
		Student.find({}, function(err , stu){
		for(var i=0;i<rank.length;i++)
		{
		const rankeeo = new Ranking({
			username: rank[i].username,
			rankss: i+1
		});
		rankeeo.save(function(err){
 	    console.log("Success rankeeo");
        });
		}
	    if(err){
		console.log(err);
	    }
		Module.find({username: req.session.username}, function(err , postss){
		console.log(postss);
		Student.findOne({username: req.session.username}, function(err , post){
		console.log("hh");
		var mm = post._id;
		console.log(post.points);
		console.log(post.quizresult);
	res.render("dashboard", {username: req.session.username , points: post.points , modules: postss , ranksss: postta.rankss , students: stu});
	});
	});
	});
	});
    }).sort('field -points');
	}
	else{
		res.send("Not logged in");
	}
});

app.post("/videolec", function(req,res){
	var values= [];
	if(req.body.cbx === "option1")
	{
		values.push(req.body.cbx);
		  var val = 0;
	    console.log(values);
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
	}
	else{
	for(var i=0;i<req.body.cbx.length;i++)
	{
		values.push(req.body.cbx[i]);

	}
	 var val = 0;
	 console.log(values);
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
	}
	res.redirect("/videolec");
});


app.post("/teacher/counselling", function(req,res){
	req.session.username = req.body.studentsub;
	req.session.description = req.body.description;
	console.log(req.body.time);
	var tm = req.body.time;
	console.log("I am"+tm);
	Counseling.findOneAndUpdate({description: req.body.description}, {time: tm}, function(err, foundListss){
      if (!err){
		  foundListss.save();
		  console.log("success updated time");
      }
    });
	res.redirect("/ttcounseling");
});


app.get("/teacher/dashboard", function(req,res){
	if(req.session.username1){
		Student.find({}, function(err , postsse){
			Teacher.findOne({username: req.session.username1}, function(err , post){
		console.log("hh");
	    res.render("teacherdashboard", {username: name , students: postsse});
	    });
		});
	}
	else{
		res.send("Not logged in");
	}
});

app.post("/quiz", function(req,res){
	console.log(req.body.moduleone);
	var m = req.body.moduleone;
	var m1 = req.body.moduletwo;
	if(m === "Module1")
	{
	var c = 0;
	var qmodone1 = req.body.question1;
	var qmodone2 = req.body.question2;
	if(qmodone1 === "Yes")
	{
		c++;
	}
	if(qmodone2 === "I am fine")
	{
		c++;
	}
	console.log(c);
	req.session.quizr = c;
	console.log(m);
	Module.findOneAndUpdate({username: req.session.username , module: m} ,  {quizresult: req.session.quizr}, function(err, foundList){
      if (!err){
		  foundList.save();
      }
    });
	res.redirect("/quiz");
	}
	if(m1 === "Module2")
	{
	var c1 = 0;
	var qmodtwo1 = req.body.question1;
	var qmodtwo2 = req.body.question2;
	if(qmodtwo1 === "I am fine")
	{
		c1++;
	}
	if(qmodtwo2 === "I am ok")
	{
		c1++;
	}
	console.log(c1);
	req.session.quizrr = c1;
	console.log(m1);
	Module.findOneAndUpdate({username: req.session.username , module: m1} ,  {quizresult: req.session.quizrr}, function(err, foundList){
      if (!err){
		  foundList.save();
      }
    });
	res.redirect("/quiz");
	}
});

app.get("/logout", function(req,res){
	req.session.destroy();
	res.redirect("/");
})
app.post("/teacher/signup", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;
  const login1 = new Teacher ({
   username: req.body.username,
   pass: passhash

 });
  login1.save(function(err){
   if (!err){
	   res.redirect("/");
   }
 });

});

app.post("/signup", function(req, res){
	var salt = "Xy";
	var hashed = crypto.createHash('md5').update(req.body.pass).digest("hex");
   var passhash = hashed + salt;
  const login = new Student ({
   username: req.body.username,
   pass: passhash,
   points: 1
 });
  login.save(function(err){
   if (!err){
	   console.log("Success login");
   }
 });
 const mod = new Module ({
	 username: req.body.username,
	 module: "Module1",
	 quizresult: 0
 });
 mod.save(function(err){
	 if(!err){
		 console.log("Success mod 1");
	 }
 });
 const mod1 = new Module ({
	 username: req.body.username,
	 module: "Module2",
	 quizresult: 0
 });
 mod1.save(function(err){
	console.log("Success mod 2");
 });
res.redirect("/login");
});

app.get("/rank", function(req,res){
});

app.get("/progress/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Student.findOne({_id: requestedPostId}, function(err, postsss){
   req.session.username = postsss.username;
   res.redirect("/dashboard");
   });
 });


app.post("/counseling", function(req,res){
	console.log(req.body.studentsubmit);
	req.session.username1 = req.body.studentsubmit;
	const coun = new Counseling({
	 studentusername: req.session.username,
	 teacherusername: req.body.studentsubmit,
	 description: req.body.description,
	 time: "0"
 });
 coun.save(function(err){
	console.log("Success inserted counselling");
 });
 res.redirect("/teacher/counselling");
});







