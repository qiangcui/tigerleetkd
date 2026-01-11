import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight, Instagram, Facebook } from 'lucide-react';

const SuccessPage: React.FC = () => {
    useEffect(() => {
        // Broaden the signal so it reaches the parent regardless of slight origin differences
        if (window.opener) {
            console.log('Sending success signal to parent...');
            window.opener.postMessage('PAYMENT_SUCCESS', '*');

            // Try to close immediately, but keep a delay for visual confirmation
            const closeTimer = setTimeout(() => {
                window.close();
            }, 1000);
            return () => clearTimeout(closeTimer);
        }
    }, []);
    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Top Accent Bar */}
                    <div className="h-3 bg-brand-red w-full"></div>

                    <div className="p-8 md:p-12 text-center">
                        <div className="flex justify-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600"
                            >
                                <CheckCircle size={56} strokeWidth={2.5} />
                            </motion.div>
                        </div>

                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Booking Confirmed!
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Thank you for choosing <span className="font-bold text-brand-dark">Tiger Lee's World Class Tae Kwon Do</span>.
                            We have received your appointment and will send a confirmation email shortly.
                        </p>

                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-12 text-left border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Calendar className="mr-3 text-brand-red" size={24} />
                                What's Next?
                            </h3>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-brand-red text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 mr-3">1</div>
                                    <p>Check your inbox for a summary of your booking.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-brand-red text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 mr-3">2</div>
                                    <p>If you chose <span className="font-bold text-brand-dark">Pay Now</span>, please ensure you completed the PayPal transaction.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-brand-red text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1 mr-3">3</div>
                                    <p>Arrive 10 minutes early for your trial lesson to get fitted for your uniform.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/"
                                className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 flex items-center justify-center"
                            >
                                Back to Home
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </div>

                        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-sm">Follow our journey</p>
                            <div className="flex justify-center space-x-6">
                                <a href="https://www.instagram.com/tigerleetkd/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-red transition-colors">
                                    <Instagram size={28} />
                                </a>
                                <a href="https://www.facebook.com/TigerLeesTKD/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <Facebook size={28} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center mt-8 text-gray-400 text-sm">
                    Questions? Call us at <a href="tel:7036423000" className="font-bold hover:text-brand-red transition-colors">(703) 642-3000</a>
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;
