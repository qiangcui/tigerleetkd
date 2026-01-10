import React from 'react';
import { motion } from 'framer-motion';
import CTA from '../components/CTA';

const GetStartedPage: React.FC = () => {
  return (
    <div className="pt-0">
      {/* Page Hero - Matching Original Site */}
      <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('assets/images/exterior-tigerlee.jpg')" }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center h-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Get Started
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide">
              Start your journey to black belt here
            </p>
          </motion.div>
        </div>
      </div>

      {/* The Booking Section */}
      <CTA />
    </div>
  );
};

export default GetStartedPage;