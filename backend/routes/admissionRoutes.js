import express from 'express';
import { createAdmission,addService,getAllAdmissions ,getAdmissionById, updateAdmission, deleteAdmission} from '../controllers/admissionControllers.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllAdmissions);


router.get('/:id', protect, getAdmissionById);
router.put('/:id', protect, updateAdmission);
router.delete('/:id', protect, deleteAdmission);

router.post('/', protect, authorize('Staff', 'Admin'), createAdmission);


router.patch('/:id/add-service', protect, authorize('Doctor', 'Admin'), addService);

export default router;