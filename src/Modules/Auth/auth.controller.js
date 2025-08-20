import { Router } from "express";
import * as authService from "./Services/auth.service.js";

const authController = Router();

authController.post("/signup", authService.signUp);
authController.post("/signin", authService.signIn);

export default authController;
