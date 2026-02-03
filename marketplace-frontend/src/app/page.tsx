'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { VendorCard } from '@/components/VendorCard';
import { motion } from 'framer-motion';
import { MapPin, Store, Truck, Search, ShoppingBag, Star, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Bangalore, Karnataka');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredVendors = [
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
      isOpen: true,
      address: 'Indiranagar, Bangalore',
    },
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Earbuds',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      price: 2499,
      rating: 4.5,
      reviews: 128,
      vendor: 'TechHub Electronics',
      inStock: true,
    },
    {
      id: '2',
      name: 'Organic Bananas (1 dozen)',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
      price: 60,
      rating: 4.7,
      reviews: 45,
      vendor: 'Fresh Grocers',
      inStock: true,
    },
    {
      id: '3',
      name: 'Handwoven Silk Saree',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
      price: 5499,
      rating: 4.9,
      reviews: 234,
      vendor: 'Artisan Crafts',
      inStock: true,
    },
    {
      id: '4',
      name: 'Farm Fresh Eggs (12 pack)',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
      price: 120,
      rating: 4.8,
      reviews: 89,
      vendor: 'Fresh Grocers',
      inStock: true,
    },
  ];

  const categories = [
    { name: 'Grocery', icon: '🥬', count: 45 },
    { name: 'Electronics', icon: '📱', count: 32 },
    { name: 'Fashion', icon: '👗', count: 28 },
    { name: 'Handicrafts', icon: '🎨', count: 19 },
    { name: 'Home & Kitchen', icon: '🏠', count: 24 },
    { name: 'Beauty', icon: '💄', count: 16 },
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-6"
            >
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm">{location}</span>
              <button className="text-purple-400 text-sm font-medium hover:text-purple-300">
                Change
              </button>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Shop Local, Support{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Community
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto text-pretty">
              Discover trusted vendors near you. From fresh groceries to handmade crafts - support local businesses and get faster delivery.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder='Search products or vendors (e.g., "Rice near me")'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 rounded-2xl border-0 shadow-2xl focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/vendors"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
              >
                <Store className="w-4 h-4" />
                Browse Vendors
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
              >
                <ShoppingBag className="w-4 h-4" />
                All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/products?category=${cat.name}`}
                  className="flex flex-col items-center p-4 bg-white rounded-xl hover:shadow-lg transition group"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="font-medium text-gray-900 text-sm text-center">{cat.name}</span>
                  <span className="text-xs text-gray-500">{cat.count} vendors</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: MapPin, 
                title: 'Hyperlocal Discovery', 
                desc: 'Find vendors and products right in your neighborhood',
                color: 'bg-purple-100 text-purple-600'
              },
              { 
                icon: Truck, 
                title: 'Fast Local Delivery', 
                desc: 'Get products delivered quickly from nearby shops',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                icon: Shield, 
                title: 'Verified Vendors', 
                desc: 'Shop with confidence from trusted local businesses',
                color: 'bg-green-100 text-green-600'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-2xl ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Vendors Near You</h2>
              <p className="text-gray-600 mt-1">Top-rated local shops in your area</p>
            </div>
            <Link
              href="/vendors"
              className="flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VendorCard {...vendor} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
              <p className="text-gray-600 mt-1">Popular items from local vendors</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Become a Vendor */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <Store className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4">Grow Your Business Online</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of local vendors already selling on ZapBuy. Easy setup, low fees, and access to customers in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vendor/register"
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-xl transition"
              >
                Start Selling Today
              </Link>
              <Link
                href="/vendor/learn-more"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Local Vendors' },
              { value: '10,000+', label: 'Products Listed' },
              { value: '50+', label: 'Cities Covered' },
              { value: '25,000+', label: 'Happy Customers' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

