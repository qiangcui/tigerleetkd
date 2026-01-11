/// <reference types="vite/client" />
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import GetStartedPage from './pages/GetStartedPage';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import ProgramsPage from './pages/ProgramsPage';
import BirthdayPartyPage from './pages/BirthdayPartyPage';
import FAQPage from './pages/FAQPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import SuccessPage from './pages/SuccessPage';

// Component to scroll to top on route change or handle hash scrolling
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Calculate offset: navbar height (~150px) + extra padding for better view
          const offset = 120;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const PaymentComplete = () => {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage('PAYMENT_SUCCESS', '*');
      window.close();
    }
  }, []);
  return <div className="min-h-screen bg-white flex items-center justify-center font-bold">Processing Booking...</div>;
};

function App() {
  const basename = import.meta.env.BASE_URL;

  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <ScrollToTopButton />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/birthday-parties" element={<BirthdayPartyPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/booking-success" element={<SuccessPage />} />
          <Route path="/payment-complete" element={<PaymentComplete />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;