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
	modulepoints: Number,
	quizresult: Number,
	attempts: Number
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
const rankingSchema = {
	username: String,
	rankss: Number 
}

const Student = mongoose.model("Student",loginSchema);
const Module = mongoose.model("Module",moduleSchema);
const Teacher = mongoose.model("Teacher", loginSchema1);
const Counseling = mongoose.model("Counseling", counselingSchema);
const Ranking = mongoose.model("Ranking", rankingSchema);

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

app.get("/module4", function(req,res){
	if(req.session.username)
	{
	res.render("module4");
	}
	else{
		res.send("Not log in");
	}
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
	const mod1 = new Module ({
        username: req.body.uname,
        module: "Module1",
		modulepoints: 0,
		quizresult: 0,
		attempts: 0
    });
	const mod2 = new Module ({
        username: req.body.uname,
        module: "Module2",
		modulepoints: 0,
		quizresult: 0,
		attempts: 0
    });
    login.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	console.log("Success login");
    });
	mod1.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	console.log("Success mod1");
    });
	mod2.save(function(err){
    if (!err){
	   console.log("Success inserted account");
    }
	console.log("Success mod2");
    });
	res.redirect("/");
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

app.get("/module1quiz", function(req,res){
	if(req.session.username)
	{
	res.render("quiz2");
	}
	else{
		res.send("Not log in");
	}
});

app.get("/module2quiz", function(req,res){
	if(req.session.username)
	{
	res.render("module2");
	}
	else{
		res.send("Not log in");
	}
});
app.get("/module1answerquiz", function(req,res){
	if(req.session.username)
	{
        res.render("quiz2answerkey");		
	}
	else{
		res.send("Not log in");
	}
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
		Module.find({username: req.session.username}, function(err , postss){
		var s = Math.floor(((req.session.time)/1000) % 60);
		console.log(s);
		var m = Math.floor((req.session.time)/60000 % 60);
		console.log(m);
		var h = Math.floor((req.session.time)/3600000 % 24);
		console.log(h);
	res.render("dashboard", {name: req.session.username , hour: h , second: s , minute: m , modules: postss , ranksss: postta.rankss});
	});
	});
	});
	}).sort('field -points');
	});
	}
	else{
		res.send("Not logged in");
	}
});

app.post("/module4", function(req,res){
	var values= [];
	console.log(req.body.cbx);
	if(req.body.cbx === "cbx")
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
	res.redirect("/module4");
});

app.post("/module1quiz", function(req,res){
	var m = req.body.moduleone;
	var c = 0;
	var qmodone1 = req.body.question1;
	var qmodone2 = req.body.question2;
	var qmodone3 = req.body.question3;
	var qmodone4 = req.body.question4;
	var qmodone5 = req.body.question5;
	var qmodone6 = req.body.question6;
	var qmodone7 = req.body.question7;
	var qmodone8 = req.body.question8;
	var qmodone9 = req.body.question9;
	var qmodone10 = req.body.question10;
	if(qmodone1 === "25200")
	{
		c++;
	}
	if(qmodone2 === "209")
	{
		c++;
	}
	if(qmodone3 === "720")
	{
		c++;
	}
	if(qmodone4 === "50400")
	{
		c++;
	}
	if(qmodone5 === "63")
	{
		c++;
	}
	if(qmodone6 === "120960")
	{
		c++;
	}
	if(qmodone7 === "11760")
	{
		c++;
	}
	if(qmodone8 === "720")
	{
		c++;
	}
	if(qmodone9 === "8")
	{
		c++;
	}
	if(qmodone10 === "36")
	{
		c++;
	}
	console.log(c);
	req.session.quizr = c;
	Module.findOne({username: req.session.username , module: m}, function(err , att){
		var attm = att.attempts;
		var attm = attm + 1;
		Module.findOneAndUpdate({username: req.session.username , module: m} , {quizresult: req.session.quizr , attempts: attm}, function(err, foundList){
        if (!err){
		  foundList.save();
        }
     });
	});
	res.redirect("/module1answerquiz");
});

app.post("/module2quiz", function(req,res){
	var m = req.body.moduletwo;
	var c = 0;
	var qmodone1 = req.body.question1;
	var qmodone2 = req.body.question2;
	var qmodone3 = req.body.question3;
	var qmodone4 = req.body.question4;
	var qmodone5 = req.body.question5;
	var qmodone6 = req.body.question6;
	var qmodone7 = req.body.question7;
	var qmodone8 = req.body.question8;
	var qmodone9 = req.body.question9;
	var qmodone10 = req.body.question10;
	if(qmodone1 === "1/26")
	{
		c++;
	}
	if(qmodone2 === "2/91")
	{
		c++;
	}
	if(qmodone3 === "13/102")
	{
		c++;
	}
	if(qmodone4 === "9/52")
	{
		c++;
	}
	if(qmodone5 === "4/7")
	{
		c++;
	}
	if(qmodone6 === "3/4")
	{
		c++;
	}
	if(qmodone7 === "21/46")
	{
		c++;
	}
	if(qmodone8 === "2/7")
	{
		c++;
	}
	if(qmodone9 === "1/221")
	{
		c++;
	}
	if(qmodone10 === "5/12")
	{
		c++;
	}
	console.log(c);
	req.session.quizr = c;
	Module.findOne({username: req.session.username , module: m}, function(err , att){
		var attm = att.attempts;
		var attm = attm + 1;
		Module.findOneAndUpdate({username: req.session.username , module: m} , {quizresult: req.session.quizr , attempts: attm}, function(err, foundList){
        if (!err){
		  foundList.save();
        }
     });
	});
	res.redirect("/module2quiz");
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
