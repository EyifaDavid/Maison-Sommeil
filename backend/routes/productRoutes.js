// const express = require('express');
// const router = express.Router();
// const { getAllProducts, getProductById, addProduct, deleteProduct } = require('../controllers/productController');
import express from "express";
import { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct } from "../controllers/productController.js"
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import { createReview, getProductReviews, getRecommendedProducts } from "../controllers/reviewController.js";

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get ('/recommended', getRecommendedProducts);
// router.get('/search', searchProducts);
router.get('/:productId/reviews', getProductReviews)

router.put('/:id', protectRoute,isAdminRoute, updateProduct)


router.post('/', protectRoute,isAdminRoute, addProduct);
router.post('/:productId/reviews', createReview);



router.delete('/:id', protectRoute,isAdminRoute, deleteProduct);

export default router
