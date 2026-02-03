'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { VendorCard } from '@/components/VendorCard';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, ChevronDown, Store } from 'lucide-react';

// Mock data - will be replaced with API calls
const mockVendors = [
  {
    id: '1',
    name: 'Fresh Grocers',
    slug: 'fresh-grocers',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    category: 'Grocery',
    rating: 4.8,
    reviews: 156,
    distance: 1.2,
    deliveryOptions: ['delivery', 'pickup'],
    isOpen: true,
    address: 'MG Road, Bangalore',
  },
  {
    id: '2',
    name: 'TechHub Electronics',
    slug: 'techhub-electronics',
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&h=300&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    reviews: 89,
    distance: 2.5,
    deliveryOptions: ['delivery'],
    isOpen: true,
    address: 'Koramangala, Bangalore',
  },
  {
    id: '3',
    name: 'Artisan Crafts',
    slug: 'artisan-crafts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=300&fit=crop',
    category: 'Handicrafts',
    rating: 4.9,
    reviews: 234,
    distance: 0.8,
    deliveryOptions: ['pickup'],
    isOpen: false,
    address: 'Indiranagar, Bangalore',
  },
  {
    id: '4',
    name: 'Style Fashion',
    slug: 'style-fashion',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
    category: 'Fashion',
    rating: 4.3,
    reviews: 67,
    distance: 3.1,
    deliveryOptions: ['delivery', 'pickup'],
    isOpen: true,
    address: 'Jayanagar, Bangalore',
  },
  {
    id: '5',
    name: 'Home Essentials',
    slug: 'home-essentials',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.6,
    reviews: 112,
    distance: 1.8,
    deliveryOptions: ['delivery'],
    isOpen: true,
    address: 'HSR Layout, Bangalore',
  },
  {
    id: '6',
    name: 'Beauty Corner',
    slug: 'beauty-corner',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    category: 'Beauty',
    rating: 4.7,
    reviews: 198,
    distance: 2.2,
    deliveryOptions: ['delivery', 'pickup'],
    isOpen: true,
    address: 'Whitefield, Bangalore',
  },
];

const categories = [
  'All',
  'Grocery',
  'Electronics',
  'Fashion',
  'Handicrafts',
  'Home & Kitchen',
  'Beauty',
];

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState(mockVendors);
  const [location, setLocation] = useState('Bangalore, Karnataka');

  // Filter and sort vendors
  useEffect(() => {
    let filtered = [...mockVendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    // Delivery filter
    if (deliveryFilter !== 'all') {
      filtered = filtered.filter((v) => v.deliveryOptions.includes(deliveryFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

    setVendors(filtered);
  }, [searchQuery, selectedCategory, deliveryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Discover Local Vendors
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Find trusted shops and services near you
            </p>

            {/* Location */}
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-8">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{location}</span>
              <button className="text-sm underline hover:text-purple-300">Change</button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-gray-200 mt-4"
            >
              <div className="flex flex-wrap gap-6">
                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Options
                  </label>
                  <div className="flex gap-2">
                    {['all', 'delivery', 'pickup'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setDeliveryFilter(option as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                          deliveryFilter === option
                            ? 'bg-purple-100 text-purple-700 border border-purple-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {option === 'all' ? 'All' : option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="distance">Nearest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{vendors.length}</span> vendors found
            </p>
          </div>

          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VendorCard {...vendor} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
