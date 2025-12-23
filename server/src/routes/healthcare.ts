import express from 'express';
import { protect } from '../middleware/auth';
import {
    addProvider,
    getProviders,
    updateProvider,
    deleteProvider,
    scheduleAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
} from '../controllers/healthcareController';

const router = express.Router();

// Healthcare Providers
router.route('/healthcare-providers')
    .get(protect, getProviders)
    .post(protect, addProvider);

router.route('/healthcare-providers/:id')
    .put(protect, updateProvider)
    .delete(protect, deleteProvider);

// Appointments
router.route('/appointments')
    .get(protect, getAppointments)
    .post(protect, scheduleAppointment);

router.route('/appointments/:id')
    .put(protect, updateAppointment)
    .delete(protect, deleteAppointment);

export default router;

