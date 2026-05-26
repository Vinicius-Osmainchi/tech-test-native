import { Router } from "express";
import { LoginController } from "../../../../modules/auth/controllers/LoginController";

export const authRoutes = Router();
const loginController = new LoginController();

authRoutes.post("/", loginController.handle);
