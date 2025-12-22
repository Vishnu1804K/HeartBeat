const User = require('../models/User');

// @desc    Add vital sign
// @route   POST /api/v1/vital-signs
// @access  Private
exports.addVitalSign = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const user = await User.findById(req.user.id);
    
    user.vitalSigns.push({
      type,
      value,
      recordedAt: new Date()
    });

    await user.save();

    res.status(200).json({ message: 'Vital sign recorded successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// @desc    Get vital signs
// @route   GET /api/v1/vital-signs
// @access  Private
exports.getVitalSigns = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      vitalSigns: user.vitalSigns.map(v => ({
        id: v._id,
        type: v.type,
        value: v.value,
        recordedAt: v.recordedAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete vital sign
// @route   DELETE /api/v1/vital-signs/:id
// @access  Private
exports.deleteVitalSign = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.vitalSigns = user.vitalSigns.filter(
      v => v._id.toString() !== req.params.id
    );
    
    await user.save();

    res.status(200).json({ message: 'Vital sign deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get health recommendations
// @route   GET /api/v1/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const recommendations = [];

    // Generate recommendations based on user data
    if (user.vitalSigns.length > 0) {
      const latestBP = user.vitalSigns
        .filter(v => v.type === 'Blood Pressure')
        .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
      
      if (latestBP) {
        const [systolic] = latestBP.value.split('/').map(Number);
        if (systolic > 120) {
          recommendations.push({
            category: 'Health',
            title: 'Blood Pressure Alert',
            description: 'Your blood pressure is slightly elevated. Consider reducing sodium intake and increasing physical activity.',
            priority: 'high'
          });
        }
      }
    }

    if (user.weight && user.height) {
      const bmi = user.weight / Math.pow(user.height / 100, 2);
      if (bmi > 25) {
        recommendations.push({
          category: 'Nutrition',
          title: 'Weight Management',
          description: 'Your BMI indicates you might benefit from a balanced diet and regular exercise.',
          priority: 'medium'
        });
      }
    }

    if (user.activities.length < 3) {
      recommendations.push({
        category: 'Exercise',
        title: 'Stay Active',
        description: 'Try to log at least 3-5 workouts per week for optimal health benefits.',
        priority: 'medium'
      });
    }

    // Default recommendations
    recommendations.push({
      category: 'Wellness',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for better health.',
      priority: 'low'
    });

    recommendations.push({
      category: 'Wellness',
      title: 'Quality Sleep',
      description: 'Aim for 7-9 hours of sleep each night for optimal recovery.',
      priority: 'low'
    });

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

