import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Youtube, Lock, ChevronDown, ArrowRight, Cake } from 'lucide-react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import AdminModal from './AdminModal';
import { AnimatePresence, motion } from 'framer-motion';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Programs', href: '/programs' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Education', href: '/education' },
  { label: 'Contact', href: '/contact' },
  // Admin is handled specially
];

const programLinks = [
  {
    label: 'Little Tigers',
    href: '/programs#little-tigers',
    image: '/assets/images/little-tigers.jpg',
    age: 'Ages 4-5'
  },
  {
    label: "Children's Class",
    href: '/programs#children',
    image: '/assets/images/children.jpg',
    age: 'Ages 6-12'
  },
  {
    label: 'Family Class',
    href: '/programs#family',
    image: '/assets/images/family.jpg',
    age: 'All Ages'
  },
  {
    label: 'Adult Class',
    href: '/programs#adult',
    image: '/assets/images/adults.jpg',
    age: 'Ages 13+'
  },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setActiveDropdown(null);

    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (location.pathname === '/' && element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.includes('#')) {
      // Handle hash links on other pages (e.g. /programs#children)
      // The App.tsx ScrollToTop component handles the actual scrolling after navigation
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
          }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo Area */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/assets/images/tiger-lees-logo.png"
                alt="Tiger Lee's Logo"
                className="h-16 sm:h-20 md:h-28 w-auto transition-all duration-300 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group h-full flex items-center"
                onMouseEnter={() => item.label === 'Programs' && setActiveDropdown('Programs')}
              >
                <Link
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-lg font-medium transition-colors hover:text-brand-red flex items-center ${scrolled ? 'text-gray-800' : 'text-white shadow-sm'
                    }`}
                >
                  {item.label}
                  {item.label === 'Programs' && <ChevronDown size={16} className="ml-1" />}
                </Link>

                {/* Programs Mega Menu Dropdown */}
                {item.label === 'Programs' && (
                  <AnimatePresence>
                    {activeDropdown === 'Programs' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full -left-20 w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden mt-4 p-4 border-t-4 border-brand-red z-50 grid grid-cols-2 gap-4"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {programLinks.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            onClick={() => handleNavClick(subItem.href)}
                            className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors group/item"
                          >
                            <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-200">
                              <img src={subItem.image} alt={subItem.label} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900 group-hover/item:text-brand-red transition-colors">{subItem.label}</h5>
                              <p className="text-xs text-gray-500 font-medium">{subItem.age}</p>
                            </div>
                          </Link>
                        ))}

                        {/* Modern Birthday Party Banner */}
                        <div className="col-span-2 mt-2">
                          <Link
                            to="/birthday-parties"
                            onClick={() => handleNavClick('/birthday-parties')}
                            className="relative group block rounded-lg overflow-hidden h-24 shadow-md hover:shadow-xl transition-shadow"
                          >
                            {/* Background Image */}
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{ backgroundImage: "url('/assets/images/birthday-blur-cake-40183.jpg')" }}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-dark/40 group-hover:to-brand-red/40 transition-colors duration-300" />

                            {/* Content */}
                            <div className="relative h-full flex items-center justify-between px-6 text-white z-10">
                              <div className="flex items-center">
                                <div className="bg-brand-red p-2 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                  <Cake size={24} />
                                </div>
                                <div>
                                  <h5 className="font-bold text-lg leading-tight group-hover:text-yellow-200 transition-colors">Birthday Parties</h5>
                                  <p className="text-xs text-gray-200 opacity-90">A special celebration with a kick!</p>
                                </div>
                              </div>
                              <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/40 transition-colors">
                                <ArrowRight size={20} />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            <button
              onClick={() => setIsAdminOpen(true)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none ${scrolled
                ? 'text-gray-500 hover:text-brand-red hover:bg-gray-100'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              title="Admin Portal"
            >
              <Lock size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <Link
                to="/get-started"
                className="text-lg bg-brand-red text-white px-7 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-md transform hover:scale-105 duration-200"
              >
                Get Started
              </Link>
              <a
                href="https://www.facebook.com/WorldClassTigerLee/"
                target="_blank"
                rel="noreferrer"
                className={`transition-colors hover:text-[#1877F2] ${scrolled ? 'text-gray-800' : 'text-white shadow-sm'}`}
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://www.youtube.com/user/TigerLeeTaeKwonDo"
                target="_blank"
                rel="noreferrer"
                className={`transition-colors hover:text-[#FF0000] ${scrolled ? 'text-gray-800' : 'text-white shadow-sm'}`}
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-brand-red"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} className={scrolled ? 'text-gray-800' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t animate-in slide-in-from-top-5 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="text-gray-800 font-medium text-lg hover:text-brand-red flex items-center justify-between"
                    onClick={() => {
                      if (item.label !== 'Programs') handleNavClick(item.href);
                      else setActiveDropdown(activeDropdown === 'Programs' ? null : 'Programs');
                    }}
                  >
                    {item.label}
                    {item.label === 'Programs' && <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'Programs' ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Mobile Submenu */}
                  {item.label === 'Programs' && activeDropdown === 'Programs' && (
                    <div className="pl-4 mt-2 space-y-3 border-l-2 border-brand-red/20 ml-2">
                      {programLinks.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          onClick={() => handleNavClick(subItem.href)}
                          className="block text-gray-600 hover:text-brand-red text-base"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                      <Link
                        to="/birthday-parties"
                        onClick={() => handleNavClick('/birthday-parties')}
                        className="flex items-center text-brand-red font-bold text-base mt-2"
                      >
                        <Cake size={16} className="mr-2" />
                        Birthday Parties
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full text-left text-gray-500 font-medium text-lg hover:text-brand-red hover:bg-gray-100 p-2 rounded-lg transition-colors flex items-center mt-4 border-t border-gray-100 pt-4"
              >
                <Lock size={18} className="mr-3" />
                Admin Portal
              </button>
              <Link
                to="/get-started"
                className="bg-brand-red text-center text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
              <div className="flex space-x-4 pt-4 border-t justify-center">
                <a href="https://www.facebook.com/WorldClassTigerLee/" target="_blank" rel="noreferrer">
                  <Facebook className="text-blue-600 cursor-pointer" />
                </a>
                <a href="https://www.youtube.com/user/TigerLeeTaeKwonDo" target="_blank" rel="noreferrer">
                  <Youtube className="text-red-600 cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Admin Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
};

export default Navbar;