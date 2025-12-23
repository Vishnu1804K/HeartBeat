"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getSavedResources = exports.unsaveResource = exports.saveResource = exports.getResource = exports.getResources = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const User_1 = __importDefault(require("../models/User"));
// Sample educational resources data
const sampleResources = [
    {
        title: 'Understanding Heart Health: A Complete Guide',
        description: 'Learn about the factors that affect your heart health and simple steps to improve cardiovascular wellness.',
        type: 'article',
        category: 'wellness',
        url: 'https://example.com/heart-health-guide',
        thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
        author: 'Dr. Sarah Johnson',
        tags: ['heart', 'cardiovascular', 'health']
    },
    {
        title: '30-Minute Full Body Workout for Beginners',
        description: 'A beginner-friendly workout routine that targets all major muscle groups. No equipment needed!',
        type: 'video',
        category: 'exercise',
        url: 'https://example.com/beginner-workout',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        duration: '30 min',
        author: 'Fitness Pro Team',
        tags: ['workout', 'beginner', 'full-body']
    },
    {
        title: 'Mindful Eating: Transform Your Relationship with Food',
        description: 'Discover how mindful eating can help you make healthier food choices and improve digestion.',
        type: 'article',
        category: 'nutrition',
        url: 'https://example.com/mindful-eating',
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        author: 'Nutrition Expert',
        tags: ['nutrition', 'mindfulness', 'eating']
    },
    {
        title: 'Sleep Better Tonight: Science-Backed Tips',
        description: 'Expert tips on improving sleep quality based on the latest sleep research.',
        type: 'podcast',
        category: 'sleep',
        url: 'https://example.com/sleep-podcast',
        thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
        duration: '45 min',
        author: 'Sleep Science Lab',
        tags: ['sleep', 'rest', 'health']
    },
    {
        title: 'Managing Stress in the Modern World',
        description: 'Practical techniques for reducing stress and anxiety in your daily life.',
        type: 'video',
        category: 'mental-health',
        url: 'https://example.com/stress-management',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
        duration: '20 min',
        author: 'Wellness Center',
        tags: ['stress', 'mental-health', 'anxiety']
    },
    {
        title: 'The Complete Guide to Intermittent Fasting',
        description: 'Everything you need to know about intermittent fasting and its health benefits.',
        type: 'article',
        category: 'weight-management',
        url: 'https://example.com/intermittent-fasting',
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        author: 'Health & Nutrition',
        tags: ['fasting', 'weight-loss', 'diet']
    },
    {
        title: 'Yoga for Flexibility and Strength',
        description: 'A gentle yoga practice suitable for all levels to improve flexibility and build strength.',
        type: 'video',
        category: 'exercise',
        url: 'https://example.com/yoga-flexibility',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        duration: '40 min',
        author: 'Yoga Masters',
        tags: ['yoga', 'flexibility', 'strength']
    },
    {
        title: 'Understanding Blood Pressure: What the Numbers Mean',
        description: 'A comprehensive guide to understanding your blood pressure readings and maintaining healthy levels.',
        type: 'article',
        category: 'disease-prevention',
        url: 'https://example.com/blood-pressure-guide',
        thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
        author: 'Medical Insights',
        tags: ['blood-pressure', 'heart', 'prevention']
    },
    {
        title: 'Meditation for Beginners: Finding Inner Peace',
        description: 'Learn the basics of meditation and start your journey towards mental clarity.',
        type: 'podcast',
        category: 'mental-health',
        url: 'https://example.com/meditation-beginners',
        thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400',
        duration: '25 min',
        author: 'Mindful Living',
        tags: ['meditation', 'mindfulness', 'peace']
    },
    {
        title: 'Healthy Meal Prep: Weekly Planning Guide',
        description: 'Save time and eat healthier with this comprehensive meal prep guide.',
        type: 'article',
        category: 'nutrition',
        url: 'https://example.com/meal-prep-guide',
        thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        author: 'Healthy Kitchen',
        tags: ['meal-prep', 'nutrition', 'cooking']
    },
    {
        title: 'HIIT Cardio Blast: 20-Minute Fat Burner',
        description: 'High-intensity interval training workout designed to maximize calorie burn.',
        type: 'video',
        category: 'exercise',
        url: 'https://example.com/hiit-cardio',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        duration: '20 min',
        author: 'HIIT Masters',
        tags: ['hiit', 'cardio', 'fat-burn']
    },
    {
        title: 'The Science of Hydration',
        description: 'Why staying hydrated is crucial for your health and how much water you really need.',
        type: 'podcast',
        category: 'wellness',
        url: 'https://example.com/hydration-science',
        thumbnail: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400',
        duration: '35 min',
        author: 'Health Science Today',
        tags: ['hydration', 'water', 'health']
    }
];
// @desc    Get all educational resources
// @route   GET /api/v1/resources
const getResources = async (req, res) => {
    try {
        const { type, category, search } = req.query;
        let resources = await Resource_1.default.find();
        // If no resources in DB, seed with sample data
        if (resources.length === 0) {
            await Resource_1.default.insertMany(sampleResources);
            resources = await Resource_1.default.find();
        }
        // Filter by type
        if (type && typeof type === 'string') {
            resources = resources.filter(r => r.type === type);
        }
        // Filter by category
        if (category && typeof category === 'string') {
            resources = resources.filter(r => r.category === category);
        }
        // Search by title or description
        if (search && typeof search === 'string') {
            const searchLower = search.toLowerCase();
            resources = resources.filter(r => r.title.toLowerCase().includes(searchLower) ||
                r.description.toLowerCase().includes(searchLower) ||
                r.tags.some(t => t.toLowerCase().includes(searchLower)));
        }
        res.status(200).json({
            resources: resources.map(r => ({
                id: r._id,
                title: r.title,
                description: r.description,
                type: r.type,
                category: r.category,
                url: r.url,
                thumbnail: r.thumbnail,
                duration: r.duration,
                author: r.author,
                tags: r.tags,
                createdAt: r.createdAt
            }))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getResources = getResources;
// @desc    Get single resource
// @route   GET /api/v1/resources/:id
const getResource = async (req, res) => {
    try {
        const resource = await Resource_1.default.findById(req.params.id);
        if (!resource) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }
        res.status(200).json({ resource });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getResource = getResource;
// @desc    Save resource to user's library
// @route   POST /api/v1/resources/:id/save
const saveResource = async (req, res) => {
    try {
        const user = req.user;
        const resourceId = req.params.id;
        const resource = await Resource_1.default.findById(resourceId);
        if (!resource) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }
        // Check if already saved
        const alreadySaved = user.savedResources.some((id) => id.toString() === resourceId);
        if (alreadySaved) {
            res.status(400).json({ error: 'Resource already saved' });
            return;
        }
        user.savedResources.push(resource._id);
        await user.save();
        res.status(200).json({ message: 'Resource saved to library' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.saveResource = saveResource;
// @desc    Remove resource from user's library
// @route   DELETE /api/v1/resources/:id/save
const unsaveResource = async (req, res) => {
    try {
        const user = req.user;
        const resourceId = req.params.id;
        user.savedResources = user.savedResources.filter((id) => id.toString() !== resourceId);
        await user.save();
        res.status(200).json({ message: 'Resource removed from library' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.unsaveResource = unsaveResource;
// @desc    Get user's saved resources
// @route   GET /api/v1/resources/saved
const getSavedResources = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id).populate('savedResources');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({
            resources: user.savedResources
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getSavedResources = getSavedResources;
// @desc    Get resource categories
// @route   GET /api/v1/resources/categories
const getCategories = async (_req, res) => {
    try {
        const categories = [
            { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
            { id: 'exercise', name: 'Exercise', icon: '🏋️' },
            { id: 'mental-health', name: 'Mental Health', icon: '🧠' },
            { id: 'sleep', name: 'Sleep', icon: '😴' },
            { id: 'wellness', name: 'Wellness', icon: '🌿' },
            { id: 'disease-prevention', name: 'Disease Prevention', icon: '🛡️' },
            { id: 'weight-management', name: 'Weight Management', icon: '⚖️' }
        ];
        res.status(200).json({ categories });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=resourcesController.js.map