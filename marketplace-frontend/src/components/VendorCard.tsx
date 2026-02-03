'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Truck, Store } from 'lucide-react';
import Link from 'next/link';

interface VendorCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  distance: number;
  deliveryOptions: string[];
  isOpen: boolean;
  address: string;
}

export function VendorCard({
  id,
  name,
  slug,
  image,
  category,
  rating,
  reviews,
  distance,
  deliveryOptions,
  isOpen,
  address,
}: VendorCardProps) {
  return (
    <Link href={`/vendors/${slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Status Badge */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
              isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </div>
          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>

          {/* Address */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{address}</span>
          </div>

          {/* Rating and Distance */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-500 text-sm">({reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{distance} km away</span>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="flex items-center gap-2">
            {deliveryOptions.includes('delivery') && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                <Truck className="w-3 h-3" />
                Delivery
              </div>
            )}
            {deliveryOptions.includes('pickup') && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                <Store className="w-3 h-3" />
                Pickup
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
