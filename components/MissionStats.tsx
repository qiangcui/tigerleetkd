import React from 'react';
import { motion } from 'framer-motion';
import { Stat } from '../types';

const stats: Stat[] = [
  { label: 'Respect', value: 100, color: 'bg-brand-red' },
  { label: 'Self-Discipline', value: 100, color: 'bg-blue-600' },
  { label: 'Confidence', value: 100, color: 'bg-yellow-500' },
  { label: 'Focus', value: 100, color: 'bg-green-500' },
];

const MissionStats: React.FC = () => {
  return (
    <section id="mission" className="pt-10 pb-20 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                At Tiger Lee's, we strive to provide a clean, bright, and safe training environment – the finest facility, and the best martial arts instruction available in the Denver area.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                It is our intention to balance positive discipline and a high level of expectation with respect, enthusiasm, encouragement, and support. We constantly do our best to be role models for what we would like our students to learn.
              </p>

              <div className="mt-8 p-6 bg-gray-50 border-l-4 border-brand-red rounded-r-lg shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Our Core Goals</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Highest quality martial arts instruction</li>
                  <li>Helping students reach maximum potential</li>
                  <li>Positive impact through Tae Kwon Do</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Stats/Image */}
          <div className="lg:w-1/2 w-full">
            <div className="relative mb-12 transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/assets/images/home_banner5.png"
                alt="Martial Arts Group"
                className="rounded-xl shadow-2xl w-full object-cover"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-dots-pattern opacity-20 hidden md:block"></div>
            </div>

            <div className="space-y-6">
              {stats.map((stat, index) => (
                <div key={stat.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-700">{stat.label}</span>
                    <span className="font-bold text-gray-700">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <motion.div
                      className={`h-4 rounded-full ${stat.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionStats;