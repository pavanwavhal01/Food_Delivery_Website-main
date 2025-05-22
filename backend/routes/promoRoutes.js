
import express from 'express';
import { validatePromoCode } from '../controller/promocodeController.js';

const router = express.Router();

router.post('/validate', validatePromoCode);

export default router;
