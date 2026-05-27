import { Router } from 'express';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { GetCustomersTotalByCityController } from '../controllers/GetCustomersTotalByCityController';
import { ListCustomersByCityController } from '../controllers/ListCustomersByCityController';

export const customersRoutes = Router();
const getCustomersTotalByCityController = new GetCustomersTotalByCityController();
const listCustomersByCityController = new ListCustomersByCityController();

customersRoutes.get('/metrics/by-city', ensureAuthenticated, getCustomersTotalByCityController.handle);
customersRoutes.get('/', ensureAuthenticated, listCustomersByCityController.handle);