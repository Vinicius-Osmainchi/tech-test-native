import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { GetCustomersTotalByCityController } from '../../../../modules/customers/controllers/GetCustomersTotalByCityController';
import { ListCustomersByCityController } from '../../../../modules/customers/controllers/ListCustomersByCityController';

export const customersRoutes = Router();
const getCustomersTotalByCityController = new GetCustomersTotalByCityController();
const listCustomersByCityController = new ListCustomersByCityController();

customersRoutes.get('/metrics/by-city', ensureAuthenticated, getCustomersTotalByCityController.handle);
customersRoutes.get('/', ensureAuthenticated, listCustomersByCityController.handle);