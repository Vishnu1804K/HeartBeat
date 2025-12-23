"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = exports.logActivity = exports.deleteFitnessGoals = exports.updateFitnessGoals = exports.getFitnessGoals = exports.setFitnessGoals = void 0;
// @desc    Set fitness goals
// @route   POST /api/v1/fitness-goals
const setFitnessGoals = async (req, res) => {
    try {
        const { goals } = req.body;
        if (!goals || !Array.isArray(goals)) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const user = req.user;
        const formattedGoals = goals.map((g) => ({
            goal: g.goal,
            progress: g.progress || 0,
            target: g.target || 100,
            createdAt: new Date()
        }));
        user.fitnessGoals.push(...formattedGoals);
        await user.save();
        res.status(200).json({ message: 'Fitness goals set successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};
exports.setFitnessGoals = setFitnessGoals;
// @desc    Get fitness goals
// @route   GET /api/v1/fitness-goals
const getFitnessGoals = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            goals: user.fitnessGoals.map((g) => ({
                id: g._id,
                goal: g.goal,
                progress: g.progress,
                target: g.target
            }))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getFitnessGoals = getFitnessGoals;
// @desc    Update fitness goals
// @route   PUT /api/v1/fitness-goals
const updateFitnessGoals = async (req, res) => {
    try {
        const { goals } = req.body;
        if (!goals || !Array.isArray(goals)) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const user = req.user;
        // Clear and replace
        user.fitnessGoals.splice(0, user.fitnessGoals.length);
        goals.forEach((g) => {
            user.fitnessGoals.push({
                goal: g.goal,
                progress: g.progress || 0,
                target: g.target || 100,
                createdAt: g.createdAt || new Date()
            });
        });
        await user.save();
        res.status(200).json({ message: 'Fitness goals updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};
exports.updateFitnessGoals = updateFitnessGoals;
// @desc    Delete fitness goals
// @route   DELETE /api/v1/fitness-goals
const deleteFitnessGoals = async (req, res) => {
    try {
        const user = req.user;
        user.fitnessGoals.splice(0, user.fitnessGoals.length);
        await user.save();
        res.status(200).json({ message: 'Fitness goals deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteFitnessGoals = deleteFitnessGoals;
// @desc    Log activity
// @route   POST /api/v1/activities
const logActivity = async (req, res) => {
    try {
        const { type, duration, distance, caloriesBurned, intensity } = req.body;
        if (!type || !duration) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const user = req.user;
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
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};
exports.logActivity = logActivity;
// @desc    Get activities
// @route   GET /api/v1/activities
const getActivities = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            activities: user.activities.map((a) => ({
                id: a._id,
                type: a.type,
                duration: a.duration,
                distance: a.distance,
                caloriesBurned: a.caloriesBurned,
                intensity: a.intensity,
                recordedAt: a.recordedAt
            }))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getActivities = getActivities;
//# sourceMappingURL=fitnessController.js.map