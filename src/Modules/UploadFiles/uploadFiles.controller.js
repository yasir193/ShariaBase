import { Router } from "express";
import * as uploadFiles from "./Services/uploadFiles.service.js";
import { validateJson } from "../../Middlewares/validation.middleware.js";
import { authenticate } from "./../../Middlewares/auth.middleware.js";

const uploadController = Router();

uploadController.post("/", validateJson, uploadFiles.uploadFile);
uploadController.put(
  "/files/:fileId",

  validateJson,
  uploadFiles.updateFile
);
uploadController.get("/", uploadFiles.getAllContracts);
export default uploadController;
