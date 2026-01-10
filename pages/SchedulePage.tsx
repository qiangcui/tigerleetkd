import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, AlertCircle, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Use unpkg for the worker source to ensure correct MIME type and file content for the worker
// Use explicit version matching react-pdf 9.1.1 dependency
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const pdfOptions = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@4.4.168/cmaps/',
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@4.4.168/standard_fonts/',
};

const SchedulePage: React.FC = () => {
  const pdfUrl = "assets/pdf/Tiger-Lees-Class-Schedule-2025.pdf";

  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error('Error loading PDF:', err);
    setLoading(false);
    setError(true);
  }

  return (
    <div className="pt-0 bg-white">
      {/* Page Header */}
      <div className="relative h-[400px] w-full overflow-hidden bg-brand-dark flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/images/exterior-tigerlee.jpg)` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 container mx-auto px-4 pt-32">
          <motion.div
            initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Class Schedule
            </h1>
            <div className="w-24 h-1 bg-brand-red rounded-full"></div>
            <p className="text-gray-300 mt-4 text-lg max-w-2xl">
              We have a flexible schedule to fit you and your children's needs. We make Tae Kwon Do work for you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 pt-12 md:py-16 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-4 px-4 md:px-0">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Current Schedule</h2>
            <a
              href={pdfUrl}
              download="Tiger-Lee-Schedule.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-brand-red text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors shadow-md"
            >
              <Download size={20} className="mr-2" />
              Download PDF
            </a>
          </div>

          {/* PDF Viewer Container */}
          <div ref={containerRef} className="w-full min-h-0 md:min-h-[500px] bg-white md:bg-gray-100 md:rounded-xl md:shadow-lg md:border border-gray-200 overflow-hidden relative flex flex-col items-center justify-center p-0 md:p-8">

            {error && (
              <div className="text-center p-8 max-w-md">
                <AlertCircle size={48} className="mx-auto text-brand-red mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Preview Schedule</h3>
                <p className="text-gray-600 mb-6">
                  The schedule PDF could not be loaded directly due to network restrictions or browser compatibility.
                </p>
                <a
                  href={pdfUrl}
                  download="Tiger-Lee-Schedule.pdf"
                  className="inline-block bg-brand-dark text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Download PDF Instead
                </a>
              </div>
            )}

            {!error && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                options={pdfOptions}
                loading={
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-brand-red mb-4" size={40} />
                    <p className="text-gray-500 font-medium">Loading schedule...</p>
                  </div>
                }
                className="flex flex-col gap-0 md:gap-8 w-full"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth > 0 ? (window.innerWidth < 768 ? containerWidth : Math.min(containerWidth - 64, 1000)) : 300}
                    className="md:shadow-xl"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            * Schedule is subject to change. Please contact us for the most up-to-date information.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-dark py-16 text-center relative overflow-hidden">
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

export default SchedulePage;