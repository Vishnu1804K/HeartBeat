import express from 'express';
import { protect } from '../middleware/auth';
import {
    addVitalSign,
    getVitalSigns,
    deleteVitalSign,
    getRecommendations
} from '../controllers/vitalSignsController';

const router = express.Router();

router.route('/vital-signs')
    .get(protect, getVitalSigns)
    .post(protect, addVitalSign);

router.delete('/vital-signs/:id', protect, deleteVitalSign);

router.get('/recommendations', protect, getRecommendations);

export default router;

