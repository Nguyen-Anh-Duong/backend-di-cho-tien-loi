"use strict";

const { default: mongoose } = require("mongoose");
require("dotenv").config();

const connectString =
  process.env.ENViRONMENT == "dev"
    ? process.env.DB_URL_TEST
    : process.env.DB_URL;

mongoose
  .connect(connectString)
  .then((_) => console.log("Connect MongoDB successfully!!"))
  .catch((error) => {
    console.log("Connect error!!");
    console.error(error);
  });

module.exports = mongoose;
