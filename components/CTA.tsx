import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Mail, Phone, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, ArrowDown, Calendar } from 'lucide-react';

const CTA: React.FC = () => {
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    participantName: '',
    participantAge: '',
    notes: '',
    paymentMethod: 'Pay Locally'
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [dateError, setDateError] = useState('');
  const [serverBookedSlots, setServerBookedSlots] = useState<Record<string, string[]>>({}); // Server (Sheet) bookings
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const isSubmitting = useRef(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [hasPaid, setHasPaid] = useState(false);
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep === 1 && !formData.service) return alert("Please select a service.");
    if (currentStep === 2 && (!formData.date || !formData.time || dateError)) return alert("Please select a date and time.");
    if (currentStep === 3 && (!formData.name || !formData.phone || !formData.email || !formData.participantName || !formData.participantAge)) {
      return alert("Please fill in all required parent and student information.");
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Load blocked dates
  useEffect(() => {
    fetchBookings();
  }, []);



  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    // Use the same script URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      if (data && data.booked) {
        // Normalize the booked slots to ensure formats match (e.g. "11:00 AM" vs "1899-12-30T11:00:00...")
        const normalizedBooked: Record<string, string[]> = {};

        Object.keys(data.booked).forEach(date => {
          const rawSlots = data.booked[date] as string[];
          normalizedBooked[date] = rawSlots.map(normalizeServerSlot);
        });

        setServerBookedSlots(normalizedBooked);
      }
    } catch (error) {
      console.warn("Could not fetch bookings (Script likely not updated with doGet yet):", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Helper to standardise time strings from Google Sheets
  const normalizeServerSlot = (slotRaw: string): string => {
    if (!slotRaw) return '';
    let slot = slotRaw.trim();

    // Handle ISO strings from Google Sheets (e.g. "2023-12-30T16:30:00.000Z")
    if (slot.includes('T') || slot.includes(':00.000')) {
      const date = new Date(slot);
      if (!isNaN(date.getTime())) {
        let hours = date.getHours(); // Google Sheets seems to use local time effectively or Z-time. 
        // Note: If script returns Z time, we might have timezone issues. 
        // Assuming simple script `.toString()` which usually keeps local script timezone.

        // However, simpler standardizer: if it contains ":" check the parts
      }
      // Fallback regex for "HH:mm:ss" in the string if Date parse is flaky
      const match = slot.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        let h = parseInt(match[1]);
        const m = match[2];
        const ampm = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${ampm}`;
      }
    }

    return slot;
  };

  // Handle Success Countdown
  useEffect(() => {
    if (status === 'success') {
      setTimeLeft(3);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('idle');
            setCurrentStep(1);
            setHasPaid(false);
            setIsPaymentWindowOpen(false);
            isSubmitting.current = false; // Reset lock for next booking
            // Reset form data after 3s
            setFormData({
              service: '',
              date: '',
              time: '',
              name: '',
              email: '',
              phone: '',
              participantName: '',
              participantAge: '',
              notes: '',
              paymentMethod: 'Pay Locally'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Handle Date Changes & Slot Calculation
  useEffect(() => {
    if (!formData.date) {
      setAvailableSlots([]);
      setDateError('');
      return;
    }

    // Parse date safely
    const parts = formData.date.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const dayOfMonth = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, dayOfMonth);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon ...

    let error = '';
    let slots: string[] = [];

    // 1. Check Sunday (0)
    if (dayOfWeek === 0) {
      error = 'Sorry, we are closed on Sundays.';
    }
    // 3. Assign Slots
    else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon-Thu
      slots = ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'];
    } else if (dayOfWeek === 5) { // Fri
      slots = ['5:30 PM', '6:00 PM', '6:30 PM'];
    } else if (dayOfWeek === 6) { // Sat
      slots = ['11:00 AM', '11:30 AM', '12:00 PM'];
    }

    setDateError(error);
    setAvailableSlots(slots);

    // Clear invalid time
    if (error || (formData.time && !slots.includes(formData.time))) {
      setFormData(prev => ({ ...prev, time: '' }));
    }

  }, [formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSelection = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prevent duplicate submissions using immediate ref check
    if (isSubmitting.current || status === 'success') return;
    isSubmitting.current = true;

    if (dateError) {
      isSubmitting.current = false;
      alert("Please select a valid date.");
      return;
    }
    if (!formData.time) {
      isSubmitting.current = false;
      alert("Please select a time slot.");
      return;
    }

    setStatus('sending');

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          "Participant Name": formData.participantName,
          participantAge: formData.participantAge,
          notes: formData.notes,
          "Payment Method": formData.paymentMethod,
          date: formData.date,
          time: formData.time,
          service: formData.service,
        } as any),
        mode: 'no-cors'
      });

      setStatus('success');
      fetchBookings();
      // No redirect - keep user on page as requested
    } catch (error) {
      console.error("Error sending message:", error);
      isSubmitting.current = false; // Release lock on error
      setStatus('error');
    }
  };

  // Setup payment success listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Message Received in CTA:', event.data);
      if (event.data === 'PAYMENT_SUCCESS') {
        console.log('Payment Verified! Finalizing booking...');
        setIsPaymentWindowOpen(false);
        setHasPaid(true);
        // Automatically submit the form once payment is confirmed
        const mockEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSubmit(mockEvent);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formData, status]); // Re-bind to ensure it has latest state




  // --- Calendar Helpers ---
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (d: number) => {
    const dateStr = formatDate(year, month, d);
    setFormData(prev => ({ ...prev, date: dateStr, time: '' })); // Reset time when date changes
  };

  // Get today string for styling
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());


  return (
    <section id="get-started" className="relative py-16 md:py-24 bg-brand-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left Content - Value Prop */}
          <motion.div
            className="lg:w-1/2 pt-0 lg:pt-8"
            initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="prose prose-lg text-gray-300 mb-8">
              <p className="leading-relaxed mb-6">
                Tiger Lee's World Class Tae Kwon Do has made it easy to get started. We offer a $20 trial program which gives new students the opportunity to try Tae Kwon Do, without obligation. During the trial period, new students will participate in a class with people of similar ability. The trial classes also allow parents and/or students to talk with our instructors about the many benefits Tae Kwon Do offers. There is no obligation at all after the trial program.
              </p>

              <div className="flex items-center text-brand-red font-bold text-lg mb-6">
                <ArrowDown className="mr-2 animate-bounce" size={24} />
                <span>Schedule Your Trial Lesson. It only takes a minute!</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-white mb-4">This Beginner Special Program includes:</h3>
              <ul className="space-y-4">
                {[
                  'V.I.P. 1-on-1 classes as well as 1 group class',
                  'Free Uniform',
                  'The opportunity to observe classes and speak with our professional instructors',
                  'Personal tour of our new, state-of-the-art facility',
                  'A review of our flexible, class schedule'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-300">
                    <CheckCircle className="text-brand-red mr-3 shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Content - Booking Form */}
          <motion.div
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="bg-brand-red p-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-xl uppercase tracking-wider">
                    {currentStep === 1 ? '1. Select Class' : currentStep === 2 ? '2. Select Schedule' : currentStep === 3 ? '3. Your Information' : '4. Payment'}
                  </h3>
                  <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-lg text-base font-black bg-white text-brand-red uppercase tracking-wider shadow-lg">
                    Trial Lesson Special - $20
                  </div>
                </div>
                <span className="text-red-100/50 text-sm font-bold">Step {currentStep} of {status === 'success' ? '4' : '4'}</span>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <AnimatePresence mode="wait">
                  {status !== 'success' ? (
                    <motion.div
                      key="form-steps"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Which class are you interested in?</label>
                              <div className="grid grid-cols-1 gap-3">
                                {[
                                  'Little Tigers (4-5 yrs)',
                                  'Children\'s Class (6-12 yrs)',
                                  'Adult Class (13+ yrs)',
                                  'Family Class'
                                ].map((lesson) => (
                                  <button
                                    key={lesson}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, service: lesson }))}
                                    className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all duration-300 flex items-center justify-between ${formData.service === lesson
                                      ? 'border-brand-red bg-red-50 text-brand-red shadow-sm'
                                      : 'border-gray-100 hover:border-brand-red/30 text-gray-700'
                                      }`}
                                  >
                                    <span>{lesson}</span>
                                    {formData.service === lesson && <CheckCircle size={20} />}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={nextStep}
                              className="w-full bg-brand-dark text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
                            >
                              <span>Next Step</span>
                              <ChevronRight size={20} />
                            </button>
                          </motion.div>
                        )}

                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex flex-col items-center space-y-6">
                              <div className="w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                {/* Calendar Header */}
                                <div className="flex justify-between items-center mb-6">
                                  <button type="button" onClick={prevMonth} className="p-2 hover:bg-red-50 text-gray-400 hover:text-brand-red rounded-full transition-all duration-300">
                                    <ChevronLeft size={24} strokeWidth={2.5} />
                                  </button>
                                  <h4 className="font-extrabold text-gray-800 text-xl tracking-tight">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                  </h4>
                                  <button type="button" onClick={nextMonth} className="p-2 hover:bg-red-50 text-gray-400 hover:text-brand-red rounded-full transition-all duration-300">
                                    <ChevronRight size={24} strokeWidth={2.5} />
                                  </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 mb-4">
                                  {daysOfWeek.map(day => (
                                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-1">
                                      {day}
                                    </div>
                                  ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2 lg:gap-3">
                                  {[...Array(firstDay)].map((_, i) => (
                                    <div key={`empty-${i}`} className="p-2"></div>
                                  ))}

                                  {[...Array(days)].map((_, i) => {
                                    const d = i + 1;
                                    const dateStr = formatDate(year, month, d);
                                    const isSelected = formData.date === dateStr;
                                    const currentDayOfWeek = new Date(year, month, d).getDay();
                                    const isSunday = currentDayOfWeek === 0;
                                    const isToday = dateStr === todayStr;
                                    const serverSlots = serverBookedSlots[dateStr] || [];
                                    const isFullDayBlocked = serverSlots.includes('FULL_DAY');
                                    const bookingDate = new Date(year, month, d);
                                    const todayDate = new Date();
                                    todayDate.setHours(0, 0, 0, 0);
                                    const isPast = bookingDate < todayDate;

                                    let btnClass = "relative w-full aspect-square flex items-center justify-center rounded-2xl text-base lg:text-lg font-bold transition-all duration-300 ";
                                    if (isPast) btnClass += "text-gray-300 cursor-not-allowed font-normal bg-gray-50/50";
                                    else if (isSunday) btnClass += "text-red-200 cursor-not-allowed font-normal bg-red-50/10";
                                    else if (isFullDayBlocked) btnClass += "text-gray-300 cursor-not-allowed font-normal bg-gray-100/50 border border-dashed border-gray-200";
                                    else if (isSelected) btnClass += "bg-gradient-to-br from-brand-red to-red-600 text-white shadow-lg shadow-red-200 scale-105 z-10";
                                    else btnClass += "text-gray-700 hover:bg-red-50 hover:text-brand-red hover:scale-110";

                                    if (isToday && !isSelected) btnClass += " text-brand-red bg-red-50 ring-1 ring-inset ring-red-100";

                                    return (
                                      <button
                                        key={d}
                                        type="button"
                                        onClick={() => !isPast && !isSunday && !isFullDayBlocked && handleDateClick(d)}
                                        disabled={isPast || isSunday || isFullDayBlocked}
                                        className={btnClass}
                                      >
                                        {d}
                                        {isToday && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-brand-red rounded-full"></div>}
                                        {isFullDayBlocked && !isPast && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {formData.date && !dateError && (
                                <div className="w-full max-w-[480px] space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                  <div className="flex items-center space-x-2 px-1">
                                    <Clock size={16} className="text-brand-red" />
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Available Times</p>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {!isLoadingBookings && availableSlots.map(slot => {
                                      const isServerBooked = serverBookedSlots[formData.date]?.includes(slot);
                                      let isTimePast = false;
                                      if (formData.date === todayStr) {
                                        const now = new Date();
                                        const [time, ampm] = slot.split(' ');
                                        let [hours, minutes] = time.split(':').map(Number);
                                        if (ampm === 'PM' && hours < 12) hours += 12;
                                        if (ampm === 'AM' && hours === 12) hours = 0;
                                        const slotTime = new Date();
                                        slotTime.setHours(hours, minutes, 0, 0);
                                        if (slotTime < now) isTimePast = true;
                                      }
                                      const isBlocked = isServerBooked || isTimePast;

                                      return (
                                        <button
                                          key={slot}
                                          type="button"
                                          disabled={isBlocked}
                                          onClick={() => !isBlocked && handleTimeSelection(slot)}
                                          className={`group relative overflow-hidden py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${isBlocked
                                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                            : formData.time === slot
                                              ? 'border-brand-red bg-brand-red text-white shadow-md'
                                              : 'border-gray-100 bg-white text-gray-600 hover:border-brand-red/30'
                                            }`}
                                        >
                                          {isBlocked ? <span className="line-through">{isTimePast ? 'Passed' : 'Booked'}</span> : <span>{slot}</span>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                              <button type="button" onClick={prevStep} className="flex items-center justify-center space-x-2 py-4 border-2 border-gray-100 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition-all">
                                <ChevronLeft size={20} />
                                <span>Back</span>
                              </button>
                              <button type="button" onClick={nextStep} className="flex items-center justify-center space-x-2 py-4 bg-brand-dark text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-lg">
                                <span>Next</span>
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="space-y-4">
                              <div className="relative">
                                <input type="text" name="name" required placeholder="Parent/Contact Full Name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                  <input type="tel" name="phone" required placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                                <div className="relative">
                                  <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                              </div>
                              <div className="relative">
                                <input type="text" name="participantName" required placeholder="Student's Full Name" value={formData.participantName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                              </div>
                              <div className="relative">
                                <input type="text" name="participantAge" required placeholder="Student's Age" value={formData.participantAge} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                                <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                              </div>
                              <textarea name="notes" placeholder="Notes (Injuries, goals, etc.)" rows={3} value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <button type="button" onClick={prevStep} className="flex items-center justify-center py-4 border-2 border-gray-100 rounded-lg font-bold text-gray-500 hover:bg-gray-50">Back</button>
                              <button type="button" onClick={nextStep} className="bg-brand-dark text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                                <span>Next Step</span>
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-2 border border-blue-100/50">
                                <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Selected Class & Time</p>
                                <p className="text-sm font-bold text-gray-800">{formData.service}</p>
                                <div className="flex items-center text-xs text-gray-500 font-medium space-x-3">
                                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {formData.date}</span>
                                  <span className="flex items-center"><Clock size={12} className="mr-1" /> {formData.time}</span>
                                </div>
                              </div>

                              <div className="space-y-3 pt-2">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Final Step: Choose Payment</label>
                                <div className="grid grid-cols-1 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => { setFormData(p => ({ ...p, paymentMethod: 'Pay Locally' })); setHasPaid(false); }}
                                    className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-start space-y-1 ${formData.paymentMethod === 'Pay Locally' ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-100 text-gray-500'}`}
                                  >
                                    <span className="text-sm">Pay Locally</span>
                                    <span className="text-[10px] opacity-70">Pay $20 at the studio</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Pay Now (Stripe / Apple / Google Pay)' }))}
                                    className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-start space-y-2 ${formData.paymentMethod === 'Pay Now (Stripe / Apple / Google Pay)' ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-100 text-gray-500'}`}
                                  >
                                    <span className="text-sm">Pay Now (Digital Secure)</span>
                                    <div className="flex items-center space-x-2">
                                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4 opacity-80" />
                                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" alt="Google Pay" className="h-4 opacity-80" />
                                      <div className="flex -space-x-1">
                                        <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-orange-500 rounded-sm ml-1"></div>
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-[1fr,2fr] gap-4">
                              <button type="button" onClick={prevStep} className="flex items-center justify-center py-4 border-2 border-gray-100 rounded-lg font-bold text-gray-500 hover:bg-gray-50">Back</button>

                              {formData.paymentMethod === 'Pay Now (Stripe / Apple / Google Pay)' && !hasPaid ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const stripeUrl = `https://buy.stripe.com/test_7sY28qgM7cCha5FaQv8IU00?prefilled_email=${encodeURIComponent(formData.email)}`;

                                    // Calculate center of screen
                                    const width = 500;
                                    const height = 700;
                                    const left = (window.screen.width / 2) - (width / 2);
                                    const top = (window.screen.height / 2) - (height / 2);

                                    window.open(
                                      stripeUrl,
                                      'StripePayment',
                                      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,location=no,status=no`
                                    );

                                    setIsPaymentWindowOpen(true);
                                  }}
                                  className="bg-brand-red text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                                >
                                  <span>Secure Checkout</span>
                                  <ChevronRight size={20} />
                                </button>
                              ) : (
                                <button type="submit" disabled={status === 'sending' || status === 'success' || (formData.paymentMethod.includes('Stripe') && isPaymentWindowOpen)} className={`bg-brand-red text-white font-bold text-lg py-4 rounded-lg shadow-lg transition-all active:scale-95 ${status === 'sending' || status === 'success' || (formData.paymentMethod.includes('Stripe') && isPaymentWindowOpen) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}>
                                  {status === 'sending' ? 'Processing...' : status === 'success' ? 'Confirmed ✓' : 'Complete Booking'}
                                </button>
                              )}
                            </div>


                            {formData.paymentMethod === 'Pay Now (Stripe / Apple / Google Pay)' && isPaymentWindowOpen && status !== 'success' && (
                              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                                <div className="flex items-center space-x-3 text-blue-700">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
                                  <span className="font-bold text-sm">Secure Payment in Progress...</span>
                                </div>
                                <p className="text-xs text-blue-600/80">Complete payment in the popup window, then your booking will finalize automatically.</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle size={48} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h3>
                        <p className="text-gray-600 text-sm">A confirmation email and invoice have been sent to <strong>{formData.email}</strong>.</p>
                      </div>
                      <div className="px-6 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400">
                        Resetting form in {timeLeft}s...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-center text-[10px] text-gray-400">
                  By booking, you agree to our terms. We'll confirm via email.
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div >
    </section >
  );
};

export default CTA;