const express = require('express');
const cookieParser = require('cookie-parser');
const JWT= require('jsonwebtoken');

const TIME_LIMIT = 1000*60;
const {
  SESSION_EXPIRY = TIME_LIMIT,
  SESSION_NAME='sid',
  SESSION_SECRET='secret'
} = process.env;

const authToken={};

const crypto = require("crypto");

// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent

const auth = {
  setAuthToken:(req,res,next) => {
    console.log("Inside setAuthToken method")
    const userID = req.userID;
    console.log("!!!!!!!" + userID)
    const token = JWT.sign({userID}, SESSION_SECRET);
    console.log("Token" + token)
    res.cookie('access_token', token);
    next();
  },

  verifyAuthToken: (req, res,next) => {
    const token=req.cookies.access_token;
    console.log("Token in verify"+token)
    if(token)
    {
        const decoded = JWT.verify(token, SESSION_SECRET);
        console.log("USER Id" + decoded + decoded.userID);
      //if(decoded.userID!=='undefined'||decoded.userID!=='null'){
        console.log("Token is present ")
        req.id = decoded.userID;
        console.log("ID is present " + req.id);
    }
    next();
  },

  unsetAuthToken: (req, res) => {
    console.log("Inside unsettoken method")
    res.clearCookie('access_token');
    res.render('login',
    {
      message: 'Logged out !Please Login to Continue!',
      messageClass: 'alert-success'
    });
  },
};

module.exports = auth;
