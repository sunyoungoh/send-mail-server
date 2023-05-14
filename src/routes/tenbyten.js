import { Router } from 'express';
import * as tenbytenOrdersController from '../controllers/tenbytenOrdersController';
import * as tenbytenItemsController from '../controllers/tenbytenItemsController';

const router = Router();

router.get('/brandinfo', tenbytenOrdersController.getBrandInfo);
router.get('/orders', tenbytenOrdersController.getNewOrders);
router.get('/orders/ready', tenbytenOrdersController.getReadyOrder);
router.get('/orders/orderconfirm', tenbytenOrdersController.getDispatchOrderHistory);
router.post('/orders/orderconfirm', tenbytenOrdersController.dispatchOrder);
router.get('/qna', tenbytenOrdersController.getQna);
router.post('/qna', tenbytenOrdersController.anwserQna);
router.get('/items', tenbytenItemsController.getItems);
router.get('/items/:itemId', tenbytenItemsController.getItem);
router.put('/item', tenbytenItemsController.editItem);
router.put('/item/status', tenbytenItemsController.updateItemStatus);
export default router;
