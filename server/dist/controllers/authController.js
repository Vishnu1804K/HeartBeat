"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// @desc    Register user
// @route   POST /api/v1/auth/register
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        await User_1.default.create({ email, password, name: name || '' });
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/v1/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = user.getSignedJwtToken();
        res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = login;
// @desc    Forgot password - sends reset email
// @route   POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Please provide an email' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0f0f; color: #f0fdfa; margin: 0; padding: 40px; }
          .container { max-width: 500px; margin: 0 auto; background: #111818; border-radius: 16px; padding: 40px; border: 1px solid #2a3838; }
          .logo { font-size: 28px; font-weight: bold; color: #14b8a6; margin-bottom: 24px; }
          h1 { font-size: 24px; margin-bottom: 16px; }
          p { color: #99a3a3; line-height: 1.6; margin-bottom: 16px; }
          .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
          .note { font-size: 13px; color: #5c6666; margin-top: 24px; }
          .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a3838; font-size: 12px; color: #5c6666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">💚 HeartBeat</div>
          <h1>Password Reset Request</h1>
          <p>You have requested to reset your password for your HeartBeat account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p class="note">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #14b8a6;">${resetUrl}</p>
          </div>
        </div>
      </body>
      </html>
    `;
        try {
            await (0, sendEmail_1.default)({
                email: user.email,
                subject: 'HeartBeat - Password Reset Request',
                html
            });
            res.status(200).json({
                message: 'Password reset email sent',
                // In development, include the token for testing
                ...(process.env.NODE_ENV !== 'production' && { resetToken })
            });
        }
        catch (err) {
            console.error('Email error:', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ error: 'Email could not be sent. Please try again later.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password using token
// @route   POST /api/v1/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            res.status(400).json({ error: 'Please provide a new password' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters' });
            return;
        }
        const resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const user = await User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({ error: 'Invalid or expired reset token' });
            return;
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.resetPassword = resetPassword;
// @desc    Verify reset token is valid
// @route   GET /api/v1/auth/verify-reset-token/:token
const verifyResetToken = async (req, res) => {
    try {
        const resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const user = await User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({ valid: false, error: 'Invalid or expired reset token' });
            return;
        }
        res.status(200).json({ valid: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=authController.js.map