"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const vitalSignsController_1 = require("../controllers/vitalSignsController");
const router = express_1.default.Router();
router.route('/vital-signs')
    .get(auth_1.protect, vitalSignsController_1.getVitalSigns)
    .post(auth_1.protect, vitalSignsController_1.addVitalSign);
router.delete('/vital-signs/:id', auth_1.protect, vitalSignsController_1.deleteVitalSign);
router.get('/recommendations', auth_1.protect, vitalSignsController_1.getRecommendations);
exports.default = router;
//# sourceMappingURL=vitalSigns.js.map