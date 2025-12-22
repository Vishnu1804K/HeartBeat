const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addVitalSign,
  getVitalSigns,
  deleteVitalSign,
  getRecommendations
} = require('../controllers/vitalSignsController');

router.route('/vital-signs')
  .get(protect, getVitalSigns)
  .post(protect, addVitalSign);

router.delete('/vital-signs/:id', protect, deleteVitalSign);

router.get('/recommendations', protect, getRecommendations);

module.exports = router;

