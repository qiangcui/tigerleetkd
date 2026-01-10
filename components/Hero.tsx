import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-dark">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/children-sparring.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-brand-red font-bold tracking-[0.3em] uppercase mb-4 text-base md:text-xl">
            World Class Tae Kwon Do
          </h2>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Building Character & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Confidence Is Our Specialty
            </span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 drop-shadow-md">
            Discipline, Respect, and Confidence. Join Denver's premier martial arts academy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <a
              href="#programs"
              className="relative group inline-flex items-center justify-center bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(211,47,47,0.4)] hover:shadow-[0_0_30px_rgba(211,47,47,0.6)]"
            >
              <span className="relative z-10">View Programs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center gap-4 text-white group cursor-pointer bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/20 backdrop-blur-md transition-all duration-300"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-red rounded-full scale-100 group-hover:scale-125 opacity-20 group-hover:opacity-40 transition-all duration-500 animate-ping"></div>
                <div className="relative w-12 h-12 rounded-full bg-brand-red flex items-center justify-center transition-all duration-300 group-hover:rotate-[360deg]">
                  <Play fill="currentColor" size={20} className="ml-1" />
                </div>
              </div>
              <div className="text-left">
                <span className="block text-xs uppercase tracking-widest text-gray-300 font-bold mb-0.5">Video Produced by</span>
                <span className="block font-bold text-lg group-hover:text-brand-red transition-colors">Denver 9 News</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
      </motion.div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          ></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-10"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all z-20"
            >
              <X size={24} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/h-rkcDsyPrc?autoplay=1&mute=1&rel=0"
              title="Tiger Lee World Class Tae Kwon Do - 9News Feature"
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Hero;