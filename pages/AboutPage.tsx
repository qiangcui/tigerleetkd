import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    const affiliations = [
        { name: 'Kukkiwon', src: '/assets/images/kukkiwon-copy.jpg' },
        { name: 'Yong-In University', src: '/assets/images/yongin.jpg' },
        { name: 'KTA', src: '/assets/images/KTA_Redlogo7.png' },
        { name: 'WTF', src: '/assets/images/WTF_Logo.png' },
    ];

    return (
        <div className="pt-0 bg-white">
            {/* Page Header */}
            <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
                {/* Reuse exterior image for consistency */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/images/exterior-tigerlee.jpg')" }}
                ></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                            About Us
                        </h1>
                        <div className="w-24 h-1 bg-brand-red rounded-full"></div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">

                {/* Master Lee Section */}
                <div className="flex flex-col lg:flex-row gap-16 items-center mb-8">
                    <motion.div
                        className="lg:w-1/2 flex justify-center w-full"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="/assets/images/Master_Lee_Profile.png"
                            alt="Master Seungbeom Lee"
                            className="w-full h-auto max-w-[240px] md:max-w-[360px] mx-auto"
                        />
                    </motion.div>

                    <motion.div
                        className="lg:w-1/2 text-center lg:text-left"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-4xl font-bold text-gray-900 mb-2">Master Seungbeom Lee</h2>
                        <h3 className="text-xl text-brand-red font-bold uppercase tracking-wide mb-6">Head Instructor</h3>

                        <div className="prose prose-lg text-gray-600 space-y-4">
                            <p>
                                Born in Seoul, South Korea, Master Seungbeom Lee has studied Tae Kwon Do for more than 20 years and has over 15 years of instruction and coaching experience.
                            </p>
                            <p>
                                Master Lee served his mandatory military service in the Navy, where he was the Head Tae Kwon Do instructor at the Korean Naval Academy for three years.
                            </p>
                            <p>
                                Following his naval service, he graduated with honors with a Bachelor of Arts degree in Tae Kwon Do from the elite Yong-In University, where the majority of Korea’s Olympic and world medalists in Tae Kwon Do graduate. Only five members of his 400-member graduating class were awarded honors.
                            </p>
                            <p>
                                Adding to his international experience, Master Lee was also selected to be a member of an exclusive Tae Kwon Do mission trip that traveled and performed throughout Japan.
                            </p>
                            <p>
                                In 2006, Master Lee left South Korea, where he trained and instructed in the United States with Master Woo Sup Kim, a three-time Korean National Champion and the captain of the 2012 United States Olympic Tae Kwon Do team. Master Lee helped his students develop their skills, which enabled them to compete in tournaments, both at the national and international level. In 2012, he was selected to be the Head Master at Tiger Kim’s flagship school in Clemmons, NC, which, under his leadership, has grown to be Tiger Kim’s largest training center. He was also the head master at the Tiger Kim’s location in Tega Cay, South Carolina, where he was responsible for growing a new school.
                            </p>
                            <p>
                                Master Lee currently holds a 7th Degree Black Belt from the World Tae Kwon Do Federation (WTF) and has a First degree black belt in Judo. He is a Kukkiwon Certified Tae Kwon Do Master Instructor and a certified Tae Kwon Do Referee. Master Lee is a standing member of the Korea Tae Kwon Do Association (KTA), is certified in First Aid and CPR and is also a certified chiropractor who loves to snowboard.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Affiliations 1 */}
                <div className="mb-12 bg-white pb-6 px-4 md:px-12">
                    <h3 className="font-heading text-2xl font-bold text-center mb-6 text-gray-800 uppercase tracking-wider">Affiliations</h3>
                    <div className="flex flex-wrap justify-center gap-12 items-center">
                        {affiliations.map((logo, idx) => (
                            <img
                                key={idx}
                                src={logo.src}
                                alt={logo.name}
                                className="h-24 w-auto object-contain hover:scale-110 transition-transform duration-300"
                            />
                        ))}
                    </div>
                </div>

                {/* Heejeong Lee Section */}
                <div className="flex flex-col lg:flex-row gap-16 items-center mb-8">
                    <motion.div
                        className="lg:w-1/2 order-2 lg:order-1 text-center lg:text-left"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">Heejeong Lee</h2>
                        <div className="prose prose-lg text-gray-600 space-y-4">
                            <p>
                                Heejeong Lee was born in Seoul, South Korea, where she began her Tae kwon Do training and received her black belt.
                            </p>
                            <p>
                                She came to the United States to attend The University of North Carolina at Greensboro School of Music. While a student at UNCG, she was selected to be a member of the UNCG Orchestra and also performed with the Wind Ensemble. Mrs. Lee was also selected to tour Washington D.C. as part of a series of concerts with the Ensemble.
                            </p>
                            <blockquote className="border-l-4 border-brand-red pl-4 italic text-gray-800 bg-gray-50 py-2 pr-2 my-4 text-left">
                                The Wind Ensemble’s album, “Fireworks” would later go on to become a Grammy Entry List in the Best Classical Album and Best Orchestral Performance categories.
                            </blockquote>
                            <p>
                                Shortly before her return to Korea, Heejeong met Master Lee, who was training with three-time national Korean champion, Master Woo Sup Kim, in nearby Winston-Salem.
                            </p>
                            <p>
                                Heejeong did not return to Korea and instead resumed her Tae Kwon Do training and retested for her black belt. She also married Master Lee.
                            </p>
                            <p className="font-medium text-brand-dark">
                                Mrs. Lee was a gold medalist at 5th annual Yong In Presidential Cup Tae Kwon Do tournament.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end w-full"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="/assets/images/Lee_Family.png"
                            alt="Lee Family"
                            className="w-full h-auto max-w-[240px] md:max-w-[360px] mx-auto lg:mx-0"
                        />
                    </motion.div>
                </div>

                {/* Affiliations 2 */}
                <div className="bg-white pb-6 px-4 md:px-12">
                    <h3 className="font-heading text-2xl font-bold text-center mb-6 text-gray-800 uppercase tracking-wider">Affiliations</h3>
                    <div className="flex flex-wrap justify-center gap-12 items-center">
                        {affiliations.map((logo, idx) => (
                            <img
                                key={idx}
                                src={logo.src}
                                alt={logo.name}
                                className="h-24 w-auto object-contain hover:scale-110 transition-transform duration-300"
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* CTA Section */}
            <div className="bg-brand-dark py-16 text-center relative overflow-hidden">
                {/* Decorative Triangle */}
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

export default AboutPage;