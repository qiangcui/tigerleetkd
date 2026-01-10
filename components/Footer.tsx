import React from 'react';
import { Facebook, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">

          {/* Column 1: Our Mission */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase mb-6 text-white border-l-4 border-brand-red pl-3">
              Our Mission
            </h4>
            <ul className="space-y-3 text-gray-400 text-[15px] italic leading-relaxed list-disc pl-4 marker:text-brand-red">
              <li>To consistently provide the highest quality in martial arts instruction</li>
              <li>To help each and every student reach their maximum potential in all areas of their training</li>
              <li>To bring a positive impact to students’ lives through Tae Kwon Do</li>
            </ul>
          </div>

          {/* Column 2: Quick Links & Connect */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase mb-6 text-white border-l-4 border-brand-red pl-3">
              Quick Links
            </h4>
            <ul className="space-y-3 text-[15px] text-gray-400 mb-8">
              <li><Link to="/" className="hover:text-brand-red transition-colors flex items-center"><span className="mr-2">›</span>Home</Link></li>
              <li><Link to="/programs" className="hover:text-brand-red transition-colors flex items-center"><span className="mr-2">›</span>Programs</Link></li>
              <li><Link to="/schedule" className="hover:text-brand-red transition-colors flex items-center"><span className="mr-2">›</span>Class Schedule</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors flex items-center"><span className="mr-2">›</span>Contact</Link></li>
            </ul>

            <div className="flex space-x-4">
              <a href="https://www.facebook.com/WorldClassTigerLee/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-colors text-white">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/user/TigerLeeTaeKwonDo" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-colors text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 3: Our Location */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase mb-6 text-white border-l-4 border-brand-red pl-3">
              Our Location
            </h4>
            <div className="text-gray-400 text-[15px] leading-loose mb-6">
              <p className="font-bold text-white">Tiger Lee’s World Class Tae Kwon Do</p>
              <p>11153 S Parker Rd</p>
              <p>Units M & N</p>
              <p>Parker, CO 80134</p>
              <p className="text-white mt-2">(720) 476-9610</p>
              <p className="text-white mt-2">tigerleeworldclass@gmail.com</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-[13px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tiger Lee's World Class Tae Kwon Do. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;