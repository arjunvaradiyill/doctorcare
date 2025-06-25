"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { appointmentsAPI, Appointment, authAPI } from '@/app/services/api';
import TopBar from '@/components/TopBar';
import DoctorSidebar from '@/app/doctor/components/DoctorSidebar';

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
    bookingId: '',
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    department: '',
    reason: '',
  });
  const [appointmentRequests, setAppointmentRequests] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment submission logic here
    setShowAppointmentModal(false);
    setAppointmentForm({
      bookingId: '',
      patientId: '',
      patientName: '',
      doctorId: '',
      doctorName: '',
      date: '',
      time: '',
      department: '',
      reason: '',
    });
  };

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter appointments based on search term
  const filteredAppointmentRequests = appointmentRequests.filter(appointment => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appointment.patient?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.specialization?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term) ||
      appointment.date?.toLowerCase().includes(term) ||
      appointment.time?.toLowerCase().includes(term)
    );
  });

  const filteredRecentAppointments = recentAppointments.filter(appointment => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appointment.patient?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.specialization?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term) ||
      appointment.date?.toLowerCase().includes(term) ||
      appointment.time?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user information
        const user = authAPI.getCurrentUser();
        setCurrentUser(user);
        
        // Fetch appointment requests (pending)
        const pendingRes = await appointmentsAPI.getAppointments({ status: 'pending' });
        setAppointmentRequests(pendingRes.appointments || pendingRes);
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
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="w-full border-0"
                tileClassName={({ date: tileDate }) => {
                  const hasAppointment = todaysAppointments.some(app => 
                    new Date(app.date).toDateString() === tileDate.toDateString()
                  );
                  return hasAppointment ? 'bg-[#7b6ffb] text-white rounded-full' : '';
                }}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Modal for Create New Report */}
      {showCreateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
            {/* Tab Header */}
            <div className="flex items-center px-8 pt-8 pb-2 border-b border-gray-100">
              <span className="text-lg font-semibold text-gray-900 mr-8 pb-2 border-b-2 border-[#3B36F4]">Create New Report</span>
            </div>
            {/* Form */}
            <form className="px-8 pt-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Report Name</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="charlenereed@gmail.com" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Doctor Name</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="Charlene Reed" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Date</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="DD/MM/YYY" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Department</label>
                <input type="text" className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]" placeholder="Charlene Reed" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Description</label>
                <textarea className="rounded-xl border border-gray-200 bg-[#FAFAFB] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] min-h-[80px] resize-none" placeholder="charlenereed@gmail.com" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-gray-900 font-medium text-sm mb-1">Report</label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-[#FAFAFB] px-2 py-6 cursor-pointer hover:border-[#7b6ffb] transition min-h-[120px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-8 h-8 text-[#7b6ffb] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16V4M12 4l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="16" width="16" height="4" rx="2"/></svg>
                  <span className="text-[#3B36F4] font-medium text-sm mb-1">Click to Upload</span>
                  <span className="text-gray-600 text-xs">or drag and drop</span>
                  <span className="text-gray-500 text-xs mt-1">(Max. File size: 25 MB)</span>
                  <input ref={fileInputRef} type="file" className="hidden" />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col md:flex-row justify-end mt-2 gap-2">
                <button type="button" className="bg-[#3B36F4] hover:bg-[#2e2bbd] text-white font-semibold w-full md:w-auto px-10 py-3 rounded-2xl text-lg shadow transition" onClick={() => setShowCreateReportModal(false)}>
                  Save
                </button>
              </div>
            </form>
            {/* Close on overlay click */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
              onClick={() => setShowCreateReportModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 p-8 animate-[modalIn_0.2s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Appointment</h2>
                <p className="text-sm text-gray-600 mt-1">Schedule a new patient appointment</p>
              </div>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              {/* First Row - Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Booking ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400"
                      placeholder="Enter booking ID"
                      value={appointmentForm.bookingId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, bookingId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Patient ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400"
                      placeholder="Enter patient ID"
                      value={appointmentForm.patientId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400"
                      placeholder="Enter patient name"
                      value={appointmentForm.patientName}
                      onChange={e => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Second Row - Doctor Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Doctor ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400"
                      placeholder="Enter doctor ID"
                      value={appointmentForm.doctorId || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base appearance-none"
                      value={appointmentForm.doctorName || ''}
                      onChange={e => setAppointmentForm({ ...appointmentForm, doctorName: e.target.value })}
                      required
                    >
                      <option value="" className="text-gray-400">Select Doctor</option>
                      <option value="Dr. John Smith" className="text-gray-900">Dr. John Smith</option>
                      <option value="Dr. Sarah Johnson" className="text-gray-900">Dr. Sarah Johnson</option>
                      <option value="Dr. Michael Brown" className="text-gray-900">Dr. Michael Brown</option>
                      <option value="Dr. Emily Davis" className="text-gray-900">Dr. Emily Davis</option>
                      <option value="Dr. David Wilson" className="text-gray-900">Dr. David Wilson</option>
                      <option value="Dr. Lisa Anderson" className="text-gray-900">Dr. Lisa Anderson</option>
                      <option value="Dr. Robert Taylor" className="text-gray-900">Dr. Robert Taylor</option>
                      <option value="Dr. Jennifer Martinez" className="text-gray-900">Dr. Jennifer Martinez</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base appearance-none placeholder-gray-400"
                      value={appointmentForm.department}
                      onChange={e => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                      required
                    >
                      <option value="" className="text-gray-400">Select Department</option>
                      <option value="General Medicine" className="text-gray-900">General Medicine</option>
                      <option value="Cardiology" className="text-gray-900">Cardiology</option>
                      <option value="Neurology" className="text-gray-900">Neurology</option>
                      <option value="Pediatrics" className="text-gray-900">Pediatrics</option>
                      <option value="Orthopedics" className="text-gray-900">Orthopedics</option>
                      <option value="Dermatology" className="text-gray-900">Dermatology</option>
                      <option value="Emergency" className="text-gray-900">Emergency</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Third Row - Time and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base"
                    value={appointmentForm.time}
                    onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    required
                  />
                </div>

                {/* Consultation Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base"
                    value={appointmentForm.date}
                    onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Fourth Row - Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Consultation</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] transition-all text-base placeholder-gray-400 resize-none min-h-[100px]"
                  value={appointmentForm.reason}
                  onChange={e => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  placeholder="Describe the reason for the consultation, patient symptoms, or any relevant medical information..."
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#7b6ffb] text-white rounded-xl font-semibold hover:bg-[#6a5de8] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Book Appointment
                  </div>
                </button>
              </div>
            </form>

            <style jsx>{`
              @keyframes modalIn {
                0% { opacity: 0; transform: scale(0.96); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}