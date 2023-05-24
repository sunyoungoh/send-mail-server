import { Router } from 'express';
import * as tenbytenOrdersController from '../controllers/tenbytenOrdersController';
import * as tenbytenItemsController from '../controllers/tenbytenItemsController';

const router = Router();

router.get('/brandinfo', tenbytenOrdersController.getBrandInfo);
router.get('/orders', tenbytenOrdersController.getNewOrders);
router.get('/orders/ready', tenbytenOrdersController.getReadyOrder);
router.get(
  '/orders/orderconfirm',
  tenbytenOrdersController.getDispatchOrderHistory
);
router.post('/orders/orderconfirm', tenbytenOrdersController.dispatchOrder);
router.post(
  '/orders/orderconfirm/mytt',
  tenbytenOrdersController.onlyDispatchOrder
);
router.get('/qna', tenbytenOrdersController.getQna);
router.post('/qna', tenbytenOrdersController.anwserQna);
router.get('/items', tenbytenItemsController.getItems);
router.get('/items/:itemId', tenbytenItemsController.getItem);
router.put('/item', tenbytenItemsController.updateItemInfo);
router.put('/item/status', tenbytenItemsController.updateItemStatus);
router.put('/item/images', tenbytenItemsController.updateItemImages);
router.get('/waitItems', tenbytenItemsController.getWaitItems);
router.get('/waitItem/:waitId', tenbytenItemsController.getWaitItem);
router.put('/waitItem', tenbytenItemsController.updateWaitItem);
export default router;
