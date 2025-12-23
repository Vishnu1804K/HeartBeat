"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
router.get('/', auth_1.protect, profileController_1.getProfile);
router.put('/', auth_1.protect, profileController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=profile.js.map