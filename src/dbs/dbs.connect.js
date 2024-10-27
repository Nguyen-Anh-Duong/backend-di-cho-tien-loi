"use strict";

const { default: mongoose } = require("mongoose");

//const connectString = process.env.DB_URL
const connectString = process.env.DB_URL_TEST;
mongoose
  .connect(connectString)
  .then((_) => console.log("Connect MongoDB successfully!!"))
  .catch((error) => console.log("Connect error!!"));

module.exports = mongoose;
