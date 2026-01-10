import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Play, Video, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccordionItem {
  id: string;
  title: string;
  type: 'text-image' | 'video-feature' | 'grid-video' | 'audio';
  content: React.ReactNode;
}

const EducationPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('intro');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections: AccordionItem[] = [
    {
      id: 'intro',
      title: 'What is Tae Kwon Do?',
      type: 'video-feature',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="prose prose-lg text-gray-600">
            <p>
              Tae Kwon Do (also known as Taekwondo) is the martial art of self-defense that came from Korea. It is one of the oldest martial arts in the world (over 2,000 years old).
            </p>
            <p>
              The meaning of the name Tae Kwon Do is an appropriate description of the key elements of this martial art: Tae (foot), Kwon (hand), Do (art).
            </p>
            <h4 className="font-bold text-gray-900 mt-4 mb-2">Tae Kwon Do in the USA</h4>
            <p>
              In the 1950s a group of Korean master instructors travelled to America to spread the art. In the following decades Tae Kwon Do grew in popularity both as a martial art and as an international sport.
            </p>
            <p>
              In 1973 Korea hosted the first Tae Kwon Do World Championships and the World Tae Kwon Do Federation was established as the international governing body. Today the WTF has 120 separate countries as its members, which includes over 20 million practitioners.
            </p>
            <p>
              Tae Kwon Do was introduced as an Olympic demonstration sport in the 1988 Seoul Olympic Games. It later became a full medal sport at the 2000 Sydney Olympics.
            </p>
          </div>
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/yzcsm8MePTU?rel=0"
                title="What is Tae Kwon Do?"
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <img
              src={`${base}/assets/images/tenets1.png`}
              alt="Tenets of Tae Kwon Do"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )
    },
    {
      id: 'fitness',
      title: 'Physical Fitness',
      type: 'text-image',
      content: (
        <div className="space-y-6">
          <div className="float-right ml-6 mb-4 w-1/3">
            <img
              src={`${base}/assets/images/fitness-249x300.png`}
              alt="Physical Fitness"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-lg text-gray-600">
            <p>
              When most people think about Tae Kwon Do or other martial art disciplines, they typically focus on the self-defense and mental health benefits. However, you do not want to overlook the physical health benefits. Tae Kwon Do offers students of all ages a broad range of health benefits and can contribute to a better overall lifestyle.
            </p>
            <p><strong>Cardio and circulation</strong><br />Tae Kwon Do requires you to engage all of your muscle groups, so it offers a good cardio workout. It gets your heart pumping and improves circulation throughout the body.</p>
            <p><strong>Fat loss</strong><br />As your heart rate increases, your blood circulation improves, and various muscle groups get activated. Your body is forced to burn calories. Steady and regular workouts can ultimately result in substantial, healthy weight loss.</p>
            <p><strong>Muscle toning</strong><br />One of the physical benefits of Tae Kwon Do training is that it strengthens our muscles, bones, joints, tendons, and ligaments.</p>
            <p><strong>Increased flexibility</strong><br />At the beginning of each Tae Kwon Do training session, most instructors spend a few minutes stretching. Over time, this will increase your flexibility.</p>
            <p><strong>Improved stamina</strong><br />As your muscles become stronger and your heart more active, your overall stamina level will increase.</p>
            <p><strong>Stress relief</strong><br />Similar to many other physical activities and exercises, Tae Kwon Do helps relieve stress and diminishes the intensity of physical ailments.</p>
          </div>
          <div className="clear-both"></div>
        </div>
      )
    },
    {
      id: 'focus',
      title: 'Help Improve Focus',
      type: 'text-image',
      content: (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={`${base}/assets/images/focus-161x300.png`}
              alt="Improved Focus"
              className="w-full h-auto rounded-lg shadow-md max-w-[200px] mx-auto md:mx-0"
            />
          </div>
          <div className="md:w-2/3 prose prose-lg text-gray-600">
            <p><strong>Better focus for children through martial arts</strong></p>
            <p>If you are looking to improve your child's focus and increase their concentration skills, you should consider getting your child involved in martial arts classes.</p>
            <p><strong>The Importance of Exercise</strong></p>
            <p>Recent studies are proving that exercise has a wide range of brain-related benefits, including improving attention and reducing stress and anxiety. For children, exercise causes them to be less impulsive, which makes them more ready to learn.</p>
            <p>When you exercise, your brain elevates the supply of endorphins, dopamine, norepinephrine, and serotonin. These chemicals affect focus and attention.</p>
            <p><strong>Why Tae Kwon Do?</strong></p>
            <p>Activities that require you to pay close attention to body movements – such as tae kwon do – put the body's attention system to work. This can be especially beneficial for kids and adolescents with ADHD.</p>
          </div>
        </div>
      )
    },
    {
      id: 'stress',
      title: 'Help Control Stress',
      type: 'text-image',
      content: (
        <div className="space-y-6">
          <div className="float-right ml-6 mb-4 w-1/3 max-w-[250px]">
            <img
              src={`${base}/assets/images/stress.png`}
              alt="Control Stress"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-lg text-gray-600">
            <p><strong>Control stress through exercise:</strong></p>
            <p>Too much stress in your life? Exercise is a great way to manage stress so that it no longer interferes with your health and happiness. And adult martial arts classes may be the best answer to finding a form of exercise you actually want to do.</p>
            <p><strong>How Exercise Helps Reduce Stress:</strong></p>
            <p>Exercise helps both the brain and body handle stress better. Regular exercise improves mood, relieves anxiety and depression, and increases energy. Studies have found that exercise increases concentrations of norepinephrine in brain regions involved in the body's stress response.</p>
            <p><strong>Tae Kwon Do: a workout you'll enjoy</strong></p>
            <p>To make exercise a stress-reducer, you need to find a form of exercise you enjoy. At Tiger Lee's Tae Kwon Do, our belt system has goal setting built into it, and our atmosphere is friendly and encouraging.</p>
          </div>
          <div className="clear-both"></div>
        </div>
      )
    },
    {
      id: 'self-defense',
      title: 'Self Defense',
      type: 'text-image',
      content: (
        <div className="space-y-6">
          <div className="float-right ml-6 mb-4 w-1/3 max-w-[250px]">
            <img
              src={`${base}/assets/images/self-defense-282x300.png`}
              alt="Self Defense"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-lg text-gray-600">
            <p><strong>Learn Self Defense Through Martial Arts Classes</strong></p>
            <p>The first rule in self-defense is to prevent a dangerous situation from developing. However, if you cannot get away and find you need to protect yourself, knowing self-defense techniques can be invaluable.</p>
            <p><strong>Self-Defense for Men</strong></p>
            <p>Men are more likely than women to fight back 'in self-defense.' However, if all else fails you may have no choice but to defend yourself or someone you care for. Adult martial arts classes will teach you techniques, strength, speed, and balance.</p>
            <p><strong>Self-Defense for Women</strong></p>
            <p>Taking self-defense classes is a safe way to prepare yourself. Knowing that you could do something if it came down to it will give you peace of mind.</p>
            <p><strong>Why Tae Kwon Do</strong></p>
            <p>As a student you will learn a variety of strikes, blocks, take-downs, throws, and joint locks. Knowledge will give you confidence.</p>
          </div>
          <div className="clear-both"></div>
        </div>
      )
    },
    {
      id: 'bullying',
      title: 'Help Stop Bullying',
      type: 'text-image',
      content: (
        <div className="space-y-6">
          <div className="float-right ml-6 mb-4 w-1/3 max-w-[200px]">
            <img
              src={`${base}/assets/images/bully.png`}
              alt="Stop Bullying"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-lg text-gray-600">
            <p>At Tiger Lee's World Class Tae Kwon Do, kids are not taught to use violence as a solution to bullying. Tiger Lee's training is a great way to instill confidence. There is no greater deterrence to bullying than confidence.</p>
            <p><strong>Victims of bullying typically do not retaliate</strong></p>
            <p>Children targeted by bullies are usually intelligent, sensitive, and creative. Unfortunately, they are often never taught how to defend themselves.</p>
            <p><strong>Martial arts classes can help</strong></p>
            <p>Martial arts classes will teach children various techniques for blocking, breaking an attacker's grasp, and other methods to protect themselves from injury.</p>
            <p><strong>Why Tiger Lee's Tae Kwon Do?</strong></p>
            <ul className="list-disc pl-4 space-y-2">
              <li>All students are taught that martial arts are to be used only as a last resort.</li>
              <li>Our students learn a variety of blocks and take-downs applicable to threatening situations.</li>
              <li>Students are always taught in a positive manner.</li>
              <li>One of the greatest benefits is a higher level of self-confidence.</li>
            </ul>
          </div>
          <div className="clear-both"></div>
        </div>
      )
    },
    {
      id: 'comparison',
      title: 'Tae Kwon Do or Karate?',
      type: 'text-image',
      content: (
        <div className="space-y-6">
          <div className="float-right ml-6 mb-4 w-1/3 max-w-[200px]">
            <img
              src={`${base}/assets/images/tkd_vs_Karate-169x300.png`}
              alt="TKD vs Karate"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-lg text-gray-600">
            <p>Whenever someone is considering beginning martial arts classes, they often ask, "How are Tae Kwon Do and karate different?"</p>
            <p>The core principles of both stress self-discipline and a high code of personal conduct. Both have a sport competition aspect.</p>
            <p><strong>So, how are they different?</strong></p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Tae Kwon Do emphasizes kicking techniques, while Karate focuses on hand strikes.</li>
              <li>Tae Kwon Do originated in Korea, while Karate comes from Japan.</li>
              <li>Tae Kwon Do is an Olympic sport.</li>
              <li>Prearranged sequences are referred to as 'poomsae' in Tae Kwon Do, and 'kata' in Karate.</li>
            </ul>
            <p><strong>How to choose?</strong></p>
            <p>When trying to decide, consider: quality of instruction, facility, atmosphere, and class schedule. It is a good idea to visit the schools you are considering.</p>
          </div>
          <div className="clear-both"></div>
        </div>
      )
    },
    {
      id: 'korean-terms',
      title: 'Korean Terms',
      type: 'grid-video',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "White Belt Terms", vid: "fB9_6Vg5j_w" },
            { title: "Yellow Belt Terms", vid: "W4Ht0mWAfoA" },
            { title: "Green Stripe Terms", vid: "MBynLT-dY2g" },
            { title: "Green Belt Terms", vid: "rZH7zy_sZ8s" },
            { title: "Blue Stripe Terms", vid: "nLKrQ-qQ-cE" }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.vid}?rel=0`}
                  title={item.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 bg-brand-dark text-white text-center font-bold">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'basic-movement',
      title: 'Basic Movement',
      type: 'audio',
      content: (
        <div className="w-full">
          <audio controls className="w-full">
            <source src={`${base}/assets/audio/basicmovement-1.mp3`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )
    },
    {
      id: 'breathing-form',
      title: 'Breathing Form',
      type: 'audio',
      content: (
        <div className="w-full">
          <audio controls className="w-full">
            <source src={`${base}/assets/audio/breathing_form.mp3`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )
    }
  ];

  return (
    <div className="pt-0 bg-white">
      {/* Page Header */}
      <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${base}/assets/images/exterior-tigerlee.jpg)` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 container mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Education
            </h1>
            <div className="w-24 h-1 bg-brand-red rounded-full"></div>
            <p className="text-gray-300 mt-4 text-lg">
              Learn more about the art, culture, and benefits of Tae Kwon Do.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  {openSection === section.id ? <Minus size={20} className="text-brand-red shrink-0" /> : <Plus size={20} className="text-gray-400 shrink-0" />}
                  <h3 className="font-bold text-lg text-gray-900">{section.title}</h3>
                </div>
                {section.type === 'video-feature' && <Video size={20} className="text-gray-400 hidden sm:block" />}
                {section.type === 'grid-video' && <Play size={20} className="text-gray-400 hidden sm:block" />}
                {section.type === 'audio' && <Music size={20} className="text-gray-400 hidden sm:block" />}
              </button>

              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 md:p-8 border-t border-gray-100 bg-white">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-dark py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rotate-45"></div>
        <div className="container mx-auto px-4 relative z-10">
          <span className="block text-xl md:text-2xl font-heading font-bold text-white uppercase tracking-widest mb-8">
            Ready to start learning?
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

export default EducationPage;