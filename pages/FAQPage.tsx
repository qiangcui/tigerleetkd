import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What is Tae Kwon Do and how is it different from other martial arts?",
    answer: "The martial arts were developed thousands of years ago as forms of self-defense. Tae Kwon Do is the martial art developed in Korea. In terms of techniques, Tae Kwon Do emphasizes kicks more than other martial arts, making it ideal for improving balance, flexibility, and endurance."
  },
  {
    question: "At what age can kids start?",
    answer: "Our experience has shown that most children ages four and up are able to participate in Tae Kwon Do classes. At this age your child can take our trial lesson program, which allows our instructors to work with them one-on-one and evaluate their readiness for group classes."
  },
  {
    question: "Do martial arts increase aggressiveness?",
    answer: "Our instructors continually educate that martial arts are a form of exercise and self improvement, not a tool for bullying. Tae Kwon Do students are taught to be humble, courteous, and respectful along with being careful about when and where they practice their self-defense skills."
  },
  {
    question: "How safe is it to learn martial arts?",
    answer: "Tae Kwon Do is safe and fun for students of all ages and physical abilities. Classes are taught by expert instructors as students are shown techniques in a step-by-step manner at their own pace. A thorough stretching routine, matted flooring, and protective safety equipment are all part of our commitment to ensuring student safety."
  },
  {
    question: "What if I never did martial arts before or if I'm out of shape?",
    answer: "Beginners are always welcome. Our beginner's martial arts program makes it easy to get started. New students receive one-on-one instruction designed to provide an introduction to the basics of Tae Kwon Do. Plus, our belt system allows all students to train at their own pace and improve their physical condition gradually."
  }
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-0 bg-white">
      {/* Page Header */}
      <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('assets/images/FAQ.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 container mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <div className="w-24 h-1 bg-brand-red rounded-full"></div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left focus:outline-none"
              >
                <span className="font-bold text-lg text-gray-900 flex items-center gap-3">
                  {openIndex === index ? <Minus size={20} className="text-brand-red shrink-0" /> : <Plus size={20} className="text-gray-400 shrink-0" />}
                  {faq.question}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Have other questions? Ask us here!</h3>
          <Link
            to="/#contact"
            className="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg"
            onClick={() => {
              setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-dark py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rotate-45"></div>
        <div className="container mx-auto px-4 relative z-10">
          <span className="block text-xl md:text-2xl font-heading font-bold text-white uppercase tracking-widest mb-8">
            Schedule a trial lesson. It'll only take a minute.
          </span>
          <Link
            to="/get-started"
            className="inline-block bg-brand-red text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;