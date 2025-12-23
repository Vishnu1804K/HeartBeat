import express from 'express';
import { protect } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;

