"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    name: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', ''],
        default: ''
    },
    height: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
    medicalConditions: [{
            type: String
        }],
    fitnessGoals: [{
            goal: { type: String, required: true },
            progress: { type: Number, default: 0 },
            target: { type: Number, default: 100 },
            createdAt: { type: Date, default: Date.now }
        }],
    vitalSigns: [{
            type: { type: String, required: true },
            value: { type: String, required: true },
            recordedAt: { type: Date, default: Date.now }
        }],
    activities: [{
            type: { type: String, required: true },
            duration: { type: Number, required: true },
            distance: { type: Number, default: null },
            caloriesBurned: { type: Number, default: 0 },
            intensity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
            recordedAt: { type: Date, default: Date.now }
        }],
    healthcareProviders: [{
            name: { type: String, required: true },
            type: { type: String, enum: ['doctor', 'hospital', 'insurance', 'clinic', 'specialist'], required: true },
            specialty: { type: String },
            phone: { type: String },
            email: { type: String },
            address: { type: String },
            notes: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
    appointments: [{
            providerId: { type: mongoose_1.Schema.Types.ObjectId },
            providerName: { type: String, required: true },
            date: { type: Date, required: true },
            time: { type: String, required: true },
            purpose: { type: String, required: true },
            status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
            notes: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
    savedResources: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Resource'
        }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Encrypt password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return resetToken;
};
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map