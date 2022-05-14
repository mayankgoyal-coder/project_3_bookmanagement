const jwt = require("jsonwebtoken")
const bookModel = require('../models/bookModel')
const mongoose=require('mongoose')

const authentication = function (req, res, next) {

 
try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-Api-key"];
    if (!token)
      return res.status(400).send({ status: false, msg: "token is mandatory" });

    let decodeToken = jwt.verify(token, "Project3/BookManagement(@#@42)");
    if (!decodeToken)
      return res.status(401).send({ status: false, msg: "invalid Token" });

    next();
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: err.message });
  } 
};
module.exports.authentication = authentication;