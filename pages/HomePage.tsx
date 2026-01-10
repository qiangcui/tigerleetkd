import React from 'react';
import Hero from '../components/Hero';
import Programs from '../components/Programs';
import MissionStats from '../components/MissionStats';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <>
      <Hero />

      {/* Award Section */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <img
            src={`${base}/assets/images/KakaoTalk_Photo_2021-01-25-23-30-32.jpeg`}
            alt="Best of 2020"
            className="w-full max-w-lg mx-auto mb-8 rounded-lg shadow-xl"
          />
          <p className="text-gray-900 font-bold text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed italic">
            Tiger Lee’s World Class Tae Kwon Do has been recognized as the Best of 2020 in martial arts instruction.
          </p>
        </div>
      </section>

      <Programs />
      <MissionStats />
      <Testimonials />
      <Contact />
    </>
  );
};

export default HomePage;