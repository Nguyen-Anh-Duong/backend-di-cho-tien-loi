"use strict";
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const path = require("node:path");
const swaggerPath = path.join(__dirname, "../swagger.yaml");

const swagger = (app) => {
  const file = fs.readFileSync(swaggerPath, "utf8");
  const swaggerDocument = YAML.parse(file);

  const noCache = (req, res, next) => {
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.header("Pragma", "no-cache");
    res.header("Expires", "-1");
    next();
  };

  app.use(
    "/api-docs",
    noCache,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};

module.exports = swagger;
