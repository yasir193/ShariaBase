import { Router } from "express";
import * as userService from "./Services/user.service.js";

const userController = Router();

userController.post("/", userService.addUser);
userController.patch("/:id", userService.updateUser);
userController.delete("/:id", userService.deleteUser);
userController.get("/:id/plan", userService.getUserPlan);
userController.get("/", userService.getAllUsers);

export default userController;
