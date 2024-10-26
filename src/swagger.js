"use strict";
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const configSwagger = (app) => {
  const file = fs.readFileSync("./swagger.yaml", "utf8");
  const swaggerDocument = YAML.parse(file);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = configSwagger;
