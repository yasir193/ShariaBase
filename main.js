import express from "express";
import { config } from "dotenv";
config();

import userController from './src/Modules/User/user.controller.js';
import planController from './src/Modules/Plan/plan.controller.js';
import { database_connection } from "./src/DB/connection.js";



export const bootstrap = () => {
  const app = express();
  app.use(express.json());

  // Routes
  app.use("/user", userController);
  app.use("/plan", planController);

  // Connect DB and start server
  database_connection();
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

bootstrap();
