
import express from 'express';
import { addServiceToBill, getBillByAdmission } from '../controllers/billingControllers.js'; // Extension .js zaroori hai

const router = express.Router();

router.post('/add', addServiceToBill);
router.get('/:id', getBillByAdmission);

export default router;