import { Router } from "express";
import * as adminService from "./Services/admin.service.js";
import { validateUser } from "../../Middlewares/addUser.middleware.js";
import { verifyAdminToken } from './../../Middlewares/auth-admin.middleware.js';

const adminController = Router();

adminController.post("/", verifyAdminToken ,adminService.addAdmin);
// userController.patch("/:id", userService.updateUser);
// userController.get("/:id/plan", userService.getUserPlan);
adminController.delete("/:targetId", verifyAdminToken, adminService.deleteAdmin);
adminController.get("/", adminService.getAllAdmins);
export default adminController;
