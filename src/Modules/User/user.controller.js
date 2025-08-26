import { Router } from "express";
import * as userService from "./Services/user.service.js";
import { validateUser } from "../../Middlewares/addUser.middleware.js";

const userController = Router();

userController.post("/", validateUser ,userService.addUser);
userController.patch("/:id", userService.updateUser);
userController.delete("/:id", userService.deleteUser);
userController.get("/:id/plan", userService.getUserPlan);
userController.get("/", userService.getAllUsers);

export default userController;
