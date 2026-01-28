'use client';

import { Navigation } from '@/components/Navigation';
import { Hero3D } from '@/components/Hero3D';
import { ProductCard } from '@/components/ProductCard';
import { motion } from 'framer-motion';

export default function Home() {
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
      name: 'Wireless Keyboard',
      image: 'https://images.unsplash.com/photo-1587829191301-72e2b5eaf1ee?w=400&h=400&fit=crop',
      price: 3499,
      rating: 4.6,
      reviews: 67,
      vendor: 'TechHub',
      inStock: true,
    },
    {
      id: '6',
      name: 'Premium Sunglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      price: 4999,
      rating: 4.9,
      reviews: 34,
      vendor: 'StyleMax',
      inStock: true,
    },
  ];

  return (
    <main className="w-full">
      <Navigation />
      
      {/* Hero 3D Section */}
      <Hero3D />

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-xl text-gray-600">Discover our curated collection from trusted local vendors</p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg hover:shadow-xl transition"
            >
              View All Products
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🚚', title: 'Fast Delivery', description: 'Quick and reliable shipping to your doorstep' },
              { icon: '🛡️', title: 'Secure Payment', description: 'Multiple payment options with secure transactions' },
              { icon: '⭐', title: 'Quality Guaranteed', description: 'Hand-picked products from trusted vendors' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-purple-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">About</h4>
              <p>Your trusted local marketplace for quality products</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Products</a></li>
                <li><a href="#" className="hover:text-white">Vendors</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Follow Us</h4>
              <p>Social media links coming soon</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2024 Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

