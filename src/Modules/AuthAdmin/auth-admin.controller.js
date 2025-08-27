import { Router } from "express";
import * as authService from "./Services/auth-admin.service.js";

const authAdminController = Router();

authAdminController.post("/signin", authService.adminSignIn);

export default authAdminController;
