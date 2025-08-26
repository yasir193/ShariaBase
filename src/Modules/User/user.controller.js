import { Router } from "express";
import * as userService from "./Services/user.service.js";
import { validateSignUp } from "../../Middlewares/auth.middleware.js";

const userController = Router();

userController.post("/", validateSignUp ,userService.addUser);
userController.patch("/:id", userService.updateUser);
userController.delete("/:id", userService.deleteUser);
userController.get("/:id/plan", userService.getUserPlan);
userController.get("/", userService.getAllUsers);

export default userController;
