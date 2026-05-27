import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { GetCustomersTotalByCityController } from '../../../../modules/customers/controllers/GetCustomersTotalByCityController';

export const customersRoutes = Router();
const getCustomersTotalByCityController = new GetCustomersTotalByCityController();

customersRoutes.get('/metrics/by-city', ensureAuthenticated, getCustomersTotalByCityController.handle);