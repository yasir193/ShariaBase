import { Router } from "express";
import * as userService from "./Services/user.service.js";

const userController = Router();

userController.post("/", userService.addUser);
userController.patch("/:id", userService.updateUser);
userController.delete("/:id", userService.deleteUser);
userController.get("/:id/plan", userService.getUserPlan);

export default userController;
