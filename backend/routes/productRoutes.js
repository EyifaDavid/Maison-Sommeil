import express from "express";
import { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct } from "../controllers/productController.js"
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import { createReview, getProductReviews, getRecommendedProducts } from "../controllers/reviewController.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come before dynamic parameter routes
router.get('/recommended', getRecommendedProducts); // ← Move this BEFORE /:id

router.get('/', getAllProducts);
router.get('/:id', getProductById); // ← Now comes after /recommended
router.get('/:id/reviews', getProductReviews); // ← Use consistent param name

router.put('/:id', protectRoute, isAdminRoute, updateProduct);

router.post('/', protectRoute, isAdminRoute, addProduct);
router.post('/:id/reviews', protectRoute, createReview); // ← Use consistent param name + add protectRoute

router.delete('/:id', protectRoute, isAdminRoute, deleteProduct);

export default router;