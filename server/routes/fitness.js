const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  setFitnessGoals,
  getFitnessGoals,
  updateFitnessGoals,
  deleteFitnessGoals,
  logActivity,
  getActivities
} = require('../controllers/fitnessController');

router.route('/fitness-goals')
  .get(protect, getFitnessGoals)
  .post(protect, setFitnessGoals)
  .put(protect, updateFitnessGoals)
  .delete(protect, deleteFitnessGoals);

router.route('/activities')
  .get(protect, getActivities)
  .post(protect, logActivity);

module.exports = router;

