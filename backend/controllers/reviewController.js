// controllers/reviewController.js
import Product from '../models/product.js';

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('reviews.user', 'name email') // Populate user details if needed
      .select('reviews name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Sort reviews by date (most recent first)
    const sortedReviews = product.reviews.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      data: sortedReviews,
      count: sortedReviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rating, comment, userId } = req.body;

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create new review object
    const newReview = {
      user: userId || null, // Optional: set to null if no user authentication
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date()
    };

    // Add review to product
    product.reviews.push(newReview);
    
    // Update product rating (average of all reviews)
    const avgRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
    
    // Save product with new review
    await product.save();

    // Get the newly added review (last item in array)
    const addedReview = product.reviews[product.reviews.length - 1];

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        _id: addedReview._id,
        user: addedReview.user,
        rating: addedReview.rating,
        comment: addedReview.comment,
        date: addedReview.date,
        name: name || 'Anonymous' // Return name for display
      },
      productRating: avgRating.toFixed(1)
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Get recommended products
export const getRecommendedProducts = async (req, res) => {
  try {
    const { productId, category } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Build query
    const query = {
      _id: { $ne: productId }, // Exclude current product
      stock: { $gt: 0 }, // Only in-stock products
      isTrashed: false // Exclude trashed products
    };

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Calculate average rating for each product
    const recommendedProducts = await Product.aggregate([
      { $match: query },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0
            }
          },
          reviewCount: { $size: "$reviews" }
        }
      },
      { $sort: { avgRating: -1, reviewCount: -1, createdAt: -1 } },
      { $limit: 4 },
      {
        $project: {
          name: 1,
          images: 1,
          price: 1,
          category: 1,
          avgRating: 1,
          reviewCount: 1,
          discount: 1,
          specialOffer: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: recommendedProducts,
      count: recommendedProducts.length
    });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommended products',
      error: error.message
    });
  }
};

// Optional: Delete a review (if needed)
export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find and remove review
    const reviewIndex = product.reviews.findIndex(
      review => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Optional: Update product average rating (helper function)
export const updateProductRating = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (product && product.reviews.length > 0) {
      const avgRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
      
      // You can add a 'rating' field to your schema if you want to store it
      // product.rating = avgRating.toFixed(1);
      // await product.save();
      
      return avgRating.toFixed(1);
    }
    
    return 0;
  } catch (error) {
    console.error('Error updating product rating:', error);
    return 0;
  }
};