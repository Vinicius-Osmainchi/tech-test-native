import { Router } from "express";
import { authRoutes } from "../../../../modules/auth/infra/http/routes/auth.routes";
import { customersRoutes } from "../../../../modules/customers/infra/http/routes/customers.routes";

export const router = Router();

router.use("/login", authRoutes);
router.use("/customers", customersRoutes);
