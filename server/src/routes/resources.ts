import express from 'express';
import { protect } from '../middleware/auth';
import {
    getResources,
    getResource,
    saveResource,
    unsaveResource,
    getSavedResources,
    getCategories
} from '../controllers/resourcesController';

const router = express.Router();

// Public routes
router.get('/resources', getResources);
router.get('/resources/categories', getCategories);
router.get('/resources/:id', getResource);

// Protected routes
router.get('/resources/user/saved', protect, getSavedResources);
router.post('/resources/:id/save', protect, saveResource);
router.delete('/resources/:id/save', protect, unsaveResource);

export default router;

