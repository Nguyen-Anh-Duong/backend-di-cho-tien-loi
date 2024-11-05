"use strict";

const { default: mongoose } = require("mongoose");
require("dotenv").config();

const connectString = process.env.DB_URL;

mongoose
  .connect(connectString)
  .then((_) => console.log("Connect MongoDB successfully!!"))
  .catch((error) => console.log("Connect error!!"));

module.exports = mongoose;
