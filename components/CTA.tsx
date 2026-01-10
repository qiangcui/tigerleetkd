import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Mail, Phone, CheckCircle, ChevronRight, ChevronLeft, AlertCircle, ArrowDown } from 'lucide-react';

const CTA: React.FC = () => {
  const [formData, setFormData] = useState({
    service: 'Trial Lesson Special - $20',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [dateError, setDateError] = useState('');
  const [serverBookedSlots, setServerBookedSlots] = useState<Record<string, string[]>>({}); // Server (Sheet) bookings
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [timeLeft, setTimeLeft] = useState(3);

  // Load blocked dates and slots (Server Only)
  useEffect(() => {
    // Fetch Server Bookings
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
            // Reset form data after 3s
            setFormData({
              service: 'Trial Lesson Special - $20',
              date: '',
              time: '',
              name: '',
              email: '',
              phone: ''
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
    e.preventDefault();

    if (dateError) {
      alert("Please select a valid date.");
      return;
    }
    if (!formData.time) {
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
          // NEW: Send explicit date/time for the script to store in columns
          date: formData.date,
          time: formData.time,
          service: formData.service,
          phone: formData.phone,
          // Keep these for backward compatibility or email body composition if script logic is split
          subject: `Trial Lesson Booking: ${formData.service}`,
          // Removed manual 'message' field from body as per request, but keeping formatted message for email usage layout if needed internally
          message_body: `New Booking Request Details:
------------------------
Service: ${formData.service}
Date: ${formData.date}
Time: ${formData.time}

Contact Information:
------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Sent from Tiger Lee's Website Booking Form`
        } as any),
        mode: 'no-cors'
      });

      setStatus('success');
      // Refresh bookings after successful addition
      fetchBookings();
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };




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
              <div className="bg-brand-red p-4 text-center">
                <h3 className="text-white font-bold text-xl uppercase tracking-wider">Book Your Appointment</h3>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">



                {/* Step 1: Service */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">1. Select Service</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none appearance-none cursor-pointer text-gray-700 font-medium"
                    >
                      <option>Trial Lesson Special - $20</option>
                      <option>Little Tigers (4-5 yrs)</option>
                      <option>Children's Class (6-12 yrs)</option>
                      <option>Adult Class (13+ yrs)</option>
                      <option>Family Class</option>
                    </select>
                    <CheckCircle className="absolute left-3 top-3.5 text-brand-red" size={18} />
                  </div>
                </div>

                {/* Step 2: Calendar - SHRUNKEN */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="flex items-center space-x-2 text-brand-red">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold">2</span>
                    <label className="text-base font-bold text-gray-800 uppercase tracking-wide">Select Date & Time</label>
                  </div>

                  <div className="w-full max-w-[480px] bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
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
                        // Format the date string for checking server blocks
                        const dateStr = formatDate(year, month, d);
                        const isSelected = formData.date === dateStr;
                        const currentDayOfWeek = new Date(year, month, d).getDay();
                        const isSunday = currentDayOfWeek === 0;
                        const isToday = dateStr === todayStr;

                        // Check server blocks
                        const serverSlots = serverBookedSlots[dateStr] || [];
                        const isFullDayBlocked = serverSlots.includes('FULL_DAY');

                        // Check if date is in the past
                        const bookingDate = new Date(year, month, d);
                        const todayDate = new Date();
                        todayDate.setHours(0, 0, 0, 0);
                        const isPast = bookingDate < todayDate;

                        let btnClass = "relative w-full aspect-square flex items-center justify-center rounded-2xl text-base lg:text-lg font-bold transition-all duration-300 ";

                        if (isPast) {
                          btnClass += "text-gray-300 cursor-not-allowed font-normal bg-gray-50/50";
                        } else if (isSunday) {
                          btnClass += "text-red-200 cursor-not-allowed font-normal bg-red-50/10";
                        } else if (isFullDayBlocked) {
                          btnClass += "text-gray-300 cursor-not-allowed font-normal bg-gray-100/50 border border-dashed border-gray-200";
                        } else if (isSelected) {
                          btnClass += "bg-gradient-to-br from-brand-red to-red-600 text-white shadow-lg shadow-red-200 scale-105 z-10";
                        } else {
                          btnClass += "text-gray-700 hover:bg-red-50 hover:text-brand-red hover:scale-110";
                        }

                        if (isToday && !isSelected) {
                          btnClass += " text-brand-red bg-red-50 ring-1 ring-inset ring-red-100";
                        }

                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => !isPast && !isSunday && !isFullDayBlocked && handleDateClick(d)}
                            disabled={isPast || isSunday || isFullDayBlocked}
                            className={btnClass}
                          >
                            {d}
                            {isToday && !isSelected && (
                              <div className="absolute bottom-1.5 w-1 h-1 bg-brand-red rounded-full"></div>
                            )}
                            {isFullDayBlocked && !isPast && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {dateError && (
                    <div className="flex items-center text-red-600 text-sm bg-red-50/80 p-4 rounded-xl w-full max-w-[480px] border border-red-100 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={18} className="mr-3 shrink-0" />
                      {dateError}
                    </div>
                  )}

                  {/* Date Selection Display & Time Slots */}
                  {formData.date && !dateError && (
                    <div className="w-full max-w-[480px] space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center space-x-2 px-1">
                        <Clock size={16} className="text-brand-red" />
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                          Available Times
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {isLoadingBookings && (
                          <div className="col-span-full text-center text-xs text-brand-red animate-pulse py-2">
                            Checking availability...
                          </div>
                        )}
                        {!isLoadingBookings && availableSlots.map(slot => {
                          const isServerBooked = serverBookedSlots[formData.date]?.includes(slot);

                          // Check if the slot time is in the past for TODAY
                          let isTimePast = false;
                          if (formData.date === todayStr) {
                            const now = new Date();
                            const [time, ampm] = slot.split(' ');
                            let [hours, minutes] = time.split(':').map(Number);

                            if (ampm === 'PM' && hours < 12) hours += 12;
                            if (ampm === 'AM' && hours === 12) hours = 0;

                            const slotTime = new Date();
                            slotTime.setHours(hours, minutes, 0, 0);

                            if (slotTime < now) {
                              isTimePast = true;
                            }
                          }

                          const isBlocked = isServerBooked || isTimePast;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBlocked}
                              onClick={() => !isBlocked && handleTimeSelection(slot)}
                              className={`group relative overflow-hidden py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${isBlocked
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed decoration-slice'
                                : formData.time === slot
                                  ? 'border-brand-red bg-brand-red text-white shadow-md scale-[1.02]'
                                  : 'border-gray-100 bg-white text-gray-600 hover:border-brand-red/30 hover:shadow-md hover:text-brand-red'
                                }`}
                            >
                              {isBlocked ? (
                                <span className="relative z-10 text-[13px] line-through decoration-brand-red/50 decoration-2">{isTimePast && !isServerBooked ? 'Passed' : 'Booked'}</span>
                              ) : (
                                <>
                                  <span className="relative z-10 text-[13px]">{slot}</span>
                                  {formData.time !== slot && (
                                    <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  )}
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* Step 3: Contact Details */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">3. Your Details</label>

                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                      />
                      <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                      />
                      <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.date || !!dateError || !formData.time || status === 'sending' || status === 'success'}
                  className="w-full bg-brand-red text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:bg-red-700 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{status === 'sending' ? 'Sending...' : 'Confirm Booking'}</span>
                  {status !== 'sending' && <ChevronRight size={20} />}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center"
                    >
                      <p className="font-bold">Booking Request Sent!</p>
                      <p className="text-sm">Closing in {timeLeft}s...</p>
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
      </div>
    </section>
  );
};

export default CTA;