'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from './context/UserContext';
import Home from './home/page';  
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  const { language } = useUser();

  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-20" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-6">
              Medlex.ai
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto">
              Bridging the gap between healthcare and language, making medical communication accessible to everyone.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/home" className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                Start Chat
              </Link>
              <Link href="/preferences" className="px-8 py-3 bg-white text-blue-600 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg">
                Set Preferences
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-800">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-900">How It Works</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Experience seamless medical communication in your preferred language
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Set Your Preferences</h3>
              <p className="text-gray-800">Choose your language, health conditions, and communication preferences</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Start Chatting</h3>
              <p className="text-gray-800">Communicate with healthcare providers in your preferred language</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Support</h3>
              <p className="text-gray-800">Receive personalized medical information and assistance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Medlex.ai</h3>
              <p className="text-gray-400">
                Making healthcare communication accessible to everyone, everywhere.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link></li>
                <li><Link href="/preferences" className="text-gray-400 hover:text-white transition-colors">Preferences</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: support@medlex.ai</li>
                <li className="text-gray-400">Phone: +1 (555) 123-4567</li>
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