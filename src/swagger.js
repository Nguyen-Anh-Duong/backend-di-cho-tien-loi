"use strict";
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const path = require("node:path");
const swaggerPath = path.join(__dirname, "../swagger.yaml");

const swagger = (app) => {
  const file = fs.readFileSync(swaggerPath, "utf8");
  const swaggerDocument = YAML.parse(file);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = swagger;
