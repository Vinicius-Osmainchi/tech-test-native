import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { customersRoutes } from "./customers.routes";

export const router = Router();

router.use("/login", authRoutes);
router.use('/customers', customersRoutes);