require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save().
        then(console.log(res.render("secrets"))).
        catch(err => console.log(err));
});

app.post("/login", function(req,res){
    const email= req.body.username;
    const password= req.body.password;
    
    User.findOne({email: email}).exec().
        then((foundUser) => {
            if(foundUser != null && foundUser.password == password){
                res.render("secrets");
            }
            else{
                res.render("login");
            }
        }).
        catch(err => console.log(err));
});

app.listen("3000", function(){
    console.log("server started at 3000 port");
})
