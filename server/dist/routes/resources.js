"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const resourcesController_1 = require("../controllers/resourcesController");
const router = express_1.default.Router();
// Public routes
router.get('/resources', resourcesController_1.getResources);
router.get('/resources/categories', resourcesController_1.getCategories);
router.get('/resources/:id', resourcesController_1.getResource);
// Protected routes
router.get('/resources/user/saved', auth_1.protect, resourcesController_1.getSavedResources);
router.post('/resources/:id/save', auth_1.protect, resourcesController_1.saveResource);
router.delete('/resources/:id/save', auth_1.protect, resourcesController_1.unsaveResource);
exports.default = router;
//# sourceMappingURL=resources.js.map