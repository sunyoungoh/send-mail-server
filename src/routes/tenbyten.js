import { Router } from 'express';
import * as tenbytenController from '../controllers/tenbytenController';

const router = Router();

router.get('/brandinfo', tenbytenController.getBrandInfo);
router.get('/orders', tenbytenController.getNewOrders);
router.get('/orders/ready', tenbytenController.getReadyOrder);
router.get('/orders/orderconfirm', tenbytenController.getDispatchOrderHistory);
router.post('/orders/orderconfirm', tenbytenController.dispatchOrder);
router.get('/qna', tenbytenController.getQna);
router.post('/qna', tenbytenController.anwserQna);

export default router;
