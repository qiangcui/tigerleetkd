import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ProgramSection: React.FC<{
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  image: string;
  isReversed?: boolean;
  titleClass?: string;
  cleanImage?: boolean;
  fullBleed?: boolean;
}> = ({ id, title, subtitle, content, image, isReversed = false, titleClass = "text-brand-red", cleanImage = false, fullBleed = false }) => {

  // Full Bleed Layout (Image takes 50% width, full height, no padding)
  if (fullBleed) {
    return (
      <div id={id} className={`relative overflow-hidden ${isReversed ? 'bg-gray-50' : 'bg-white'}`}>
        {/* Desktop Full Height Image (Absolute Positioned) */}
        <div className={`hidden lg:block absolute inset-y-0 ${isReversed ? 'left-0' : 'right-0'} w-1/2`}>
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-4">
          <div className={`relative z-10 flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>

            {/* Content Side */}
            <motion.div
              className={`lg:w-1/2 py-20 ${isReversed ? 'lg:pl-16' : 'lg:pr-16'}`}
              initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`font-heading text-4xl md:text-5xl font-bold mb-4 ${titleClass}`}>{title}</h2>
              {subtitle && (
                <h4 className="font-heading text-xl md:text-2xl font-bold text-brand-dark mb-6">{subtitle}</h4>
              )}
              <div className="prose prose-lg text-gray-600 mb-8">
                {content}
              </div>
              <Link
                to="/get-started"
                className="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                SIGN UP
              </Link>
            </motion.div>

            {/* Mobile/Tablet Image (Visible only below lg) */}
            <motion.div
              className="lg:hidden w-full mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={image} alt={title} className="w-full h-auto object-cover shadow-lg" />
            </motion.div>

            {/* Invisible Spacer for Desktop layout to maintain grid structure and height */}
            <div className="hidden lg:block lg:w-1/2 min-h-[800px]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Layout
  return (
    <div id={id} className={`py-20 ${isReversed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>

          {/* Content Side */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`font-heading text-4xl md:text-5xl font-bold mb-4 ${titleClass}`}>{title}</h2>
            {subtitle && (
              <h4 className="font-heading text-xl md:text-2xl font-bold text-brand-dark mb-6">{subtitle}</h4>
            )}
            <div className="prose prose-lg text-gray-600 mb-8">
              {content}
            </div>
            <Link
              to="/get-started"
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              SIGN UP
            </Link>
          </motion.div>

          {/* Image Side */}
          <motion.div
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {cleanImage ? (
              /* Clean Image Style (No shadow/radius/zoom) */
              <div className="relative w-full">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              /* Standard Modern Style */
              <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

const ProgramsPage: React.FC = () => {
  return (
    <div className="pt-0 bg-white">
      {/* Page Header */}
      <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('assets/images/exterior-tigerlee.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 container mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Our Programs
            </h1>
            <div className="w-24 h-1 bg-brand-red rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Little Tigers */}
      <ProgramSection
        id="little-tigers"
        title="Little Tigers"
        titleClass="text-[#3452ff]"
        fullBleed={true}
        image="assets/images/little-tigers.jpg"
        content={
          <>
            <p className="mb-4">
              This year, why not give your little one the opportunity to learn something fun and challenging? Our Little Tiger classes are specially designed to provide four to five-year-olds the perfect mix of fun, martial arts, confidence building, and skill development.
            </p>
            <p className="mb-4">
              This program is aimed at introducing preschoolers and kindergarteners to Tae Kwon Do.
            </p>
            <p className="mb-6">
              During a 30-minute class, preschoolers and kindergarteners gain motor skill development and a sense of confidence within our playful and positive environment. Between the fun and exercise, your child will also gain greater focus, which will carry over to home and school.
            </p>
            <h4 className="font-bold text-gray-900 mb-3">Many benefits of this program include:</h4>
            <ul className="space-y-2">
              {[
                'Focus and self-control',
                'Willingness to work toward a goal',
                'A structured learning environment',
                'The desire to lead through example',
                'A great outlet to burn excess energy',
                'Patient and enthusiastic instructors'
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-black">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        }
      />

      {/* Children's Classes */}
      <ProgramSection
        id="children"
        title="Children's Classes"
        subtitle="Give your child the opportunity to learn something fun and challenging!"
        image="assets/images/children.jpg"
        isReversed={true}
        fullBleed={true}
        content={
          <>
            <p className="mb-6">
              Our children's program is focused on the core of martial arts – creating a foundation of discipline, focus, and energy that will build success for life. Students with a base in these martial arts principles will fare better socially and developmentally both at school and at home. And most importantly, they'll learn this valuable set of skills while having fun and staying active.
            </p>
            <h4 className="font-bold text-gray-900 mb-3">We Offer Multiple Children's Classes based on the Child's Age:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                <span>Little Tigers <strong className="text-brand-dark">(age 3-5)</strong></span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                <span>Children <strong className="text-brand-dark">(age 6-13)</strong></span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-brand-red rounded-full mr-3"></div>
                <span>Family <strong className="text-brand-dark">(All Ages)</strong></span>
              </li>
            </ul>
          </>
        }
      />

      {/* Family Classes */}
      <ProgramSection
        id="family"
        title="Family Classes"
        subtitle="A family that kicks together sticks together!"
        image="assets/images/family.jpg"
        fullBleed={true}
        content={
          <>
            <p className="mb-4">
              Have fun with the entire family in one convenient location! Our 50-minute Family Classes provide the perfect opportunity to get fit, share goals, meet other fun-loving people and most importantly, spend time together. Our flexible classes will also allow you to train based on your family's schedule.
            </p>
            <p className="mb-6">
              Tiger World Class Tae Kwon Do offers special opportunities designed to enhance your martial arts experience and strengthen friendships with other families. These events include:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Tournaments',
                'Belt Testing',
                'Walking in Holiday Parades',
                'Fund Raisers for local charities',
                'Summer Camps',
                'Halloween Party',
                'Parents Night Out'
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle size={18} className="text-brand-red mr-2 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        }
      />

      {/* Adult Classes */}
      <ProgramSection
        id="adult"
        title="Adult Classes"
        subtitle="Tae Kwon Do offers many benefits for adults!"
        image="assets/images/adults.jpg"
        isReversed={true}
        fullBleed={true}
        content={
          <>
            <p className="mb-6">
              The health benefits of regular Tae Kwon Do practice are huge. Our classes combine the best of several forms of physical training. Stretching and calisthenics improve flexibility and balance. Kicking drills and partner work increase endurance and timing and different forms and curriculum requirements will improve strength and muscle tone.
            </p>
            <p>
              Most adults also experience weight loss, more confidence and a great way to release stress. And, since no two classes are the same, you will experience a varied, high-energy workout that will motivate you to attend lessons regularly.
            </p>
          </>
        }
      />

      {/* CTA Section */}
      <div className="bg-brand-dark py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rotate-45"></div>
        <div className="container mx-auto px-4 relative z-10">
          <span className="block text-xl md:text-2xl font-heading font-bold text-white uppercase tracking-widest mb-8">
            Ready to join us?
          </span>
          <Link
            to="/get-started"
            className="inline-block bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/20"
          >
            Get Started Today
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProgramsPage;