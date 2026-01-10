import React from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [timeLeft, setTimeLeft] = React.useState(3);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setStatus('sending');

    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-6Kx4pOiubQymxMhnaAE9wuWW0ifAB665azIrVPbhhal0oOdPvavDpbt3xLGL68rl/exec";

    if (SCRIPT_URL.includes("YOUR_SCRIPT_ID_HERE")) {
      alert("Please configure the Google Apps Script URL in the code (components/Contact.tsx).");
      setStatus('error');
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({ ...formData } as any),
        mode: 'no-cors'
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Info Side */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h2 className="font-heading text-4xl font-bold mb-6 text-gray-900">Contact Us</h2>
              <p className="text-gray-600 text-lg">We are here to answer any questions you may have about our programs. Reach out to us and we'll respond as soon as we can.</p>
            </div>

            {/* Google Map - Expanded */}
            <div className="w-full flex-grow bg-gray-100 rounded-lg overflow-hidden relative min-h-[400px] shadow-sm border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                title="Tiger Lee's World Class Tae Kwon Do Location"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Tiger%20Lee's%20World%20Class%20Tae%20Kwon%20Do%20Parker%20CO&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-xl p-8 text-gray-800 shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Send a Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                    placeholder="Your Email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                  placeholder="Tell us more..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                  <p className="font-bold">Message Sent Successfully!</p>
                  <p className="text-sm">Closing in {timeLeft}s...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                  <p className="font-bold">Error Sending Message</p>
                  <p className="text-sm">Please try again or call us.</p>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;