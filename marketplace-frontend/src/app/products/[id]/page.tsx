'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Store,
  Shield,
  ChevronRight,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Premium Wireless Earbuds - Crystal Clear Sound',
  description:
    'Experience premium sound quality with our wireless earbuds. Features active noise cancellation, 30-hour battery life with the charging case, and IPX5 water resistance. Perfect for workouts, commutes, and everyday use. Comes with multiple ear tip sizes for the perfect fit.',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
  ],
  price: 2499,
  originalPrice: 3999,
  discount: 38,
  rating: 4.5,
  reviews: 128,
  inStock: true,
  stockCount: 15,
  category: 'Electronics',
  vendor: {
    id: '2',
    name: 'TechHub Electronics',
    slug: 'techhub-electronics',
    rating: 4.5,
    totalProducts: 156,
  },
  specifications: [
    { label: 'Battery Life', value: '30 hours (with case)' },
    { label: 'Connectivity', value: 'Bluetooth 5.2' },
    { label: 'Water Resistance', value: 'IPX5' },
    { label: 'Noise Cancellation', value: 'Active' },
    { label: 'Weight', value: '5g per earbud' },
  ],
  deliveryOptions: ['delivery', 'pickup'],
  deliveryTime: '2-3 days',
};

const relatedProducts = [
  {
    id: '2',
    name: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    price: 12999,
    rating: 4.3,
    reviews: 89,
    vendor: 'TechHub Electronics',
    inStock: true,
  },
  {
    id: '3',
    name: 'Wireless Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    price: 3499,
    rating: 4.4,
    reviews: 156,
    vendor: 'TechHub Electronics',
    inStock: true,
  },
  {
    id: '4',
    name: 'USB-C Hub Adapter',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 1299,
    rating: 4.6,
    reviews: 67,
    vendor: 'TechHub Electronics',
    inStock: true,
  },
];

const mockReviews = [
  {
    id: '1',
    user: 'Amit K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
    rating: 5,
    date: '3 days ago',
    comment:
      'Excellent sound quality! The noise cancellation is amazing. Battery lasts forever. Highly recommended!',
    helpful: 24,
  },
  {
    id: '2',
    user: 'Sneha R.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop',
    rating: 4,
    date: '1 week ago',
    comment:
      'Good earbuds for the price. Comfortable fit and decent battery life. Only wish the bass was a bit stronger.',
    helpful: 12,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    toast.success('Redirecting to checkout...');
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-purple-600">
              Products
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/products?category=${mockProduct.category}`}
              className="hover:text-purple-600"
            >
              {mockProduct.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{mockProduct.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={mockProduct.images[selectedImage]}
                  alt={mockProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails */}
              <div className="flex gap-3">
                {mockProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-purple-600' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {/* Vendor */}
              <Link
                href={`/vendors/${mockProduct.vendor.slug}`}
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 mb-2"
              >
                <Store className="w-4 h-4" />
                {mockProduct.vendor.name}
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {mockProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(mockProduct.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">{mockProduct.rating}</span>
                </div>
                <span className="text-gray-500">({mockProduct.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{mockProduct.price.toLocaleString()}
                </span>
                {mockProduct.originalPrice > mockProduct.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{mockProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                      {mockProduct.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {mockProduct.inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">In Stock ({mockProduct.stockCount} available)</span>
                  </div>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Delivery Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Option
                </label>
                <div className="flex gap-3">
                  {mockProduct.deliveryOptions.includes('delivery') && (
                    <button
                      onClick={() => setDeliveryOption('delivery')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                        deliveryOption === 'delivery'
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Home Delivery</p>
                        <p className="text-xs text-gray-500">{mockProduct.deliveryTime}</p>
                      </div>
                    </button>
                  )}
                  {mockProduct.deliveryOptions.includes('pickup') && (
                    <button
                      onClick={() => setDeliveryOption('pickup')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                        deliveryOption === 'pickup'
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Store Pickup</p>
                        <p className="text-xs text-gray-500">Ready today</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(mockProduct.stockCount, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!mockProduct.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!mockProduct.inStock}
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center gap-2 text-sm ${
                    isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Save for later'}
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description & Specs */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-600 leading-relaxed">{mockProduct.description}</p>

              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Specifications</h3>
              <div className="space-y-3">
                {mockProduct.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Card */}
            <div className="bg-white rounded-xl p-6 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sold by</h3>
              <Link
                href={`/vendors/${mockProduct.vendor.slug}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{mockProduct.vendor.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{mockProduct.vendor.rating}</span>
                    <span className="mx-1">|</span>
                    <span>{mockProduct.vendor.totalProducts} products</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                Write a Review
              </button>
            </div>

            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{review.user}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <button className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
