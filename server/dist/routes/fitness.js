"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const fitnessController_1 = require("../controllers/fitnessController");
const router = express_1.default.Router();
router.route('/fitness-goals')
    .get(auth_1.protect, fitnessController_1.getFitnessGoals)
    .post(auth_1.protect, fitnessController_1.setFitnessGoals)
    .put(auth_1.protect, fitnessController_1.updateFitnessGoals)
    .delete(auth_1.protect, fitnessController_1.deleteFitnessGoals);
router.route('/activities')
    .get(auth_1.protect, fitnessController_1.getActivities)
    .post(auth_1.protect, fitnessController_1.logActivity);
exports.default = router;
//# sourceMappingURL=fitness.js.map