import React from 'react';
import { motion } from 'framer-motion';
import { Program } from '../types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const programsData: Program[] = [
  {
    id: 'little-tigers',
    title: 'Little Tigers',
    ageGroup: '(4-5 yr olds)',
    description: 'Working through a martial art and the belt ranking system gives kids measurable goals to follow that are realistic to attain. The sense of accomplishment a child feels by mastering a new technique or graduating to a new belt follows him everywhere he goes!',
    image: 'assets/images/little-tigers-class.jpg'
  },
  {
    id: 'children',
    title: "Children's Class",
    ageGroup: '(6-12 yr olds)',
    description: 'Working through a martial art and the belt ranking system gives kids measurable goals to follow that are realistic to attain. The sense of accomplishment a child feels by mastering a new technique or graduating to a new belt follows him everywhere he goes!',
    image: 'assets/images/children-class.jpg'
  },
  {
    id: 'family',
    title: 'Family Class',
    ageGroup: '(Kids & Adult)',
    description: "At Tiger Lee's , we teach families, as well as individuals. The change in a family's demeanor after a few months is amazing. It becomes a source of fitness and team building with a bit of friendly competition, too. Many families will find that they have something in common and will share their time on an off the mat.",
    image: 'assets/images/family-class-large.jpg'
  },
  {
    id: 'adult',
    title: 'Adult Class',
    ageGroup: '(13 yr olds and up)',
    description: 'Do you need more energy, a boost in self-confidence and a great way to reduce stress? Then Tae Kwon Do may be the perfect fitness program for you!',
    image: 'assets/images/adult-classes.jpg'
  }
];

const Programs: React.FC = () => {
  return (
    <section id="programs" className="pt-10 pb-20 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 uppercase tracking-tight mb-4">Our Programs</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programsData.map((program, index) => (
            <motion.div
              key={program.id}
              initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : index * 0.1 }}
              className="group relative h-[680px] overflow-hidden rounded-2xl bg-gray-900 shadow-xl md:hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110 opacity-50 md:group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center text-center pt-10 px-8 pb-12">

                {/* Title Section */}
                <div className="mt-2 mb-4">
                  <h3 className="font-heading text-4xl font-bold text-white mb-3 tracking-wide leading-tight mx-auto">{program.title}</h3>
                  <div className="inline-block bg-black/40 backdrop-blur-sm border border-white/5 px-4 py-1.5 rounded-full mb-2">
                    <span className="text-brand-red font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                      {program.ageGroup}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-grow flex items-center justify-center">
                  <p
                    className="text-gray-100 text-base md:text-lg font-light opacity-90 drop-shadow-md"
                    style={{ lineHeight: '2.3rem' }}
                  >
                    {program.description}
                  </p>
                </div>

                {/* Button inside card */}
                <div className="mt-auto w-full">
                  <Link
                    to={`/programs#${program.id}`}
                    className="group/btn flex items-center justify-center space-x-3 bg-brand-red text-white py-4 px-8 rounded-full font-bold text-sm tracking-[0.2em] transition-all duration-300 hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-950/20"
                  >
                    <span>GET STARTED</span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/30 group-hover/btn:border-white transition-colors">
                      <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Programs Button - Updated Style */}
        <div className="flex justify-center mt-12">
          <Link
            to="/programs"
            className="inline-block bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/20"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;