"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Load env vars
dotenv_1.default.config();
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true
}));
// Route files
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const fitness_1 = __importDefault(require("./routes/fitness"));
const vitalSigns_1 = __importDefault(require("./routes/vitalSigns"));
const healthcare_1 = __importDefault(require("./routes/healthcare"));
const resources_1 = __importDefault(require("./routes/resources"));
// Mount routers
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/profile', profile_1.default);
app.use('/api/v1', fitness_1.default);
app.use('/api/v1', vitalSigns_1.default);
app.use('/api/v1', healthcare_1.default);
app.use('/api/v1', resources_1.default);
// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', message: 'HeartBeat API is running' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map