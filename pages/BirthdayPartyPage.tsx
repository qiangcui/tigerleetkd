import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, User, Phone, Mail, Gift, Cake, ChevronRight } from 'lucide-react';

const galleryImages = [
    "assets/images/birthday3.jpg",
    "assets/images/birthday2.jpg",
    "assets/images/birthday1.jpg",
    "assets/images/birthday5.jpg"
];

const BirthdayPartyPage: React.FC = () => {
    const [formData, setFormData] = useState({
        parentName: '',
        childName: '',
        email: '',
        phone: '',
        date: ''
    });

    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [timeLeft, setTimeLeft] = useState(3);

    React.useEffect(() => {
        if (status === 'success') {
            setTimeLeft(3);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setStatus('idle');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-6Kx4pOiubQymxMhnaAE9wuWW0ifAB665azIrVPbhhal0oOdPvavDpbt3xLGL68rl/exec";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams({
                    name: formData.parentName,
                    email: formData.email,
                    subject: "Birthday Party Inquiry",
                    message: `Birthday Party Inquiry Details:
------------------------
Parent Name: ${formData.parentName}
Child Name: ${formData.childName}
Date of Interest: ${formData.date}
Phone: ${formData.phone}`
                } as any),
                mode: 'no-cors'
            });

            setStatus('success');
            setFormData({ parentName: '', childName: '', email: '', phone: '', date: '' });
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus('error');
        }
    };

    return (
        <div className="pt-0 bg-white">
            {/* Page Header */}
            <div className="relative h-[450px] w-full overflow-hidden bg-brand-dark flex items-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('assets/images/birthday-blur-cake-40183.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                            Birthday Parties
                        </h1>
                        <div className="w-24 h-1 bg-brand-red rounded-full mx-auto mb-6"></div>
                        <p className="text-2xl text-white font-light tracking-wide uppercase">
                            A special celebration with a kick!
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">

                {/* Intro Section */}
                <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">
                            <span className="text-brand-red">Fun, Safe,</span> and Memorable!
                        </h2>
                        <div className="prose prose-lg text-gray-600 mb-6">
                            <p className="mb-4">
                                At Tiger Lee's World Class Taekwondo, Birthday Parties are designed to be fun! You'll never see kids running around wild or standing around bored. A trained instructor will supervise and coordinate everything from beginning to end.
                            </p>
                            <p className="mb-4 font-medium text-brand-dark">
                                Your child's birthday party will be memorable, fun, well organized and professional.
                            </p>
                            <p>
                                Each party is filled with specially designed activities and games, making it possible for every child to have fun while learning basic Tae Kwon Do skills. Additionally, there is no prior martial arts experience required to participate... so everyone 4 & up will be able to join in.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="assets/images/birthday4.jpg"
                                alt="Board Breaking Birthday"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <p className="text-white font-bold text-xl">Make them the star of the show!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Gallery Grid */}
                <div className="mb-24">
                    <h3 className="font-heading text-3xl font-bold text-center mb-12 text-gray-900">Party Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {galleryImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-xl overflow-hidden shadow-lg h-64 group"
                            >
                                <img
                                    src={img}
                                    alt={`Birthday Party ${idx + 1}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Features & Form Split */}
                <div className="flex flex-col lg:flex-row gap-12 bg-gray-50 rounded-3xl overflow-hidden shadow-xl">

                    {/* Left: Features */}
                    <div className="lg:w-1/2 p-10 lg:p-16 bg-brand-dark text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex items-center mb-8">
                                <Cake size={40} className="text-brand-red mr-4" />
                                <h2 className="font-heading text-3xl font-bold">All Inclusive Package</h2>
                            </div>

                            <ul className="space-y-6">
                                {[
                                    '1.5 hours of supervised fun and excitement',
                                    'Your child will cut the cake with a real sword',
                                    'Unlimited friends and family',
                                    'Cake, decorations, and invitations provided',
                                    'Non-stop games, activities and exciting Tae Kwon Do!',
                                    'Gift certificates for 2 free weeks for every guest',
                                    'We handle ALL the set-up and ALL THE CLEAN UP!'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="bg-brand-red/20 p-1 rounded-full mr-4 mt-1">
                                            <CheckCircle size={18} className="text-brand-red" />
                                        </div>
                                        <span className="text-lg text-gray-200">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                                <div className="flex items-center">
                                    <Gift className="text-yellow-400 mr-4" size={32} />
                                    <p className="font-bold italic">"This birthday, don't worry about a thing! We've got it covered."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:w-1/2 p-10 lg:p-16">
                        <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">Book A Party</h2>
                        <p className="text-gray-500 mb-8">Fill out the form below to check availability and reserve your date.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Your Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="parentName"
                                            required
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                            placeholder="Parent Name"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Child's Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="childName"
                                            required
                                            value={formData.childName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                            placeholder="Birthday Child"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                            placeholder="(555) 555-5555"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-sm font-bold text-gray-700 mb-1 block">Preferred Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className="w-full bg-brand-red text-white font-bold text-lg py-3 rounded-lg shadow-lg hover:bg-red-700 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{status === 'sending' ? 'Sending...' : 'Send Request'}</span>
                                {status !== 'sending' && <ChevronRight size={20} />}
                            </button>

                            {status === 'success' && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                                    <p className="font-bold">Request Sent!</p>
                                    <p className="text-sm">Closing in {timeLeft}s...</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                                    <p className="font-bold">Error Sending Request</p>
                                    <p className="text-sm">Please try again or call us.</p>
                                </div>
                            )}
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default BirthdayPartyPage;