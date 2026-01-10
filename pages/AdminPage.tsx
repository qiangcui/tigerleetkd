import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Calendar, Clock, Trash2, LogOut, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

interface Booking {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    service: string;
}

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Blocking state
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<Record<string, string[]>>({});
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Bookings state
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState('');

    // Check for existing session on mount
    useEffect(() => {
        const session = localStorage.getItem('tigerlee_admin_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();

                // Check if session is still valid (24 hours)
                if (sessionData.expiry && now < sessionData.expiry) {
                    setIsAuthenticated(true);
                } else {
                    // Session expired, clear it
                    localStorage.removeItem('tigerlee_admin_session');
                }
            } catch (e) {
                console.error('Invalid session data', e);
                localStorage.removeItem('tigerlee_admin_session');
            }
        }
    }, []);

    // Load blocked data from localStorage
    useEffect(() => {
        if (isAuthenticated) {
            loadBlockedData();
            fetchBookings();
        }
    }, [isAuthenticated]);

    const loadBlockedData = () => {
        const savedDates = localStorage.getItem('tigerlee_blocked_dates');
        if (savedDates) {
            try { setBlockedDates(JSON.parse(savedDates)); } catch (e) { console.error(e); }
        }
        const savedSlots = localStorage.getItem('tigerlee_blocked_slots');
        if (savedSlots) {
            try { setBlockedSlots(JSON.parse(savedSlots)); } catch (e) { console.error(e); }
        }
    };

    const fetchBookings = async () => {
        setIsLoadingBookings(true);
        setBookingsError('');
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();

            if (data && data.bookings) {
                // Get today's date for comparison (midnight)
                const now = new Date();
                const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                // Separate real bookings from manual blocks
                const allRows = data.bookings;

                // 1. Real Customer Bookings (Today + Future)
                const futureBookings = allRows.filter((b: Booking) => {
                    if (!b.date) return false;

                    // Parse date components safely
                    const components = b.date.split('-').map(Number);
                    if (components.length !== 3 || components.some(isNaN)) return false;

                    const bDate = new Date(components[0], components[1] - 1, components[2]);

                    // We only want bookings that are Today or in the future
                    const isOld = bDate < todayMidnight;
                    const isReal = b.service !== 'MANUAL_BLOCK' && b.name !== 'Admin Block';

                    return !isOld && isReal;
                });
                setBookings(futureBookings);

                // 2. Derive Blocked Dates (Full Day)
                const fullDayBlocks = allRows
                    .filter((b: Booking) => (b.service === 'MANUAL_BLOCK' || b.name === 'Admin Block') && (b.time === 'FULL DAY BLOCK' || !b.time))
                    .map((b: Booking) => b.date);
                setBlockedDates([...new Set(fullDayBlocks)].sort() as string[]);

                // 3. Derive Blocked Slots
                const slotsObj: Record<string, string[]> = {};
                allRows.forEach((b: Booking) => {
                    if ((b.service === 'MANUAL_BLOCK' || b.name === 'Admin Block') && b.time && b.time !== 'FULL DAY BLOCK') {
                        if (!slotsObj[b.date]) slotsObj[b.date] = [];
                        if (!slotsObj[b.date].includes(b.time)) slotsObj[b.date].push(b.time);
                    }
                });
                setBlockedSlots(slotsObj);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookingsError("Could not load data from Google Sheets");
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('tigerlee_admin_session', JSON.stringify({ authenticated: true, expiry }));
            setPassword('');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('tigerlee_admin_session');
    };

    const handleBlockDate = async () => {
        if (!selectedDate) return alert('Please select a date');

        setIsLoadingBookings(true);
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams({
                    date: selectedDate,
                    time: "",
                    service: "MANUAL_BLOCK",
                    name: "Admin Block",
                    email: "admin@system",
                    phone: "N/A"
                } as any),
                mode: 'no-cors'
            });
            setSelectedDate('');
            fetchBookings();
        } catch (err) {
            alert("Failed to save block");
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const handleBlockTimeSlot = async () => {
        if (!selectedDate || !selectedTime) return alert('Please select both date and time');

        setIsLoadingBookings(true);
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams({
                    date: selectedDate,
                    time: selectedTime,
                    service: "MANUAL_BLOCK",
                    name: "Admin Block",
                    email: "admin@system",
                    phone: "N/A"
                } as any),
                mode: 'no-cors'
            });
            setSelectedTime('');
            fetchBookings();
        } catch (err) {
            alert("Failed to save slot block");
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const handleUnblockDate = async (date: string) => {
        if (!window.confirm(`Are you sure you want to unblock all slots for ${date}?`)) return;

        setIsLoadingBookings(true);
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams({
                    action: "delete",
                    date: date,
                    time: "" // Empty time indicates full day block
                }),
                mode: 'no-cors'
            });
            fetchBookings();
        } catch (err) {
            alert("Failed to unblock date");
        } finally {
            setIsLoadingBookings(false);
        }
    };

    const handleUnblockTimeSlot = async (date: string, time: string) => {
        if (!window.confirm(`Are you sure you want to unblock ${time} on ${date}?`)) return;

        setIsLoadingBookings(true);
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                body: new URLSearchParams({
                    action: "delete",
                    date: date,
                    time: time
                }),
                mode: 'no-cors'
            });
            fetchBookings();
        } catch (err) {
            alert("Failed to unblock slot");
        } finally {
            setIsLoadingBookings(false);
        }
    };

    // Common time slots
    const timeSlots = [
        '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', // Mon-Thu
        '6:30 PM', // Fri
        '11:00 AM', '11:30 AM', '12:00 PM' // Sat
    ];

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
                        <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center">
                            <Lock className="mr-4" size={48} />
                            Admin Portal
                        </h1>
                        <div className="w-24 h-1 bg-brand-red rounded-full"></div>
                        <p className="text-gray-300 mt-4 text-lg max-w-2xl">
                            Manage bookings, block dates and time slots. Authorized personnel only.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {!isAuthenticated ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-brand-dark p-6 text-center">
                                <h2 className="text-xl font-bold text-white">Login Required</h2>
                            </div>
                            <form onSubmit={handleLogin} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-600 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                                <p className="text-green-600 font-medium flex items-center">
                                    <CheckCircle className="mr-2" size={20} />
                                    Logged in successfully
                                </p>
                                <button onClick={handleLogout} className="text-gray-500 text-sm flex items-center hover:text-brand-red transition-colors">
                                    <LogOut size={16} className="mr-1" /> Logout
                                </button>
                            </div>

                            {/* Future Bookings List */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                        <Calendar className="mr-2 text-blue-600" size={24} />
                                        Future Bookings
                                    </h2>
                                    <button
                                        onClick={fetchBookings}
                                        disabled={isLoadingBookings}
                                        className="flex items-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw size={16} className={`mr-2 ${isLoadingBookings ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
                                </div>

                                {bookingsError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                        {bookingsError}
                                    </div>
                                )}

                                {isLoadingBookings ? (
                                    <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                                ) : bookings.length === 0 ? (
                                    <p className="text-gray-500 italic text-center py-8">No future bookings found</p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {bookings.map((booking, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Date</p>
                                                    <p className="font-bold text-gray-800">{booking.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Time</p>
                                                    <p className="font-bold text-gray-800">{booking.time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Name</p>
                                                    <p className="font-medium text-gray-800">{booking.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Email</p>
                                                    <p className="text-gray-600 truncate">{booking.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Phone</p>
                                                    <p className="text-gray-600">{booking.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Service</p>
                                                    <p className="text-gray-600 text-xs">{booking.service}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Block Entire Date */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <Calendar className="mr-2 text-brand-red" size={24} />
                                        Block Entire Date
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Block all time slots for a specific date (e.g., holidays, closures).
                                    </p>

                                    <div className="flex gap-3 mb-4">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                        />
                                        <button
                                            onClick={handleBlockDate}
                                            className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                                        >
                                            Block Date
                                        </button>
                                    </div>

                                    {blockedDates.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-gray-700">Blocked Dates:</p>
                                            {blockedDates.map(date => (
                                                <div key={date} className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                                                    <span className="text-gray-700">{date}</span>
                                                    <button
                                                        onClick={() => handleUnblockDate(date)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        title="Unblock this date"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {blockedDates.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No dates blocked</p>
                                    )}
                                </div>

                                {/* Block Specific Time Slot */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <Clock className="mr-2 text-brand-red" size={24} />
                                        Block Specific Time Slot
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Block a specific time slot for a date (e.g., phone bookings, special events).
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 mb-4">
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                        />
                                        <select
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                                        >
                                            <option value="">Select time...</option>
                                            {timeSlots.map(slot => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleBlockTimeSlot}
                                            className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Block Time Slot
                                        </button>
                                    </div>

                                    {Object.keys(blockedSlots).length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-bold text-gray-700">Blocked Time Slots:</p>
                                            {Object.entries(blockedSlots).map(([date, times]) => (
                                                <div key={date} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <p className="font-bold text-gray-800 mb-2">{date}</p>
                                                    <div className="space-y-2">
                                                        {times.map(time => (
                                                            <div key={time} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                                                                <span className="text-gray-700 text-sm">{time}</span>
                                                                <button
                                                                    onClick={() => handleUnblockTimeSlot(date, time)}
                                                                    className="text-red-500 hover:text-red-700 p-1"
                                                                    title="Unblock this slot"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {Object.keys(blockedSlots).length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No time slots blocked</p>
                                    )}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                                <AlertCircle className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-bold mb-1">How it works:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Blocked dates/times will appear as unavailable on the booking form</li>
                                        <li>Customers won't be able to select blocked slots</li>
                                        <li>Bookings from Google Sheets are automatically blocked too</li>
                                        <li>Manual blocks are stored locally in your browser</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;