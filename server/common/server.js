import express from "express";
import mongoose from "mongoose";
import * as http from "http";
import * as path from "path";
import cors from "cors";
import morgan from "morgan";
import apiErrorHandler from '../helper/apiErrorHandler';
const app = new express();
const server = http.createServer(app);

class ExpressServer {
  constructor() {
    app.use(express.json({ limit: '1000mb' }));

    app.use(express.urlencoded({ extended: true, limit: '1000mb' }))

    app.use(morgan('dev'))

    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  }
  router(routes) {
    routes(app);
    return this;
  }

  handleError() {
    app.use(apiErrorHandler);
    return this;
  }

  configureDb(dbUrl) {
    return new Promise((resolve, reject) => {
      mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log("Mongodb connection established 🌍🌍");
          resolve(this);
        })
        .catch(err => {
          console.log(`Error in mongodb connection 🌍 ${err.message}`);
          reject(err);
        });
    });
  }
  


  listen(port) {
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`, new Date().toLocaleString());
    });
    return app;
  }
}
export default ExpressServer;



