'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Package, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', sales: 4000, revenue: 2400 },
  { day: 'Tue', sales: 3000, revenue: 1398 },
  { day: 'Wed', sales: 2000, revenue: 9800 },
  { day: 'Thu', sales: 2780, revenue: 3908 },
  { day: 'Fri', sales: 1890, revenue: 4800 },
  { day: 'Sat', sales: 2390, revenue: 3800 },
  { day: 'Sun', sales: 3490, revenue: 4300 },
];

export function VendorDashboard() {
  const stats = [
    { icon: ShoppingCart, label: 'Total Sales', value: '342', color: 'from-blue-500 to-blue-600' },
    { icon: Package, label: 'Products', value: '24', color: 'from-purple-500 to-purple-600' },
    { icon: DollarSign, label: 'Revenue', value: '₹1,24,500', color: 'from-green-500 to-green-600' },
    { icon: TrendingUp, label: 'Avg Rating', value: '4.8', color: 'from-yellow-500 to-yellow-600' },
  ];

  const recentOrders = [
    { id: '101', customer: 'John Doe', total: '₹2,499', status: 'Processing' },
    { id: '102', customer: 'Jane Smith', total: '₹1,899', status: 'Shipped' },
    { id: '103', customer: 'Mike Johnson', total: '₹3,299', status: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-purple-100">Manage your shop and track sales</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl text-white p-6 shadow-lg hover:shadow-xl transition`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 mb-1 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="w-10 h-10 opacity-50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Weekly Performance</h2>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Add New Product
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Manage Inventory
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                View Analytics
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Shop Settings
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 text-gray-900 font-semibold">#{order.id}</td>
                    <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                    <td className="py-4 px-4 text-gray-900 font-semibold">{order.total}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
