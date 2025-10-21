import express from "express"
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import tryonRoutes from "./tryonRoutes.js";
import orderRoutes from "./orderRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/auth', authRoutes);
router.use('/tryon', tryonRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);



export default router;