import { Router } from "express";
import { authRoutes } from "../../../../modules/auth/infra/http/routes/auth.routes";
import { customersRoutes } from "../../../../modules/customers/infra/http/routes/customers.routes";

const apiRouter = Router();

apiRouter.use("/login", authRoutes);
apiRouter.use("/customers", customersRoutes);

export const router = Router();

router.use("/api", apiRouter);
