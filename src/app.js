"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const { NotFoundError } = require("./core/error.response");
require("dotenv").config();
const swagger = require("./swagger");
const app = express();
const { createUserAdmin } = require("./utils/createUserAdmin");
const { WELCOME_HTML } = require("./templates/index");

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

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.send(WELCOME_HTML);
});
//handle error

app.use((req, res, next) => {
  const error = new Error("This route is not exist!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const errorResponse = {
    status: "error",
    code: statusCode,
    message: error.message || "Server Error!!",
    stack: error.stack,
  };
  if (process.env.ENViRONMENT === "prod") delete errorResponse.stack;
  return res.status(statusCode).json(errorResponse);
});

module.exports = app;
