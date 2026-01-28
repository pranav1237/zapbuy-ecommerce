'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';
import { AuthModal } from './AuthModal';
import Link from 'next/link';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAdmin, isVendor } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">Marketplace</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-gray-700 hover:text-purple-600 transition">
                Products
              </Link>
              <Link href="/vendors" className="text-gray-700 hover:text-purple-600 transition">
                Vendors
              </Link>
              {user && isVendor && (
                <Link href="/vendor-dashboard" className="text-gray-700 hover:text-purple-600 transition">
                  Dashboard
                </Link>
              )}
              {user && isAdmin && (
                <Link href="/admin-dashboard" className="text-gray-700 hover:text-purple-600 transition">
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </motion.button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      {isVendor && (
                        <Link
                          href="/vendor-settings"
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                        >
                          <Settings className="w-4 h-4" />
                          Vendor Settings
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
                >
                  Sign In
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Products
              </Link>
              <Link href="/vendors" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Vendors
              </Link>
              {user && isVendor && (
                <Link href="/vendor-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
              )}
              {user && isAdmin && (
                <Link href="/admin-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Admin
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
