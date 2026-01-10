import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Calendar, Clock, Trash2, LogOut, AlertCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Blocking state
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<Record<string, string[]>>({});
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Load blocked data from localStorage
    useEffect(() => {
        if (isAuthenticated) {
            const savedDates = localStorage.getItem('tigerlee_blocked_dates');
            if (savedDates) {
                try { setBlockedDates(JSON.parse(savedDates)); } catch (e) { console.error(e); }
            }
            const savedSlots = localStorage.getItem('tigerlee_blocked_slots');
            if (savedSlots) {
                try { setBlockedSlots(JSON.parse(savedSlots)); } catch (e) { console.error(e); }
            }
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    const handleBlockDate = () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }
        if (blockedDates.includes(selectedDate)) {
            alert('This date is already blocked');
            return;
        }
        const newBlocked = [...blockedDates, selectedDate].sort();
        setBlockedDates(newBlocked);
        localStorage.setItem('tigerlee_blocked_dates', JSON.stringify(newBlocked));
        setSelectedDate('');
    };

    const handleUnblockDate = (date: string) => {
        const newBlocked = blockedDates.filter(d => d !== date);
        setBlockedDates(newBlocked);
        localStorage.setItem('tigerlee_blocked_dates', JSON.stringify(newBlocked));
    };

    const handleBlockTimeSlot = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        const currentBlocked = blockedSlots[selectedDate] || [];
        if (currentBlocked.includes(selectedTime)) {
            alert('This time slot is already blocked');
            return;
        }

        const newBlocked = [...currentBlocked, selectedTime].sort();
        const newBlockedSlots = { ...blockedSlots, [selectedDate]: newBlocked };
        setBlockedSlots(newBlockedSlots);
        localStorage.setItem('tigerlee_blocked_slots', JSON.stringify(newBlockedSlots));
        setSelectedTime('');
    };

    const handleUnblockTimeSlot = (date: string, time: string) => {
        const currentBlocked = blockedSlots[date] || [];
        const newBlocked = currentBlocked.filter(t => t !== time);

        const newBlockedSlots = { ...blockedSlots };
        if (newBlocked.length === 0) {
            delete newBlockedSlots[date];
        } else {
            newBlockedSlots[date] = newBlocked;
        }

        setBlockedSlots(newBlockedSlots);
        localStorage.setItem('tigerlee_blocked_slots', JSON.stringify(newBlockedSlots));
    };

    // Common time slots
    const timeSlots = [
        '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', // Mon-Thu
        '6:30 PM', // Fri
        '11:00 AM', '11:30 AM', '12:00 PM' // Sat
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">

                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-brand-dark p-6 text-center">
                        <h1 className="text-2xl font-bold text-white flex items-center justify-center">
                            <Lock className="mr-2" /> Admin Portal
                        </h1>
                    </div>

                    <div className="p-8">
                        {!isAuthenticated ? (
                            <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                                        placeholder="Enter admin password"
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
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="text-center pb-6 border-b border-gray-100">
                                    <p className="text-green-600 font-medium mb-4">Logged in successfully</p>
                                    <button onClick={handleLogout} className="text-gray-500 text-sm flex items-center justify-center mx-auto hover:text-brand-red">
                                        <LogOut size={16} className="mr-1" /> Logout
                                    </button>
                                </div>

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
                                            className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
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
                                    </div>

                                    <button
                                        onClick={handleBlockTimeSlot}
                                        className="w-full bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Block Time Slot
                                    </button>

                                    {Object.keys(blockedSlots).length > 0 && (
                                        <div className="mt-6 space-y-4">
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
                                        <p className="text-sm text-gray-400 italic mt-4">No time slots blocked</p>
                                    )}
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                                    <AlertCircle className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold mb-1">How it works:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Blocked dates/times will appear as unavailable on the booking form</li>
                                            <li>Customers won't be able to select blocked slots</li>
                                            <li>Bookings from Google Sheets are automatically blocked too</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;