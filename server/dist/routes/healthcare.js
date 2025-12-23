"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const healthcareController_1 = require("../controllers/healthcareController");
const router = express_1.default.Router();
// Healthcare Providers
router.route('/healthcare-providers')
    .get(auth_1.protect, healthcareController_1.getProviders)
    .post(auth_1.protect, healthcareController_1.addProvider);
router.route('/healthcare-providers/:id')
    .put(auth_1.protect, healthcareController_1.updateProvider)
    .delete(auth_1.protect, healthcareController_1.deleteProvider);
// Appointments
router.route('/appointments')
    .get(auth_1.protect, healthcareController_1.getAppointments)
    .post(auth_1.protect, healthcareController_1.scheduleAppointment);
router.route('/appointments/:id')
    .put(auth_1.protect, healthcareController_1.updateAppointment)
    .delete(auth_1.protect, healthcareController_1.deleteAppointment);
exports.default = router;
//# sourceMappingURL=healthcare.js.map