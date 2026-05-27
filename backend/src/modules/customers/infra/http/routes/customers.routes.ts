import { Router } from 'express';
import { ensureAuthenticated } from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import { GetCustomersTotalByCityController } from '../controllers/GetCustomersTotalByCityController';
import { ListCustomersByCityController } from '../controllers/ListCustomersByCityController';
import { GetCustomerByIdController } from '../controllers/GetCustomerByIdController';

export const customersRoutes = Router();
const getCustomersTotalByCityController = new GetCustomersTotalByCityController();
const listCustomersByCityController = new ListCustomersByCityController();
const getCustomerByIdController = new GetCustomerByIdController();

customersRoutes.get('/metrics/by-city', ensureAuthenticated, getCustomersTotalByCityController.handle);
customersRoutes.get('/', ensureAuthenticated, listCustomersByCityController.handle);
customersRoutes.get('/:id', ensureAuthenticated, getCustomerByIdController.handle);