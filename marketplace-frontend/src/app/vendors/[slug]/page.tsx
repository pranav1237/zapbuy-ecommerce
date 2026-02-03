'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Truck,
  Store,
  Share2,
  Heart,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

// Mock vendor data
const mockVendor = {
  id: '1',
  name: 'Fresh Grocers',
  slug: 'fresh-grocers',
  description:
    'Your neighborhood grocery store offering the freshest produce, dairy, and everyday essentials. Family-owned and operated since 2015.',
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
  logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop',
  category: 'Grocery',
  rating: 4.8,
  reviews: 156,
  totalProducts: 245,
  totalOrders: 1250,
  address: '123 MG Road, Koramangala',
  city: 'Bangalore',
  pincode: '560034',
  phone: '+91 98765 43210',
  operatingHours: {
    open: '8:00 AM',
    close: '10:00 PM',
  },
  deliveryOptions: ['delivery', 'pickup'],
  deliveryTime: '30-45 mins',
  isOpen: true,
  isVerified: true,
  joinedDate: 'Jan 2022',
};

const mockProducts = [
  {
    id: '1',
    name: 'Organic Bananas (1 dozen)',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    price: 60,
    rating: 4.7,
    reviews: 45,
    vendor: 'Fresh Grocers',
    inStock: true,
  },
  {
    id: '2',
    name: 'Farm Fresh Eggs (12 pack)',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
    price: 120,
    rating: 4.9,
    reviews: 89,
    vendor: 'Fresh Grocers',
    inStock: true,
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    price: 45,
    rating: 4.5,
    reviews: 67,
    vendor: 'Fresh Grocers',
    inStock: true,
  },
  {
    id: '4',
    name: 'Fresh Milk (1 Liter)',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
    price: 65,
    rating: 4.8,
    reviews: 112,
    vendor: 'Fresh Grocers',
    inStock: true,
  },
  {
    id: '5',
    name: 'Mixed Vegetables Pack',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
    price: 150,
    rating: 4.6,
    reviews: 34,
    vendor: 'Fresh Grocers',
    inStock: false,
  },
  {
    id: '6',
    name: 'Basmati Rice (5 kg)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    price: 450,
    rating: 4.7,
    reviews: 78,
    vendor: 'Fresh Grocers',
    inStock: true,
  },
];

const mockReviews = [
  {
    id: '1',
    user: 'Priya S.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop',
    rating: 5,
    date: '2 days ago',
    comment:
      'Amazing quality products! Always fresh and delivery is super quick. Highly recommended for daily groceries.',
  },
  {
    id: '2',
    user: 'Rahul M.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
    rating: 4,
    date: '1 week ago',
    comment:
      'Good selection of products. Prices are reasonable. Would have given 5 stars if they had more organic options.',
  },
  {
    id: '3',
    user: 'Anita K.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    comment:
      'Best grocery store in the area! The owner is very friendly and always helps with suggestions.',
  },
];

export default function VendorDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // In real app, fetch vendor data based on params.slug

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Banner */}
      <section className="pt-16">
        <div className="relative h-64 sm:h-80">
          <img
            src={mockVendor.image}
            alt={mockVendor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </section>

      {/* Vendor Info Card */}
      <section className="relative -mt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={mockVendor.logo}
                  alt={mockVendor.name}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {mockVendor.name}
                      </h1>
                      {mockVendor.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{mockVendor.category}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900">{mockVendor.rating}</span>
                        <span className="text-gray-500">({mockVendor.reviews} reviews)</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">{mockVendor.totalProducts} products</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">{mockVendor.totalOrders}+ orders</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-lg border ${
                        isWishlisted
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{mockVendor.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {mockVendor.operatingHours.open} - {mockVendor.operatingHours.close}
                    </span>
                    <span
                      className={`ml-1 font-semibold ${
                        mockVendor.isOpen ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ({mockVendor.isOpen ? 'Open' : 'Closed'})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{mockVendor.phone}</span>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="mt-4 flex items-center gap-3">
                  {mockVendor.deliveryOptions.includes('delivery') && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                      <Truck className="w-4 h-4" />
                      Delivery ({mockVendor.deliveryTime})
                    </div>
                  )}
                  {mockVendor.deliveryOptions.includes('pickup') && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      <Store className="w-4 h-4" />
                      In-store Pickup
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-16 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {['products', 'reviews', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 text-sm font-medium border-b-2 capitalize transition ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {tab === 'reviews' && (
                  <span className="ml-1 text-gray-400">({mockVendor.reviews})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Products</h2>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Sort by: Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  Write a Review
                </motion.button>
              </div>

              {/* Rating Summary */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{mockVendor.rating}</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(mockVendor.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">{mockVendor.reviews} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 w-6">{stars}</span>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${stars === 5 ? 60 : stars === 4 ? 25 : 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full object-cover"
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
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {mockVendor.name}</h2>
                <p className="text-gray-600 leading-relaxed">{mockVendor.description}</p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Store Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">
                        {mockVendor.address}, {mockVendor.city} - {mockVendor.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Operating Hours</p>
                      <p className="text-gray-600">
                        {mockVendor.operatingHours.open} - {mockVendor.operatingHours.close} (Mon -
                        Sun)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Contact</p>
                      <p className="text-gray-600">{mockVendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-gray-600">{mockVendor.joinedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Map integration coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
