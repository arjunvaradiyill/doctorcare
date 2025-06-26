"use client";
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { appointmentsAPI, Appointment, authAPI } from '@/app/services/api';
import TopBar from '@/components/TopBar';
import DoctorSidebar from '@/app/doctor/components/DoctorSidebar';

// Book Appointment Modal Context
const BookAppointmentModalContext = createContext<any>(null);

export function useBookAppointmentModal() {
  return useContext(BookAppointmentModalContext);
}

function BookAppointmentModalProvider({ children }: { children: React.ReactNode }) {
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    date: '',
    time: '',
    department: '',
    doctor: '',
    reason: '',
  });
  const openBookAppointmentModal = (patient?: any) => {
    setShowBookAppointmentModal(true);
    setAppointmentForm({
      patientName: patient?.name || '',
      date: '',
      time: '',
      department: '',
      doctor: '',
      reason: '',
    });
  };
  const closeBookAppointmentModal = () => setShowBookAppointmentModal(false);

  return (
    <BookAppointmentModalContext.Provider value={{ showBookAppointmentModal, openBookAppointmentModal, closeBookAppointmentModal, appointmentForm, setAppointmentForm }}>
      {children}
      {showBookAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
            {/* Modal Header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
                <button
                  onClick={closeBookAppointmentModal}
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
              <form onSubmit={e => { e.preventDefault(); closeBookAppointmentModal(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    value={appointmentForm.patientName}
                    onChange={e => setAppointmentForm(f => ({ ...f, patientName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={appointmentForm.date}
                      onChange={e => setAppointmentForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={appointmentForm.time}
                      onChange={e => setAppointmentForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    value={appointmentForm.department}
                    onChange={e => setAppointmentForm(f => ({ ...f, department: e.target.value }))}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor</label>
                  <select
                    value={appointmentForm.doctor}
                    onChange={e => setAppointmentForm(f => ({ ...f, doctor: e.target.value }))}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit</label>
                  <textarea
                    value={appointmentForm.reason}
                    onChange={e => setAppointmentForm(f => ({ ...f, reason: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all resize-none"
                    rows={3}
                    placeholder="Please describe the reason for the visit"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeBookAppointmentModal}
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
    </BookAppointmentModalContext.Provider>
  );
}

// Inner component that uses the context
function DoctorDashboardContent() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    date: '',
    time: '',
    department: '',
    doctor: '',
    reason: '',
  });
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ recipient: '', message: '' });

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter data based on search term
  const filteredAppointmentRequests = appointmentRequests.filter(req =>
    req.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.patient?.gender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecentAppointments = recentAppointments.filter(appointment =>
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current user
        const userRes = await authAPI.getCurrentUser();
        setCurrentUser(userRes.user || userRes);
        // Fetch appointment requests (limit 3)
        const requestsRes = await appointmentsAPI.getAppointmentRequests({ limit: 3 });
        setAppointmentRequests(requestsRes.appointments || requestsRes);
        // Fetch today's appointments
        const todayRes = await appointmentsAPI.getTodayAppointments();
        setTodaysAppointments(todayRes.appointments || todayRes);
        // Fetch recent appointments (limit 5)
        const recentRes = await appointmentsAPI.getAppointments({ limit: 5 });
        setRecentAppointments(recentRes.appointments || recentRes);
      } catch (err) {
        setError('Failed to fetch appointment data');
        console.error('Error fetching doctor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen min-w-[1200px] bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <DoctorSidebar />
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Top bar */}
        <div className="mb-6">
          <TopBar onSearch={handleSearch} />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.username || "Doctor"}
            </h1>
            <p className="text-base text-gray-600">Here's what's happening with your practice today.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-[#7b6ffb] font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 border border-gray-200 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </div>
            </button>
            <button
              className="bg-[#7b6ffb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-[#6a5de8] transition-all"
              onClick={() => setShowCreateReportModal(true)}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Report
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold">50.8K</p>
                <p className="text-xs opacity-75 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Patients</p>
                <p className="text-3xl font-bold">123.6K</p>
                <p className="text-xs opacity-75 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Clinic Consulting</p>
                <p className="text-3xl font-bold">75.6K</p>
                <p className="text-xs opacity-75 mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Hours</p>
                <p className="text-3xl font-bold">12 hr</p>
                <p className="text-xs opacity-75 mt-1">Today's schedule</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <span className="text-sm text-gray-500">Manage your practice</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#7b6ffb] to-[#6a5de8] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Book Appointment</p>
                    <p className="text-sm opacity-90">Schedule new patient visit</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowSendMessageModal(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#a996fd] to-[#7b6ffb] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m16-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Send Message</p>
                    <p className="text-sm opacity-90">Message a patient or staff</p>
                  </div>
                </button>
                <Link href="/doctor/dashboard/patients" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                  <div className="w-10 h-10 bg-[#7b6ffb] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">View Patients</p>
                    <p className="text-sm text-gray-600">Manage patient records</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Appointment Requests Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Requests</h2>
                  <p className="text-sm text-gray-500">Pending approvals</p>
                </div>
                <Link href="/doctor/appointment-requests" className="text-[#7b6ffb] font-medium text-sm hover:underline flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-3">
                {filteredAppointmentRequests.length > 0 ? (
                  filteredAppointmentRequests.map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={req.patient?.name || 'Patient'} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{req.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-600">{req.patient?.gender || 'N/A'} • {req.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {req.status}
                        </span>
                        <button className="text-gray-400 hover:text-[#7b6ffb] p-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No pending appointment requests</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Appointments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
                  <p className="text-sm text-gray-500">Latest patient visits</p>
                </div>
                <Link href="/doctor/dashboard/appointments" className="text-[#7b6ffb] font-medium text-sm hover:underline flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-3">
                {filteredRecentAppointments.length > 0 ? (
                  filteredRecentAppointments.map((appointment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={`https://randomuser.me/api/portraits/women/${i+20}.jpg`} alt={appointment.patient?.name || 'Patient'} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-600">{appointment.type || 'Consultation'} • {appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "completed" ? "bg-green-100 text-green-700" :
                          appointment.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {appointment.status}
                        </span>
                        <button className="text-gray-400 hover:text-[#7b6ffb] p-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No recent appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>
              </div>
              <div className="space-y-3">
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#7b6ffb] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{appointment.patient?.name || 'Unknown Patient'}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "completed" ? "bg-green-100 text-green-700" :
                        appointment.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No appointments today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
              <h2 className="text-2xl font-extrabold text-[#181C32] mb-6 w-full text-left">Calendar</h2>
              <div className="w-full max-w-md mx-auto">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="minimal-calendar w-full border-0 bg-transparent"
                  prevLabel={<span className="text-[#7b6ffb] font-bold text-2xl">‹</span>}
                  nextLabel={<span className="text-[#7b6ffb] font-bold text-2xl">›</span>}
                  navigationLabel={({ date, label }) => (
                    <span className="text-xl font-extrabold text-[#181C32] tracking-wide">{label}</span>
                  )}
                  formatShortWeekday={(_, date) => date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,2)}
                  tileClassName={({ date: tileDate }) => {
                    const isSelected = tileDate.toDateString() === new Date(date).toDateString();
                    return [
                      isSelected ? 'calendar-minimal-selected' : '',
                      'calendar-minimal-tile'
                    ].join(' ');
                  }}
                  tileContent={() => null}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Send Message Modal */}
        {showSendMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md relative flex flex-col items-stretch">
              <button
                className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowSendMessageModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="px-10 pt-10 pb-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-[#7b6ffb] rounded-full"></div>
                  <h2 className="text-2xl font-extrabold text-black text-left">Send Message</h2>
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setShowSendMessageModal(false);
                    setMessageForm({ recipient: '', message: '' });
                  }}
                  className="w-full flex flex-col gap-7"
                >
                  <div>
                    <label className="block text-gray-500 text-base mb-2" htmlFor="recipient">Recipient</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a996fd]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 10.5V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v10.5A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V13.5" stroke="#a996fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.25 8.25 12 13.5l-5.25-5.25" stroke="#a996fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <input
                        id="recipient"
                        name="recipient"
                        value={messageForm.recipient}
                        onChange={e => setMessageForm(f => ({ ...f, recipient: e.target.value }))}
                        placeholder="Enter recipient name or email"
                        className="w-full border border-[#a996fd] rounded-full pl-12 pr-4 py-3 text-black text-lg font-medium focus:ring-2 focus:ring-[#7b6ffb] outline-none bg-[#f7f8fa]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-base mb-2" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={messageForm.message}
                      onChange={e => setMessageForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Type your message..."
                      rows={6}
                      className="w-full border border-[#a996fd] rounded-2xl px-4 py-4 text-black text-lg font-medium focus:ring-2 focus:ring-[#7b6ffb] outline-none resize-none bg-[#f7f8fa]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-[#7b6ffb] text-white text-lg font-bold shadow hover:bg-[#5B7CFA] transition"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="w-full py-3 rounded-full border border-gray-300 text-black text-lg font-semibold hover:bg-gray-50 transition"
                      onClick={() => setShowSendMessageModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Main export that wraps the content with the provider
export default function DoctorDashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    date: '',
    time: '',
    department: '',
    doctor: '',
    reason: '',
  });
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ recipient: '', message: '' });

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter data based on search term
  const filteredAppointmentRequests = appointmentRequests.filter(req =>
    req.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.patient?.gender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecentAppointments = recentAppointments.filter(appointment =>
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current user
        const userRes = await authAPI.getCurrentUser();
        setCurrentUser(userRes.user || userRes);
        // Fetch appointment requests (limit 3)
        const requestsRes = await appointmentsAPI.getAppointmentRequests({ limit: 3 });
        setAppointmentRequests(requestsRes.appointments || requestsRes);
        // Fetch today's appointments
        const todayRes = await appointmentsAPI.getTodayAppointments();
        setTodaysAppointments(todayRes.appointments || todayRes);
        // Fetch recent appointments (limit 5)
        const recentRes = await appointmentsAPI.getAppointments({ limit: 5 });
        setRecentAppointments(recentRes.appointments || recentRes);
      } catch (err) {
        setError('Failed to fetch appointment data');
        console.error('Error fetching doctor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen min-w-[1200px] bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <DoctorSidebar />
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Top bar */}
        <div className="mb-6">
          <TopBar onSearch={handleSearch} />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.username || "Doctor"}
            </h1>
            <p className="text-base text-gray-600">Here's what's happening with your practice today.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-[#7b6ffb] font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 border border-gray-200 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </div>
            </button>
            <button
              className="bg-[#7b6ffb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-[#6a5de8] transition-all"
              onClick={() => setShowCreateReportModal(true)}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create Report
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold">50.8K</p>
                <p className="text-xs opacity-75 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Patients</p>
                <p className="text-3xl font-bold">123.6K</p>
                <p className="text-xs opacity-75 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Clinic Consulting</p>
                <p className="text-3xl font-bold">75.6K</p>
                <p className="text-xs opacity-75 mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#7b6ffb] to-[#6a5de8] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Hours</p>
                <p className="text-3xl font-bold">12 hr</p>
                <p className="text-xs opacity-75 mt-1">Today's schedule</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <span className="text-sm text-gray-500">Manage your practice</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#7b6ffb] to-[#6a5de8] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Book Appointment</p>
                    <p className="text-sm opacity-90">Schedule new patient visit</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowSendMessageModal(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#a996fd] to-[#7b6ffb] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m16-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Send Message</p>
                    <p className="text-sm opacity-90">Message a patient or staff</p>
                  </div>
                </button>
                <Link href="/doctor/dashboard/patients" className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                  <div className="w-10 h-10 bg-[#7b6ffb] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">View Patients</p>
                    <p className="text-sm text-gray-600">Manage patient records</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Appointment Requests Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Requests</h2>
                  <p className="text-sm text-gray-500">Pending approvals</p>
                </div>
                <Link href="/doctor/appointment-requests" className="text-[#7b6ffb] font-medium text-sm hover:underline flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-3">
                {filteredAppointmentRequests.length > 0 ? (
                  filteredAppointmentRequests.map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={req.patient?.name || 'Patient'} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{req.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-600">{req.patient?.gender || 'N/A'} • {req.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {req.status}
                        </span>
                        <button className="text-gray-400 hover:text-[#7b6ffb] p-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No pending appointment requests</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Appointments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
                  <p className="text-sm text-gray-500">Latest patient visits</p>
                </div>
                <Link href="/doctor/dashboard/appointments" className="text-[#7b6ffb] font-medium text-sm hover:underline flex items-center gap-1">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-3">
                {filteredRecentAppointments.length > 0 ? (
                  filteredRecentAppointments.map((appointment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={`https://randomuser.me/api/portraits/women/${i+20}.jpg`} alt={appointment.patient?.name || 'Patient'} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-600">{appointment.type || 'Consultation'} • {appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "completed" ? "bg-green-100 text-green-700" :
                          appointment.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {appointment.status}
                        </span>
                        <button className="text-gray-400 hover:text-[#7b6ffb] p-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No recent appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>
              </div>
              <div className="space-y-3">
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#7b6ffb] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{appointment.patient?.name || 'Unknown Patient'}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "completed" ? "bg-green-100 text-green-700" :
                        appointment.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No appointments today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
              <h2 className="text-2xl font-extrabold text-[#181C32] mb-6 w-full text-left">Calendar</h2>
              <div className="w-full max-w-md mx-auto">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="minimal-calendar w-full border-0 bg-transparent"
                  prevLabel={<span className="text-[#7b6ffb] font-bold text-2xl">‹</span>}
                  nextLabel={<span className="text-[#7b6ffb] font-bold text-2xl">›</span>}
                  navigationLabel={({ date, label }) => (
                    <span className="text-xl font-extrabold text-[#181C32] tracking-wide">{label}</span>
                  )}
                  formatShortWeekday={(_, date) => date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,2)}
                  tileClassName={({ date: tileDate }) => {
                    const isSelected = tileDate.toDateString() === new Date(date).toDateString();
                    return [
                      isSelected ? 'calendar-minimal-selected' : '',
                      'calendar-minimal-tile'
                    ].join(' ');
                  }}
                  tileContent={() => null}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Send Message Modal */}
        {showSendMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md relative flex flex-col items-stretch">
              <button
                className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowSendMessageModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="px-10 pt-10 pb-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-[#7b6ffb] rounded-full"></div>
                  <h2 className="text-2xl font-extrabold text-black text-left">Send Message</h2>
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setShowSendMessageModal(false);
                    setMessageForm({ recipient: '', message: '' });
                  }}
                  className="w-full flex flex-col gap-7"
                >
                  <div>
                    <label className="block text-gray-500 text-base mb-2" htmlFor="recipient">Recipient</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a996fd]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 10.5V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75v10.5A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V13.5" stroke="#a996fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.25 8.25 12 13.5l-5.25-5.25" stroke="#a996fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <input
                        id="recipient"
                        name="recipient"
                        value={messageForm.recipient}
                        onChange={e => setMessageForm(f => ({ ...f, recipient: e.target.value }))}
                        placeholder="Enter recipient name or email"
                        className="w-full border border-[#a996fd] rounded-full pl-12 pr-4 py-3 text-black text-lg font-medium focus:ring-2 focus:ring-[#7b6ffb] outline-none bg-[#f7f8fa]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-base mb-2" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={messageForm.message}
                      onChange={e => setMessageForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Type your message..."
                      rows={6}
                      className="w-full border border-[#a996fd] rounded-2xl px-4 py-4 text-black text-lg font-medium focus:ring-2 focus:ring-[#7b6ffb] outline-none resize-none bg-[#f7f8fa]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-[#7b6ffb] text-white text-lg font-bold shadow hover:bg-[#5B7CFA] transition"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="w-full py-3 rounded-full border border-gray-300 text-black text-lg font-semibold hover:bg-gray-50 transition"
                      onClick={() => setShowSendMessageModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 