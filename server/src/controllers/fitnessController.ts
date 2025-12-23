import { Response } from 'express';
import { AuthRequest, IFitnessGoal, IActivity } from '../types';

// @desc    Set fitness goals
// @route   POST /api/v1/fitness-goals
export const setFitnessGoals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { goals } = req.body;

        if (!goals || !Array.isArray(goals)) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const user = req.user!;

        interface GoalInput {
            goal: string;
            progress?: number;
            target?: number;
        }

        const formattedGoals = goals.map((g: GoalInput) => ({
            goal: g.goal,
            progress: g.progress || 0,
            target: g.target || 100,
            createdAt: new Date()
        } as IFitnessGoal));

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
export const getFitnessGoals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        res.status(200).json({
            goals: user.fitnessGoals.map((g) => ({
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
export const updateFitnessGoals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { goals } = req.body;

        if (!goals || !Array.isArray(goals)) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const user = req.user!;

        interface GoalInput {
            goal: string;
            progress?: number;
            target?: number;
            createdAt?: Date;
        }

        // Clear and replace
        user.fitnessGoals.splice(0, user.fitnessGoals.length);
        goals.forEach((g: GoalInput) => {
            user.fitnessGoals.push({
                goal: g.goal,
                progress: g.progress || 0,
                target: g.target || 100,
                createdAt: g.createdAt || new Date()
            } as IFitnessGoal);
        });

        await user.save();

        res.status(200).json({ message: 'Fitness goals updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Delete fitness goals
// @route   DELETE /api/v1/fitness-goals
export const deleteFitnessGoals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        user.fitnessGoals.splice(0, user.fitnessGoals.length);
        await user.save();

        res.status(200).json({ message: 'Fitness goals deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Log activity
// @route   POST /api/v1/activities
export const logActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, duration, distance, caloriesBurned, intensity } = req.body;

        if (!type || !duration) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const user = req.user!;

        user.activities.push({
            type,
            duration,
            distance: distance || null,
            caloriesBurned: caloriesBurned || 0,
            intensity: intensity || 'medium',
            recordedAt: new Date()
        } as IActivity);

        await user.save();

        res.status(200).json({ message: 'Activity logged successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Get activities
// @route   GET /api/v1/activities
export const getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
