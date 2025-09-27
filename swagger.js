import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRMS Temp Backend API",
      version: "1.0.0",
      description: "API documentation for HRMS Temp Backend",
    },
    servers: [
      {
        url:"http://localhost:" + (process.env.PORT || 5010),
      },
    ],
  },
  apis: [
    "./Users/Routes/*.js",
    "./app.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default setupSwagger;

