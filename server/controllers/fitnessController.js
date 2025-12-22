const User = require('../models/User');

// @desc    Set fitness goals
// @route   POST /api/v1/fitness-goals
// @access  Private
exports.setFitnessGoals = async (req, res) => {
  try {
    const { goals } = req.body;

    if (!goals || !Array.isArray(goals)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const user = await User.findById(req.user.id);
    
    const formattedGoals = goals.map(g => ({
      goal: g.goal,
      progress: g.progress || 0,
      target: g.target || 100,
      createdAt: new Date()
    }));

    user.fitnessGoals.push(...formattedGoals);
    await user.save();

    res.status(200).json({ message: 'Fitness goals set successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// @desc    Get fitness goals
// @route   GET /api/v1/fitness-goals
// @access  Private
exports.getFitnessGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      goals: user.fitnessGoals.map(g => ({
        id: g._id,
        goal: g.goal,
        progress: g.progress,
        target: g.target
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update fitness goals
// @route   PUT /api/v1/fitness-goals
// @access  Private
exports.updateFitnessGoals = async (req, res) => {
  try {
    const { goals } = req.body;

    if (!goals || !Array.isArray(goals)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const user = await User.findById(req.user.id);
    
    user.fitnessGoals = goals.map(g => ({
      goal: g.goal,
      progress: g.progress || 0,
      target: g.target || 100,
      createdAt: g.createdAt || new Date()
    }));
    
    await user.save();

    res.status(200).json({ message: 'Fitness goals updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// @desc    Delete fitness goals
// @route   DELETE /api/v1/fitness-goals
// @access  Private
exports.deleteFitnessGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.fitnessGoals = [];
    await user.save();

    res.status(200).json({ message: 'Fitness goals deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Log activity
// @route   POST /api/v1/activities
// @access  Private
exports.logActivity = async (req, res) => {
  try {
    const { type, duration, distance, caloriesBurned, intensity } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const user = await User.findById(req.user.id);
    
    user.activities.push({
      type,
      duration,
      distance: distance || null,
      caloriesBurned: caloriesBurned || 0,
      intensity: intensity || 'medium',
      recordedAt: new Date()
    });

    await user.save();

    res.status(200).json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid request body' });
  }
};

// @desc    Get activities
// @route   GET /api/v1/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      activities: user.activities.map(a => ({
        id: a._id,
        type: a.type,
        duration: a.duration,
        distance: a.distance,
        caloriesBurned: a.caloriesBurned,
        intensity: a.intensity,
        recordedAt: a.recordedAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

