const express = require("express");
const Router = express.Router();
// Load User model
const User = require("../models/Users");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const auth = require("../controller/auth.js")
require("dotenv").config();
const authcontroller = require("../controller/authController.js")


// GET request 
// Getting all the users
Router.get("/", loginController.getAll);


// POST request 
// Add a user to db
Router.post("/register",loginController.register);


// POST request 
Router.post("/googlelogin",loginController.google)


// Login
Router.post("/login", loginController.login);


Router.post('/refresh', auth,(req,res) => {
    try {
        const {user} = req
        const token =  jwt.sign(user,process.env.ACCESS_TOKEN_SECRET );
        return res.status(201).send(token)
    } catch (error) {
        return res.send(error)
    }
})

Router.get('/protected', auth, (req,res) => {
    try {
        return res.status(201).send("Protected Route")
    } catch (error) {
        return res.send({err})
    }
})

// EDIT profile
Router.post('/edit',loginController.edit);

Router.post('/email-send', authcontroller.emailSend)

Router.post('/reset-password', authcontroller.changePassword)

module.exports = Router;

