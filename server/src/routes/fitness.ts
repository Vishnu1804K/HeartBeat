import express from 'express';
import { protect } from '../middleware/auth';
import {
    setFitnessGoals,
    getFitnessGoals,
    updateFitnessGoals,
    deleteFitnessGoals,
    logActivity,
    getActivities
} from '../controllers/fitnessController';

const router = express.Router();

router.route('/fitness-goals')
    .get(protect, getFitnessGoals)
    .post(protect, setFitnessGoals)
    .put(protect, updateFitnessGoals)
    .delete(protect, deleteFitnessGoals);

router.route('/activities')
    .get(protect, getActivities)
    .post(protect, logActivity);

export default router;

