"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
// @desc    Get user profile
// @route   GET /api/v1/profile
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            medicalConditions: user.medicalConditions,
            fitnessGoals: user.fitnessGoals,
            vitalSigns: user.vitalSigns,
            healthcareProviders: user.healthcareProviders,
            appointments: user.appointments
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getProfile = getProfile;
// @desc    Update user profile
// @route   PUT /api/v1/profile
const updateProfile = async (req, res) => {
    try {
        const { email, name, age, gender, height, weight, medicalConditions } = req.body;
        const user = req.user;
        if (email)
            user.email = email;
        if (name !== undefined)
            user.name = name;
        if (age !== undefined)
            user.age = age;
        if (gender !== undefined)
            user.gender = gender;
        if (height !== undefined)
            user.height = height;
        if (weight !== undefined)
            user.weight = weight;
        if (medicalConditions)
            user.medicalConditions = medicalConditions;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        res.status(400).json({ error: 'Invalid request body' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=profileController.js.map