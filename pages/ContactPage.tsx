import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-6Kx4pOiubQymxMhnaAE9wuWW0ifAB665azIrVPbhhal0oOdPvavDpbt3xLGL68rl/exec";

    if (SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
      alert("Please configure the Google Apps Script URL in the code (ContactPage.tsx).");
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          ...formData
        } as any),
        mode: 'no-cors' // Important for Google Apps Script
      });

      // With no-cors, we can't check response.ok, so we assume success if no error is thrown
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

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
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-brand-red rounded-full"></div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Contact Info - Left Column */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-8">Say Hello!</h1>
            <div className="w-8 h-1 bg-gray-200 mb-8"></div>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start">
                <div className="w-10 flex-shrink-0 pt-1">
                  <MapPin className="text-brand-red" size={20} />
                </div>
                <div className="text-gray-600 leading-relaxed">
                  <strong className="block text-gray-900 mb-1">Tiger Lee's World Class Tae Kwon Do</strong>
                  11153 S Parker Rd<br />
                  Units M & N<br />
                  Parker, CO 80134
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start">
                <div className="w-10 flex-shrink-0 pt-1">
                  <Clock className="text-brand-red" size={20} />
                </div>
                <div className="text-gray-600 leading-relaxed">
                  <strong className="block text-gray-900 mb-1">Time</strong>
                  <span className="block"><strong className="text-gray-800">M-F:</strong> 11 AM – 8:30 PM</span>
                  <span className="block"><strong className="text-gray-800">Sat:</strong> 9:30 AM – Noon</span>
                  <span className="block"><strong className="text-gray-800">Sun:</strong> Closed</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="w-10 flex-shrink-0 pt-1">
                  <Phone className="text-brand-red" size={20} />
                </div>
                <div className="text-gray-600 leading-relaxed">
                  <strong className="block text-gray-900 mb-1">Phone:</strong>
                  (720) 476-9610
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-10 flex-shrink-0 pt-1">
                  <Mail className="text-brand-red" size={20} />
                </div>
                <div className="text-gray-600 leading-relaxed">
                  <strong className="block text-gray-900 mb-1">Email:</strong>
                  tigerleeworldclass@gmail.com
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Right Column */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-normal text-gray-600 mb-2">Your Name (required)</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50/50 rounded focus:border-gray-400 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-base font-normal text-gray-600 mb-2">Your Email (required)</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50/50 rounded focus:border-gray-400 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-base font-normal text-gray-600 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50/50 rounded focus:border-gray-400 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-base font-normal text-gray-600 mb-2">Your Message</label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50/50 rounded focus:border-gray-400 outline-none transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="inline-block bg-brand-dark text-white font-medium px-6 py-2 rounded hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <p className="font-bold">Message Sent!</p>
                  <p className="text-sm">Values received. Closing in {timeLeft}s...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-bold">Error Sending Message</p>
                  <p className="text-sm">Something went wrong. Please try again later or call us directly.</p>
                </div>
              )}
            </form>
          </motion.div>

        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[500px] bg-gray-200 relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          title="Tiger Lee's World Class Tae Kwon Do Location"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://maps.google.com/maps?q=Tiger%20Lee's%20World%20Class%20Tae%20Kwon%20Do%20Parker%20CO&t=&z=13&ie=UTF8&iwloc=&output=embed"
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
      </div>

      {/* Footer CTA */}
      <div className="bg-brand-dark py-12 text-center relative overflow-hidden border-t border-gray-800">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-brand-dark rotate-45 border-b border-r border-gray-800"></div>
        <div className="container mx-auto px-4">
          <span className="inline-block text-white font-bold tracking-widest uppercase mb-6 md:mb-0 md:mr-8 align-middle text-sm md:text-base">
            Schedule a trial lesson. It'll only take a minute.
          </span>
          <Link
            to="/get-started"
            className="inline-block bg-brand-red text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-red-700 transition-all shadow-lg align-middle"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;