'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Check } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/stores';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  vendor: string;
  vendorSlug?: string;
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
  vendorSlug = 'vendor',
  inStock,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, items } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const existingVendor = items[0]?.vendor;
    const currentVendorId = vendorSlug;

    // Check if cart has items from a different vendor
    if (existingVendor && existingVendor.slug !== currentVendorId && items.length > 0) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Replace cart items?</p>
          <p className="text-sm text-gray-600">
            Your cart has items from {existingVendor.name}. Adding this item will clear your cart.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                addToCart();
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg"
            >
              Replace
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 5000 });
      return;
    }

    addToCart();
  };

  const addToCart = () => {
    addItem({
      id: `cart-${id}-${Date.now()}`,
      productId: id,
      quantity: 1,
      price,
      name,
      image,
      vendor: {
        id: vendorSlug,
        name: vendor,
        slug: vendorSlug,
      },
      inStock,
    });

    setIsAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Link href={`/products/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.05 : 1,
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition"
          >
            <Heart
              className={`w-4 h-4 ${
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
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({reviews})</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <p className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</p>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!inStock || isAdded}
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm ${
              isAdded
                ? 'bg-green-500 text-white'
                : inStock
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {inStock ? 'Add to Cart' : 'Unavailable'}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
}
