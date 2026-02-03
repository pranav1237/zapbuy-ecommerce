'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useCartStore } from '@/lib/stores';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Store,
  Shield,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const {
    items,
    deliveryOption,
    setDeliveryOption,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
  });

  useEffect(() => {
    setIsClient(true);
    // Pre-fill user data if available
    if (user?.displayName) {
      setAddress((prev) => ({ ...prev, fullName: user.displayName || '' }));
    }
  }, [user]);

  if (!isClient) {
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine1 ||
      !address.city ||
      !address.pincode
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (address.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (address.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order ID
    const orderId = `ORD${Date.now().toString().slice(-8)}`;

    toast.success('Order placed successfully!');
    clearCart();
    router.push(`/orders/${orderId}/success`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Delivery</span>
              </div>
              <div className={`w-20 h-1 mx-4 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>

                  {/* Delivery Option */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How would you like to receive your order?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('delivery')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                          deliveryOption === 'delivery'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            deliveryOption === 'delivery'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Truck className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Home Delivery</p>
                          <p className="text-sm text-gray-500">2-3 days delivery</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryOption('pickup')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                          deliveryOption === 'pickup'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            deliveryOption === 'pickup'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Store className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Store Pickup</p>
                          <p className="text-sm text-gray-500">Ready today</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Address Form */}
                  {deliveryOption === 'delivery' && (
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={address.fullName}
                              onChange={(e) =>
                                setAddress({ ...address, fullName: e.target.value })
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={address.phone}
                              onChange={(e) =>
                                setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="10-digit mobile number"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={address.addressLine1}
                            onChange={(e) =>
                              setAddress({ ...address, addressLine1: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="House/Flat No., Building Name, Street"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={address.addressLine2}
                          onChange={(e) =>
                            setAddress({ ...address, addressLine2: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Area, Landmark (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={address.pincode}
                            onChange={(e) =>
                              setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="6-digit pincode"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </form>
                  )}

                  {/* Pickup Details */}
                  {deliveryOption === 'pickup' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Pickup Location</h3>
                        <p className="text-gray-600">{items[0]?.vendor.name}</p>
                        <p className="text-sm text-gray-500">
                          Address will be shared after order confirmation
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            value={address.fullName}
                            onChange={(e) =>
                              setAddress({ ...address, fullName: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Name for pickup"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={address.phone}
                            onChange={(e) =>
                              setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="10-digit mobile"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!address.fullName || !address.phone) {
                            toast.error('Please fill in your name and phone number');
                            return;
                          }
                          setStep(2);
                        }}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-purple-600 text-sm font-medium hover:text-purple-700"
                    >
                      Edit Delivery
                    </button>
                  </div>

                  {/* Delivery Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      {deliveryOption === 'delivery' ? (
                        <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                      ) : (
                        <Store className="w-5 h-5 text-gray-600 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {deliveryOption === 'delivery' ? 'Delivering to' : 'Pickup by'}
                        </p>
                        <p className="text-gray-600">{address.fullName}</p>
                        {deliveryOption === 'delivery' && (
                          <p className="text-sm text-gray-500">
                            {address.addressLine1}, {address.city} - {address.pincode}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">{address.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                        paymentMethod === 'online'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          paymentMethod === 'online'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-900">Pay Online</p>
                        <p className="text-sm text-gray-500">
                          UPI, Cards, Net Banking, Wallets
                        </p>
                      </div>
                      {paymentMethod === 'online' && (
                        <Check className="w-6 h-6 text-purple-600" />
                      )}
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                        paymentMethod === 'cod'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          paymentMethod === 'cod'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="text-lg font-bold">₹</span>
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <Check className="w-6 h-6 text-purple-600" />
                      )}
                    </button>
                  </div>

                  {/* Place Order Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Place Order - ₹{total.toLocaleString()}
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
