'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Check, X, Zap, Star, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    color: 'bg-gray-100 text-gray-700',
    buttonColor: 'bg-gray-900 hover:bg-gray-800',
    features: [
      'Up to 25 product listings',
      'Basic storefront',
      'Standard support',
      '5% transaction fee',
    ],
    limitations: [
      'No analytics',
      'No promotional tools',
      'Basic visibility',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 999,
    period: 'month',
    description: 'Best for growing businesses',
    icon: Star,
    color: 'bg-purple-100 text-purple-700',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    popular: true,
    features: [
      'Up to 100 product listings',
      'Custom storefront',
      'Priority support',
      '3% transaction fee',
      'Basic analytics',
      'Promotional banners',
      'Featured in category',
    ],
    limitations: [
      'Limited API access',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2499,
    period: 'month',
    description: 'For established sellers',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    features: [
      'Unlimited product listings',
      'Premium storefront themes',
      'Dedicated account manager',
      '1.5% transaction fee',
      'Advanced analytics & reports',
      'All promotional tools',
      'Homepage featured placement',
      'API access',
      'Multi-location support',
    ],
    limitations: [],
  },
];

const featureComparison: PlanFeature[] = [
  { name: 'Product Listings', basic: '25', standard: '100', premium: 'Unlimited' },
  { name: 'Transaction Fee', basic: '5%', standard: '3%', premium: '1.5%' },
  { name: 'Custom Storefront', basic: false, standard: true, premium: true },
  { name: 'Analytics Dashboard', basic: false, standard: 'Basic', premium: 'Advanced' },
  { name: 'Promotional Tools', basic: false, standard: true, premium: true },
  { name: 'Featured Placement', basic: false, standard: 'Category', premium: 'Homepage' },
  { name: 'Priority Support', basic: false, standard: true, premium: true },
  { name: 'Dedicated Manager', basic: false, standard: false, premium: true },
  { name: 'API Access', basic: false, standard: false, premium: true },
  { name: 'Multi-location', basic: false, standard: false, premium: true },
];

export default function VendorPlansPage() {
  const { user, isVendor } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (price: number) => {
    if (price === 0) return 0;
    return billingPeriod === 'yearly' ? Math.round(price * 10) : price;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Start free and scale as you grow. All plans include core features to help you succeed.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 bg-white/10 rounded-xl">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2.5 rounded-lg font-medium transition ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                  <div className={`inline-flex p-3 rounded-xl ${plan.color} mb-4`}>
                    <plan.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `₹${getPrice(plan.price).toLocaleString()}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-2">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>

                  <Link
                    href={isVendor ? '/vendor/dashboard' : `/vendor/register?plan=${plan.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold transition ${plan.buttonColor}`}
                  >
                    {isVendor ? 'Go to Dashboard' : 'Get Started'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare All Features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{feature.name}</td>
                    {(['basic', 'standard', 'premium'] as const).map((plan) => (
                      <td key={plan} className="text-center py-4 px-4">
                        {typeof feature[plan] === 'boolean' ? (
                          feature[plan] ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-900 font-medium">{feature[plan]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and wallet payments through our secure payment gateway.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'What happens if I exceed my product limit?',
                a: 'You will receive a notification to upgrade your plan. Existing listings remain active, but you cannot add new products until you upgrade.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
