'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  vendor: string;
  inStock: boolean;
}

export function ProductCard({
  id,
  name,
  image,
  price,
  rating,
  reviews,
  vendor,
  inStock,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotateY: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor */}
        <p className="text-xs text-gray-500 mb-1">By {vendor}</p>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-gray-900">₹{price}</p>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inStock}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            inStock
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {inStock ? 'Add to Cart' : 'Unavailable'}
        </motion.button>
      </div>
    </motion.div>
  );
}
