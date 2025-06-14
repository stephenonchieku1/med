'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useUser } from './context/UserContext';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Dynamically import the Home component
const Home = dynamic(() => import('./home/page'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const LandingPage = () => {
  const { language } = useUser();
  const prefersReducedMotion = useReducedMotion();

  // Memoize static content
  const features = useMemo(() => [
    {
      title: 'Multilingual Medical Communication',
      description: 'Break down language barriers in healthcare with real-time translation and interpretation.',
      icon: '🌐'
    },
    {
      title: 'Personalized Health Insights',
      description: 'Get tailored medical information based on your health profile and preferences.',
      icon: '🎯'
    },
    {
      title: 'Emergency Assistance',
      description: 'Quick access to medical information and emergency contacts in any language.',
      icon: '🚑'
    },
    {
      title: 'Cultural Sensitivity',
      description: 'Healthcare communication that respects cultural differences and medical traditions.',
      icon: '🤝'
    }
  ], []);

  // Animation variants
  const fadeInUp = {
    initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white" role="banner">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-20" aria-hidden="true" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-6">
              Medlex.ai
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
              Bridging the gap between healthcare and language, making medical communication accessible to everyone.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/home" 
                className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                role="button"
                aria-label="Start Chat"
              >
                Start Chat
              </Link>
              <Link 
                href="/preferences" 
                className="px-8 py-3 bg-white text-blue-600 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
                role="button"
                aria-label="Set Preferences"
              >
                Set Preferences
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" role="region" aria-label="Features">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-4" role="img" aria-label={feature.title}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-800">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white" role="region" aria-label="How It Works">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-900">How It Works</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Experience seamless medical communication in your preferred language
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Set Your Preferences',
                description: 'Choose your language, health conditions, and communication preferences',
                x: -20
              },
              {
                step: 2,
                title: 'Start Chatting',
                description: 'Communicate with healthcare providers in your preferred language',
                y: 20
              },
              {
                step: 3,
                title: 'Get Support',
                description: 'Receive personalized medical information and assistance',
                x: 20
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: step.x, y: step.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-800">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Medlex.ai</h3>
              <p className="text-gray-400">
                Making healthcare communication accessible to everyone, everywhere.
              </p>
            </div>
            <nav aria-label="Quick Links">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                <li><Link href="/preferences" className="text-gray-400 hover:text-white transition-colors">Preferences</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              </ul>
            </nav>
            <nav aria-label="Support">
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </nav>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: <a href="mailto:support@medlex.ai" className="hover:text-white transition-colors">support@medlex.ai</a></li>
                <li className="text-gray-400">Phone: <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Medlex.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 