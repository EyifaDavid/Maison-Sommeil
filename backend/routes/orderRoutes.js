// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
} from "../controllers/orderController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protectRoute, createOrder).get(protectRoute, isAdminRoute, getAllOrders);
router.route("/myorders").get(protectRoute, getMyOrders);

export default router;
