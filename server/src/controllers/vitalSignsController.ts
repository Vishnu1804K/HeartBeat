import { Response } from 'express';
import { AuthRequest, IVitalSign } from '../types';

// @desc    Add vital sign
// @route   POST /api/v1/vital-signs
export const addVitalSign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, value } = req.body;

        if (!type || !value) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const user = req.user!;

        user.vitalSigns.push({
            type,
            value,
            recordedAt: new Date()
        } as IVitalSign);

        await user.save();

        res.status(200).json({ message: 'Vital sign recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Get vital signs
// @route   GET /api/v1/vital-signs
export const getVitalSigns = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        res.status(200).json({
            vitalSigns: user.vitalSigns.map((v) => ({
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
export const deleteVitalSign = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const vitalIndex = user.vitalSigns.findIndex(
            (v) => v._id?.toString() === req.params.id
        );

        if (vitalIndex !== -1) {
            user.vitalSigns.splice(vitalIndex, 1);
            await user.save();
        }

        res.status(200).json({ message: 'Vital sign deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get health recommendations
// @route   GET /api/v1/recommendations
export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        interface Recommendation {
            category: string;
            title: string;
            description: string;
            priority: 'high' | 'medium' | 'low';
        }
        const recommendations: Recommendation[] = [];

        // Blood Pressure based recommendation
        if (user.vitalSigns.length > 0) {
            const bpVitals = user.vitalSigns.filter((v) => v.type === 'Blood Pressure');
            const latestBP = bpVitals.sort((a, b) =>
                new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
            )[0];

            if (latestBP) {
                const systolic = parseInt(latestBP.value.split('/')[0]);
                if (systolic > 120) {
                    recommendations.push({
                        category: 'Health',
                        title: 'Blood Pressure Alert',
                        description: 'Your blood pressure is slightly elevated. Consider reducing sodium intake and increasing physical activity.',
                        priority: 'high'
                    });
                }
            }

            // Heart Rate based
            const hrVitals = user.vitalSigns.filter((v) => v.type === 'Heart Rate');
            const latestHR = hrVitals.sort((a, b) =>
                new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
            )[0];

            if (latestHR) {
                const hr = parseInt(latestHR.value);
                if (hr > 100) {
                    recommendations.push({
                        category: 'Health',
                        title: 'Elevated Heart Rate',
                        description: 'Your resting heart rate is above normal. Consider relaxation techniques and consult your doctor if persistent.',
                        priority: 'medium'
                    });
                }
            }
        }

        // BMI based
        if (user.weight && user.height) {
            const bmi = user.weight / Math.pow(user.height / 100, 2);
            if (bmi > 25) {
                recommendations.push({
                    category: 'Nutrition',
                    title: 'Weight Management',
                    description: 'Your BMI indicates you might benefit from a balanced diet and regular exercise.',
                    priority: 'medium'
                });
            } else if (bmi < 18.5) {
                recommendations.push({
                    category: 'Nutrition',
                    title: 'Underweight Alert',
                    description: 'Your BMI is below normal. Consider consulting a nutritionist for a healthy meal plan.',
                    priority: 'medium'
                });
            }
        }

        // Activity based
        const recentActivities = user.activities.filter((a) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(a.recordedAt) > weekAgo;
        });

        if (recentActivities.length < 3) {
            recommendations.push({
                category: 'Exercise',
                title: 'Stay Active',
                description: 'Try to log at least 3-5 workouts per week for optimal health benefits.',
                priority: 'medium'
            });
        } else if (recentActivities.length >= 5) {
            recommendations.push({
                category: 'Exercise',
                title: 'Great Progress!',
                description: 'You\'re maintaining an excellent exercise routine. Keep it up!',
                priority: 'low'
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
