import { Router } from "express";
import { CreateCustomerController } from "../../../../modules/customers/controllers/CreateCustomerController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const customersRoutes = Router();
const createCustomerController = new CreateCustomerController();

customersRoutes.post("/", ensureAuthenticated, createCustomerController.handle);
