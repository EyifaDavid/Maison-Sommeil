// backend/routes/adminRoutes.js
import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protectRoute, isAdminRoute } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/dashboard', protectRoute, isAdminRoute, getDashboardStats);


export default router;
