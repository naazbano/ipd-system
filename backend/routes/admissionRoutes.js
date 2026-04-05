import express from 'express';
import { createAdmission,addService,getAllAdmissions ,getAdmissionById, getServices, updateService, deleteService} from '../controllers/admissionControllers.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllAdmissions);


router.get('/:id',  getAdmissionById);
router.post('/', protect, authorize('Staff', 'Admin'), createAdmission);


router.patch('/:id/add-service', protect, authorize('Doctor', 'Admin'), addService);
router.get('/:id/services', protect, getServices);

router.delete('/:admissionId/service/:serviceId', protect, authorize('Admin'), deleteService);
router.put('/:admissionId/service/:serviceId', protect, authorize('Admin'), updateService);


export default router;