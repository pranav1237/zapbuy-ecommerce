'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Store, TrendingUp, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, PieChart as PieChartComponent, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', orders: 4000, revenue: 2400 },
  { day: 'Tue', orders: 3000, revenue: 1398 },
  { day: 'Wed', orders: 2000, revenue: 9800 },
  { day: 'Thu', orders: 2780, revenue: 3908 },
  { day: 'Fri', orders: 1890, revenue: 4800 },
  { day: 'Sat', orders: 2390, revenue: 3800 },
  { day: 'Sun', orders: 3490, revenue: 4300 },
];

const pieData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Beauty', value: 20 },
];

const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981'];

export function AdminDashboard() {
  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', color: 'from-blue-500 to-blue-600' },
    { icon: Store, label: 'Active Vendors', value: '89', color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, label: 'Total Revenue', value: '₹45,67,890', color: 'from-green-500 to-green-600' },
    { icon: AlertCircle, label: 'Pending Orders', value: '23', color: 'from-red-500 to-red-600' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Customer', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'Vendor', joined: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'Customer', joined: '2024-01-05' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', type: 'Vendor', joined: '2024-01-01' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Manage platform, users, and vendors</p>
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Revenue & Orders</h2>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Product Distribution</h2>
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChartComponent>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChartComponent>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 text-gray-900 font-semibold">{user.name}</td>
                    <td className="py-4 px-4 text-gray-700">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.type === 'Vendor'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{user.joined}</td>
                    <td className="py-4 px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-purple-600 hover:text-purple-700 font-semibold"
                      >
                        View
                      </motion.button>
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
