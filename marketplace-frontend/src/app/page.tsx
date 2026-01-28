'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Earbuds',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      price: 2499,
      rating: 4.5,
      reviews: 128,
      vendor: 'TechHub',
      inStock: true,
    },
    {
      id: '2',
      name: 'Stainless Steel Water Bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffee?w=400&h=400&fit=crop',
      price: 899,
      rating: 4.8,
      reviews: 56,
      vendor: 'HomeEssentials',
      inStock: true,
    },
    {
      id: '3',
      name: 'Smart Watch Pro',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      price: 12999,
      rating: 4.3,
      reviews: 89,
      vendor: 'TechHub',
      inStock: true,
    },
    {
      id: '4',
      name: 'Leather Messenger Bag',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
      price: 5499,
      rating: 4.7,
      reviews: 42,
      vendor: 'FashionHub',
      inStock: false,
    },
    {
      id: '5',
      name: 'Premium Yoga Mat',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
      price: 1999,
      rating: 4.6,
      reviews: 73,
      vendor: 'FitnessGear',
      inStock: true,
    },
    {
      id: '6',
      name: 'Wireless Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
      price: 3499,
      rating: 4.4,
      reviews: 156,
      vendor: 'GamingZone',
      inStock: true,
    },
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-purple-900 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ZapBuy</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover amazing products from trusted local vendors. Shop smart, save more.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-xl transition"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShoppingBag, title: 'Wide Selection', desc: '10,000+ products' },
              { icon: Truck, title: 'Fast Shipping', desc: 'Free on orders ₹500+' },
              { icon: Shield, title: 'Secure Payment', desc: 'SSL encrypted' },
              { icon: Zap, title: 'Best Deals', desc: 'Exclusive offers daily' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Trending items from our top vendors</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-600 hover:text-white transition">
              View All Products
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-4xl font-bold mb-4">Become a Vendor</h2>
            <p className="text-xl mb-8 opacity-90">Reach millions of customers and grow your business</p>
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-xl transition">
              Start Selling
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

