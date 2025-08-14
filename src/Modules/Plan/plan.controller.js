import { Router } from "express";
import * as planService from "./Services/plan.service.js";

const planController = Router();

planController.post("/", planService.addSubscription);
planController.delete("/:id", planService.deleteSubscription);

export default planController;
