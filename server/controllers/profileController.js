const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      email: user.email,
      name: user.name,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      medicalConditions: user.medicalConditions,
      fitnessGoals: user.fitnessGoals,
      vitalSigns: user.vitalSigns
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, age, gender, height, weight, medicalConditions } = req.body;

    const updateFields = {};
    if (email) updateFields.email = email;
    if (name !== undefined) updateFields.name = name;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (height !== undefined) updateFields.height = height;
    if (weight !== undefined) updateFields.weight = weight;
    if (medicalConditions) updateFields.medicalConditions = medicalConditions;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: 'Invalid request body' });
  }
};

