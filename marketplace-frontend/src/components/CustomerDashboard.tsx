'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '12', color: 'from-blue-500 to-blue-600' },
    { icon: Heart, label: 'Wishlist Items', value: '8', color: 'from-red-500 to-red-600' },
    { icon: MapPin, label: 'Saved Addresses', value: '3', color: 'from-green-500 to-green-600' },
  ];

  const recentOrders = [
    {
      id: '1',
      items: 'Wireless Earbuds',
      total: '₹1,299',
      status: 'Delivered',
      date: '2024-01-25',
    },
    {
      id: '2',
      items: 'Phone Case',
      total: '₹499',
      status: 'In Transit',
      date: '2024-01-23',
    },
    {
      id: '3',
      items: 'Screen Protector',
      total: '₹299',
      status: 'Processing',
      date: '2024-01-22',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.displayName}!</h1>
          <p className="text-purple-100">Manage your orders and preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl text-white p-8 shadow-lg hover:shadow-xl transition`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 opacity-50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{order.items}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-bold text-gray-900">{order.total}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/orders')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <ShoppingBag className="w-5 h-5" />
                View All Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/wishlist')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Heart className="w-5 h-5" />
                My Wishlist
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/addresses')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                <MapPin className="w-5 h-5" />
                Manage Addresses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/settings')}
                className="w-full flex items-center gap-3 p-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:shadow-lg transition"
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
