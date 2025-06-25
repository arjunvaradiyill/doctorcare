"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { authAPI, api, Appointment, Patient } from '@/app/services/api';
import TopBar from '@/components/TopBar';

const statCards = [
  { label: "Total Patients", value: "12.3K" },
  { label: "New Patients", value: "1.2K" },
  { label: "Appointments", value: "3.4K" },
  { label: "Total Hours", value: "120 hr" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-blue-100 text-blue-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const notifications = [
  { id: 1, text: "New appointment booked." },
  { id: 2, text: "Patient profile updated." },
  { id: 3, text: "Payment received." },
  { id: 4, text: "Patient feedback received." },
  { id: 5, text: "System update available." },
  { id: 6, text: "New message from admin." },
];

const languages = [
  { code: "en", label: "English", flag: "https://flagcdn.com/gb.svg" },
  { code: "fr", label: "French", flag: "https://flagcdn.com/fr.svg" },
  { code: "es", label: "Spanish", flag: "https://flagcdn.com/es.svg" },
];

export default function DoctorPatientsDashboard() {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [previousPatients, setPreviousPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    date: "",
    time: "",
    department: "",
    doctor: "",
    reason: "",
  });

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    
    // Fetch previous patients
    fetchPreviousPatients();
  }, []);

  const fetchPreviousPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all appointments
      const allAppointments = await api.getAppointments();
      
      // Get unique patients from appointments
      const uniquePatients = Array.from(
        new Map(
          allAppointments.map(appt => [
            appt.patient._id, 
            {
              _id: appt.patient._id,
              name: appt.patient.name,
              email: appt.patient.email,
              phone: appt.patient.phone,
              gender: appt.patient.gender,
              dateOfBirth: '',
              address: '',
              medicalHistory: '',
              appointment_count: 0,
              last_appointment: appt.date,
              created_at: '',
              updated_at: ''
            }
          ])
        ).values()
      );
      
      // Sort by last appointment date (most recent first)
      const sortedPatients = uniquePatients.sort((a, b) => {
        const dateA = new Date(a.last_appointment || '');
        const dateB = new Date(b.last_appointment || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      setPreviousPatients(sortedPatients);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) setDate(value);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment submission logic here
    console.log("Appointment submitted:", appointmentForm);
    setShowAppointmentModal(false);
    // Reset form
    setAppointmentForm({
      patientName: "",
      date: "",
      time: "",
      department: "",
      doctor: "",
      reason: "",
    });
  };

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter patients based on search term
  const filteredPatients = previousPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="font-bold text-xl text-gray-900">CareBot</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/doctor/dashboard" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${typeof window !== 'undefined' && window.location.pathname === '/doctor/dashboard' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                  </svg>
                </span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/doctor/dashboard/patients" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${typeof window !== 'undefined' && window.location.pathname === '/doctor/dashboard/patients' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Patients
              </Link>
            </li>
            <li>
              <Link href="/doctor/dashboard/appointments" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${typeof window !== 'undefined' && window.location.pathname === '/doctor/dashboard/appointments' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Appointments
              </Link>
            </li>
            <li>
              <Link href="/doctor/dashboard/payments" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${typeof window !== 'undefined' && window.location.pathname === '/doctor/dashboard/payments' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 11H22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Payments
              </Link>
            </li>
            <li>
              <Link href="/doctor/dashboard/notification" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${typeof window !== 'undefined' && window.location.pathname === '/doctor/dashboard/notification' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Notification
              </Link>
            </li>
            <li>
              <Link href="/" className={`flex items-center px-4 py-2 rounded-lg font-bold shadow bg-gray-100 text-black`}>
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Topbar */}
        <TopBar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onSearch={handleSearch} />
        <div className="max-w-7xl mx-auto">
          {/* Welcome and stats cards */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Patients Dashboard</h1>
              <p className="text-base text-gray-700">Overview of all patients and recent activity.</p>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">Total Patients</span>
              <span className="text-3xl font-bold mb-1">{previousPatients.length}</span>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">Male Patients</span>
              <span className="text-3xl font-bold mb-1">{previousPatients.filter(p => p.gender === 'Male').length}</span>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">Female Patients</span>
              <span className="text-3xl font-bold mb-1">{previousPatients.filter(p => p.gender === 'Female').length}</span>
            </div>
            <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">Recent Visits</span>
              <span className="text-3xl font-bold mb-1">
                {previousPatients.filter(p => {
                  if (!p.last_appointment) return false;
                  const lastVisit = new Date(p.last_appointment);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastVisit >= thirtyDaysAgo;
                }).length}
              </span>
            </div>
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Left: Recent Patients Table */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-sm min-h-[210px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold text-gray-800">Previous Patients</span>
                  <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <Link href="/dashboard/patients" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b6ffb] mx-auto mb-2"></div>
                      Loading patients...
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      {error}
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                          <th className="py-2 px-1">ID</th>
                          <th className="py-2 px-1">Name</th>
                          <th className="py-2 px-1">Email</th>
                          <th className="py-2 px-1">Phone</th>
                          <th className="py-2 px-1">Gender</th>
                          <th className="py-2 px-1">Last Visit</th>
                          <th className="py-2 px-1 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient, i) => (
                          <tr key={patient._id} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="py-2 px-1 font-mono text-gray-700">{patient._id}</td>
                            <td className="py-2 px-1 text-gray-900 font-medium">{patient.name}</td>
                            <td className="py-2 px-1 text-gray-700">{patient.email}</td>
                            <td className="py-2 px-1 text-gray-700">{patient.phone}</td>
                            <td className="py-2 px-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                patient.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                              }`}>
                                {patient.gender}
                              </span>
                            </td>
                            <td className="py-2 px-1 text-gray-700">
                              {patient.last_appointment ? new Date(patient.last_appointment).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2 px-1 text-center">
                              <Link href={`/dashboard/patients/${patient._id}`}>
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                                  View Profile
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-600 mb-2">
                        {searchTerm ? 'No patients found matching your search.' : 'No previous patients found.'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-[#7b6ffb] hover:underline text-sm"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right: Calendar Widget */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-semibold text-gray-800">BOOK & APPOINTMENT</span>
                  
                </div>
                <div className="flex flex-col items-center">
                  <style jsx global>{`
                    .react-calendar { width: 100%; border: none; background: transparent; }
                    .react-calendar__navigation { display: none; }
                    .react-calendar__month-view__weekdays { text-transform: none; font-size: 10px; color: #6B7280; margin-bottom: 4px; }
                    .react-calendar__month-view__weekdays__weekday { padding: 4px 0; }
                    .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                    .react-calendar__tile { padding: 4px 0; font-size: 12px; color: #1F2937; }
                    .react-calendar__tile--now { background: #F3F4F6; border-radius: 4px; color: #1F2937; }
                    .react-calendar__tile--active { background: #EEF2FF; color: #7B6FFB; border-radius: 4px; font-weight: 500; }
                    .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus { background: #EEF2FF; }
                    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: #F9FAFB; border-radius: 4px; }
                    .react-calendar__month-view__days__day--neighboringMonth { color: #D1D5DB; }
                    .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus { background: #E5E7EB; }
                  `}</style>
                  <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="border-none w-full"
                    tileClassName="text-xs p-1"
                    formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)}
                    minDetail="month"
                    maxDetail="month"
                    showNeighboringMonth={false}
                  />
                  <div className="w-full mt-4">
                    <button 
                      onClick={() => setShowAppointmentModal(true)}
                      className="w-full bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleAppointmentSubmit} className="space-y-5">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    value={appointmentForm.patientName}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    value={appointmentForm.department}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor</label>
                  <select
                    value={appointmentForm.doctor}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    required
                  >
                    <option value="">Select Doctor</option>
                    <option value="Dr. Rosie Pearson">Dr. Rosie Pearson</option>
                    <option value="Dr. Jasim">Dr. Jasim</option>
                    <option value="Dr. Joseph">Dr. Joseph</option>
                    <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                    <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                  </select>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit</label>
                  <textarea
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
                    rows={3}
                    placeholder="Please describe the reason for the visit"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 