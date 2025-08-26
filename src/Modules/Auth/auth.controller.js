import { Router } from "express";
import * as authService from "./Services/auth.service.js";
import { validateSignUp } from "../../Middlewares/auth.middleware.js";

const authController = Router();

authController.post("/signup",validateSignUp ,authService.signUp);
authController.post("/signin", authService.signIn);

export default authController;
