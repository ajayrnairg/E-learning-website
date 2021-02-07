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
var db = mongoose.connect("mongodb://localhost:27017/educationDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
var name="";
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

const Student = mongoose.model("Student",loginSchema);
const Module = mongoose.model("Module",moduleSchema);
const Teacher = mongoose.model("Teacher", loginSchema1);
const Counseling = mongoose.model("Counseling", counselingSchema);


app.get("/", function(req,res){
	res.render("home");
});


app.get("/dashboard", function(req,res){
	res.render("dashboard");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});