import express from "express";
import { config } from "dotenv";
config();

import userController from './Modules/User/user.controller.js';
import authController from './Modules/Auth/auth.controller.js';
import planController from './Modules/Plan/plan.controller.js';
import { database_connection } from "./DB/connection.js";
import uploadController from './Modules/UploadFiles/uploadFiles.controller.js';
import cors from 'cors';


export const bootstrap = () => {
  const app = express();
  app.use(express.json());


    app.use(cors({
    origin: "*", 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    credentials: true 
  }));

  // Routes
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/plan", planController);
  app.use("/upload", uploadController);

  // Connect DB and start server
  database_connection();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};


