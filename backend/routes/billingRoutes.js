
import express from 'express';
import { generateFinalBill, getBillByAdmission, downloadInvoicePDF } from '../controllers/billingControllers.js'; // Extension .js zaroori hai

const router = express.Router();

router.post('/generate', generateFinalBill);

router.get('/get-bill/:id', getBillByAdmission);

router.get('/download-pdf/:id', downloadInvoicePDF);

export default router;