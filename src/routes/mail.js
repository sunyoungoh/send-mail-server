import { Router } from 'express';
import * as mailController from '../controllers/mailController';

const router = Router();

router.post('/', mailController.sendMail);

export default router;
