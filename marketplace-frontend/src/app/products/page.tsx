'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Package, X, SlidersHorizontal } from 'lucide-react';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Earbuds',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    price: 2499,
    rating: 4.5,
    reviews: 128,
    vendor: 'TechHub Electronics',
    vendorSlug: 'techhub-electronics',
    inStock: true,
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Organic Bananas (1 dozen)',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    price: 60,
    rating: 4.7,
    reviews: 45,
    vendor: 'Fresh Grocers',
    vendorSlug: 'fresh-grocers',
    inStock: true,
    category: 'Grocery',
  },
  {
    id: '3',
    name: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    price: 12999,
    rating: 4.3,
    reviews: 89,
    vendor: 'TechHub Electronics',
    vendorSlug: 'techhub-electronics',
    inStock: true,
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'Handwoven Silk Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
    price: 5499,
    rating: 4.9,
    reviews: 234,
    vendor: 'Artisan Crafts',
    vendorSlug: 'artisan-crafts',
    inStock: true,
    category: 'Fashion',
  },
  {
    id: '5',
    name: 'Farm Fresh Eggs (12 pack)',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
    price: 120,
    rating: 4.9,
    reviews: 89,
    vendor: 'Fresh Grocers',
    vendorSlug: 'fresh-grocers',
    inStock: true,
    category: 'Grocery',
  },
  {
    id: '6',
    name: 'Premium Yoga Mat',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    price: 1999,
    rating: 4.6,
    reviews: 73,
    vendor: 'FitnessGear',
    vendorSlug: 'fitness-gear',
    inStock: true,
    category: 'Sports',
  },
  {
    id: '7',
    name: 'Ceramic Dinner Set',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    price: 2899,
    rating: 4.4,
    reviews: 56,
    vendor: 'Home Essentials',
    vendorSlug: 'home-essentials',
    inStock: true,
    category: 'Home & Kitchen',
  },
  {
    id: '8',
    name: 'Natural Face Serum',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    price: 899,
    rating: 4.8,
    reviews: 198,
    vendor: 'Beauty Corner',
    vendorSlug: 'beauty-corner',
    inStock: true,
    category: 'Beauty',
  },
  {
    id: '9',
    name: 'Wireless Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    price: 3499,
    rating: 4.4,
    reviews: 156,
    vendor: 'TechHub Electronics',
    vendorSlug: 'techhub-electronics',
    inStock: false,
    category: 'Electronics',
  },
  {
    id: '10',
    name: 'Basmati Rice (5 kg)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    price: 450,
    rating: 4.7,
    reviews: 78,
    vendor: 'Fresh Grocers',
    vendorSlug: 'fresh-grocers',
    inStock: true,
    category: 'Grocery',
  },
  {
    id: '11',
    name: 'Cotton Kurta Set',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    price: 1299,
    rating: 4.5,
    reviews: 67,
    vendor: 'Style Fashion',
    vendorSlug: 'style-fashion',
    inStock: true,
    category: 'Fashion',
  },
  {
    id: '12',
    name: 'Stainless Steel Water Bottle',
    image: 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffee?w=400&h=400&fit=crop',
    price: 899,
    rating: 4.8,
    reviews: 56,
    vendor: 'Home Essentials',
    vendorSlug: 'home-essentials',
    inStock: true,
    category: 'Home & Kitchen',
  },
];

const categories = [
  'All',
  'Grocery',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Handicrafts',
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹2000', min: 500, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: 'Above ₹5000', min: 5000, max: Infinity },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>(
    'popular'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState(mockProducts);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...mockProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    const range = priceRanges[selectedPriceRange];
    filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max);

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setProducts(filtered);
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, inStockOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceRange(0);
    setSortBy('popular');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All' || selectedPriceRange !== 0 || inStockOnly;

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
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Browse Products</h1>
            <p className="text-gray-300 text-lg mb-8">
              Discover amazing products from local vendors near you
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder='Search products (e.g., "Rice near me")'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories - Scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 flex-1">
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
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-gray-200 mt-4"
            >
              <div className="flex flex-wrap gap-6 items-end">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[150px]"
                  >
                    {priceRanges.map((range, i) => (
                      <option key={i} value={i}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[150px]"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="inStock" className="text-sm text-gray-700">
                    In Stock Only
                  </label>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
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
              <span className="font-semibold text-gray-900">{products.length}</span> products found
              {searchQuery && (
                <span>
                  {' '}
                  for "<span className="font-medium">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
