"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const { NotFoundError } = require("./core/error.response");
require("dotenv").config();
const swagger = require("./swagger");
const app = express();
const { createUserAdmin } = require("./utils/createUserAdmin");

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
//swagger 
swagger(app);

//init db
require("./dbs/dbs.connect");
//  createUserAdmin();
//init route
app.use("/", require("./routes"));

//handle error

app.use((req, res, next) => {
  const error = new Error("This route is not exist!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Server Error!!",
  });
});

module.exports = app;
