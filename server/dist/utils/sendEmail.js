"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    // Create transporter based on environment
    let transporter;
    if (process.env.NODE_ENV === 'production') {
        // Production: Use configured SMTP
        transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    else {
        // Development: Use Ethereal for testing
        const testAccount = await nodemailer_1.default.createTestAccount();
        transporter = nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }
    const message = {
        from: `HeartBeat <${process.env.EMAIL_USER || 'noreply@heartbeat.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };
    const info = await transporter.sendMail(message);
    // Log preview URL for development
    if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
    }
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map