import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get sales trend for chart (last 7 days)
    const last7Days = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" }
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    // Get top selling products
    const topSelling = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          sold: { $sum: "$orderItems.qty" },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          image: { $arrayElemAt: ["$productInfo.images", 0] },
          sold: 1,
          revenue: 1,
          price: "$productInfo.price",
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        shop: {
          orders: totalOrders,
          products: totalProducts,
          users: totalUsers,
        },
        graphData: last7Days.map((day) => ({
          label: day._id,
          value: day.totalSales,
        })),
        topSelling,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  }
};
