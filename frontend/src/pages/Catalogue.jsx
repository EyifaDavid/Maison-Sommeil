import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { useGetProductByIdQuery } from '../redux/slices/api/productApiSlice';
import { toast } from 'sonner';
import store from '../redux/store';

// Helper function for rating summary
const getRatingSummary = (reviews) => {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return { average: 0, counts: [0, 0, 0, 0, 0], totalReviews: 0 };

  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    counts[r.rating - 1]++;
  });

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  return { average, counts, totalReviews };
};

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const product = data?.data;

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  const dispatch = useDispatch();
  const ratingSummary = getRatingSummary(reviews);

  const averageRating =
  reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : product?.rating ?? 0;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.[0] || '');
      fetchReviews(product._id);
      fetchRecommendedProducts(product._id, product.category);
    }
  }, [product]);

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}/reviews`);
      const data = await response.json();
      if (data.success) {
        const reviewsWithNames = data.data.map((review) => ({
          ...review,
          name: review.user?.name || 'Anonymous',
          createdAt: review.date,
        }));
        setReviews(reviewsWithNames || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchRecommendedProducts = async (productId, category) => {
    setRecommendedLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/recommended?productId=${productId}&category=${category}`);
      const data = await response.json();
      if (data.success) {
        setRecommendedProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setRecommendedLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Review submitted successfully');
        setReviews([data.data, ...reviews]);
        setNewReview({ rating: 5, comment: '', name: '' });
        setShowReviewForm(false);
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      countInStock: product.stock,
    };
    dispatch(addToCart({ productId: item.id, quantity: 1 }));
    toast.success('Added to cart');
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= rating ? '★' : '☆'}</span>
      ))}
    </div>
  );




  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
      </div>
    );

  if (error) return <p>Error loading product</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="min-h-screen">
      {/* Product Section */}
      <div className="flex flex-col mb-5 md:flex-row gap-10 p-6 max-w-7xl mx-auto">
        {/* Left */}
        <div className="md:w-1/2 w-full">
          <img src={selectedImage} alt={product.name} className="w-full h-[500px] object-contain rounded-xl" />
          <div className="flex justify-center gap-3 mt-4">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img ? 'border-black' : 'border-transparent'
                }`}
                alt={`Preview ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="md:w-1/2 w-full space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2 text-yellow-400">
            {'★'.repeat(Math.round(averageRating))}
            {'☆'.repeat(5 - Math.round(averageRating))}
            <span className="text-sm text-gray-500">
              ({averageRating.toFixed(1)})
            </span>
          </div>
          <p>{product.description}</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
          </p>

          {/* Colors */}
          <div className="flex items-center gap-2">
            {product.colors?.map((color, idx) => (
              <span
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  selectedColor === color ? 'border-black' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Sizes */}
          <div>
            <p>Size:</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((size, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded cursor-pointer hover:bg-gray-200 ${
                    selectedSize === size ? 'bg-black text-white' : 'border-transparent'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center">
            <Button label="Add to Cart" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800" onClick={handleAddToCart} />
            <Link to="/cart" className="ml-4 text-black">
              <MdOutlineShoppingBag size={30} className="hover:cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            label={showReviewForm ? 'Cancel Review' : 'Write a Review'}
          />
        </div>

        {/* Overall Rating Summary */}
        {reviews.length > 0 && (
          <div className="mb-12 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Overall Customer Rating</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:w-1/3">
                <p className="text-6xl font-extrabold text-pink-500">{ratingSummary.average.toFixed(1)}</p>
                <div className="flex justify-center my-2">{renderStars(Math.round(ratingSummary.average))}</div>
                <p className="text-gray-500 text-sm">Based on {ratingSummary.totalReviews} review{ratingSummary.totalReviews > 1 ? 's' : ''}</p>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingSummary.counts[star - 1];
                  const percentage = ((count / ratingSummary.totalReviews) * 100).toFixed(1);
                  return (
                    <div key={star} className="flex items-center gap-3 mb-3">
                      <span className="w-10 text-sm font-medium text-gray-700">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-pink-600 h-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="w-12 text-sm text-gray-600 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className="text-3xl focus:outline-none">
                      <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button label="Submit Review" type="submit" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800" />
                <button type="button" onClick={() => setShowReviewForm(false)} className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`}
                      alt={review.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Products */}
      <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-pink-50 to-purple-50">
        <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
        {recommendedLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
          </div>
        ) : recommendedProducts.length === 0 ? (
          <p className="text-center text-gray-500">No recommendations available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((recProduct) => (
              <Link
                key={recProduct._id}
                to={`/product/${recProduct._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={recProduct.images?.[0]} alt={recProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(recProduct?.rating ?? 0)}
                    <span className="text-sm text-gray-500">({recProduct.rating ?? 0})</span>
                  </div>
                  <p className="text-xl font-bold text-pink-500">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(recProduct.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
