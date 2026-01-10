import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Diana Choi',
    role: 'Parent',
    content: "Our twin boys joined the Little Tigers program and have fallen in love with TKD. The masters teach authentic moves and instill discipline through three major focuses - eye, mind and body - while still creating a fun atmosphere.",
  },
  {
    id: 2,
    name: 'Nick Dalesio',
    role: 'Parent',
    content: "The Masters keep the children entertained while teaching discipline and focus. My son can't stop talking about going to class. Because of his excitement, I joined myself and it's been a great father-son bonding experience.",
  },
  {
    id: 3,
    name: 'Bill Sparks',
    role: 'Member/Parent',
    content: "A school that you can entrust your children with to learn and to progress with safety in mind. A school that will teach your family skills that will enhance your life.",
  }
];

const Testimonials: React.FC = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${base}/assets/images/homepage.png')` }}
      ></div>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-white">What They Say</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 relative hover:shadow-2xl transition-all hover:-translate-y-2">
              <Quote className="text-brand-red/10 absolute top-4 right-4 w-16 h-16" />
              <div className="flex space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={18} />)}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed relative z-10">"{t.content}"</p>
              <div className="border-t pt-4 border-gray-100">
                <h4 className="font-bold text-gray-900 font-heading text-lg">{t.name}</h4>
                <span className="text-sm text-brand-red font-medium uppercase tracking-wide">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;