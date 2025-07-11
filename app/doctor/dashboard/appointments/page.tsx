"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authAPI } from '@/app/services/api';
import TopBar from '@/components/TopBar';
import DoctorSidebar from '@/app/doctor/components/DoctorSidebar';
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Appointment() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentStatusFilter, setRecentStatusFilter] = useState('All');
  const [nextWeekStatusFilter, setNextWeekStatusFilter] = useState('All');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Add sample data for demonstration
  const recentAppointments = [
    { name: "Floyd Miles", visitId: "OPD-1", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "Out-Patient" },
    { name: "Floyd Miles", visitId: "OPD-32", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "Pending" },
    { name: "Floyd Miles", visitId: "OPD-123", date: "12.09.2019", gender: "Male", disease: "Diabetes", status: "In-Patient" },
  ];
  const nextWeekAppointments = [
    { name: "Jane Doe", visitId: "OPD-200", date: "19.09.2019", gender: "Female", disease: "Hypertension", status: "Scheduled" },
    { name: "John Smith", visitId: "OPD-201", date: "20.09.2019", gender: "Male", disease: "Asthma", status: "Scheduled" },
  ];

  const statusOptionsRecent = ['All', 'Out-Patient', 'Pending', 'In-Patient'];
  const statusOptionsNextWeek = ['All', 'Scheduled'];

  const [recentAppointmentsState, setRecentAppointmentsState] = useState(recentAppointments);
  const [nextWeekAppointmentsState, setNextWeekAppointmentsState] = useState(nextWeekAppointments);

  // Sample doctor info
  const doctorProfile = {
    name: 'Dr. Noob',
    email: 'noob@carebot.com',
    role: 'Admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const handleStatusChange = (type: 'recent' | 'next', visitId: string, newStatus: string) => {
    if (type === 'recent') {
      setRecentAppointmentsState(prev => prev.map(a => a.visitId === visitId ? { ...a, status: newStatus } : a));
    } else {
      setNextWeekAppointmentsState(prev => prev.map(a => a.visitId === visitId ? { ...a, status: newStatus } : a));
    }
  };

  const handleAction = (type: 'recent' | 'next', visitId: string, action: string) => {
    if (action === 'Approve') {
      handleStatusChange(type, visitId, type === 'recent' ? 'In-Patient' : 'Scheduled');
    } else if (action === 'Decline') {
      handleStatusChange(type, visitId, 'Declined');
    } else if (action === 'View') {
      // Find the patient in the correct state array
      const arr = type === 'recent' ? recentAppointmentsState : nextWeekAppointmentsState;
      const patient = arr.find(a => a.visitId === visitId);
      setSelectedPatient(patient);
      setShowPatientModal(true);
    }
  };

  const filteredRecentAppointments = recentStatusFilter === 'All'
    ? recentAppointmentsState
    : recentAppointmentsState.filter(a => a.status === recentStatusFilter);
  const filteredNextWeekAppointments = nextWeekStatusFilter === 'All'
    ? nextWeekAppointmentsState
    : nextWeekAppointmentsState.filter(a => a.status === nextWeekStatusFilter);

  // Apply search filtering
  const searchFilteredRecentAppointments = filteredRecentAppointments.filter(appointment => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appointment.name?.toLowerCase().includes(term) ||
      appointment.visitId?.toLowerCase().includes(term) ||
      appointment.date?.toLowerCase().includes(term) ||
      appointment.gender?.toLowerCase().includes(term) ||
      appointment.disease?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term)
    );
  });

  const searchFilteredNextWeekAppointments = filteredNextWeekAppointments.filter(appointment => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appointment.name?.toLowerCase().includes(term) ||
      appointment.visitId?.toLowerCase().includes(term) ||
      appointment.date?.toLowerCase().includes(term) ||
      appointment.gender?.toLowerCase().includes(term) ||
      appointment.disease?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term)
    );
  });

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen min-w-[1200px] bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <DoctorSidebar />
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Top bar */}
        <TopBar onSearch={handleSearch} />
        {/* Welcome Card */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Welcome back, {currentUser?.username || "Doctor"}
            </h1>
            <p className="text-base text-gray-700">Manage your appointments and patient schedules efficiently.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#f3f4f6] text-[#7b6ffb] font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#e5e7eb]">Export data</button>
            <button className="bg-[#7b6ffb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#5a8dee]">Create report</button>
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Recent Appointments */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb]"
                    value={recentStatusFilter}
                    onChange={e => setRecentStatusFilter(e.target.value)}
                  >
                    {statusOptionsRecent.map(opt => (
                      <option key={`recent-${opt}`} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                        <th className="py-2 px-1">Patient</th>
                        <th className="py-2 px-1">Visit Id</th>
                        <th className="py-2 px-1">Date</th>
                        <th className="py-2 px-1">Gender</th>
                        <th className="py-2 px-1">Diseases</th>
                        <th className="py-2 px-1">Status</th>
                        <th className="py-2 px-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchFilteredRecentAppointments.map((a, i) => (
                        <tr key={`recent-${a.visitId}`} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="py-2 px-1 flex items-center gap-2">
                            <img src={`https://randomuser.me/api/portraits/men/${i+30}.jpg`} alt={a.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-gray-900 font-medium text-xs">{a.name}</span>
                          </td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.visitId}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.date}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.gender}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.disease}</td>
                          <td className="py-2 px-1 text-xs font-medium">
                            <select
                              className={`px-2 py-0.5 rounded-full text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] ${a.status === "Out-Patient" ? "bg-blue-100 text-blue-600" : a.status === "Pending" ? "bg-yellow-100 text-yellow-600" : a.status === "In-Patient" ? "bg-green-100 text-green-600" : a.status === "Scheduled" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}
                              value={a.status}
                              onChange={e => handleStatusChange('recent', a.visitId, e.target.value)}
                            >
                              {statusOptionsRecent.map(opt => (
                                <option key={`recent-${opt}`} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-1">
                            <select
                              className="px-2 py-1 rounded text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] text-gray-700"
                              onChange={e => handleAction('recent', a.visitId, e.target.value)}
                              value=""
                            >
                              <option value="" disabled className="text-gray-400">Select Action</option>
                              {a.status === 'Pending' && <option value="Approve">Approve</option>}
                              {a.status === 'Pending' && <option value="Decline">Decline</option>}
                              <option value="View">View</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Next Week Appointments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Next Week Appointments</h2>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb]"
                    value={nextWeekStatusFilter}
                    onChange={e => setNextWeekStatusFilter(e.target.value)}
                  >
                    {statusOptionsNextWeek.map(opt => (
                      <option key={`nextweek-${opt}`} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                        <th className="py-2 px-1">Patient</th>
                        <th className="py-2 px-1">Visit Id</th>
                        <th className="py-2 px-1">Date</th>
                        <th className="py-2 px-1">Gender</th>
                        <th className="py-2 px-1">Diseases</th>
                        <th className="py-2 px-1">Status</th>
                        <th className="py-2 px-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchFilteredNextWeekAppointments.map((a, i) => (
                        <tr key={`nextweek-${a.visitId}`} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="py-2 px-1 flex items-center gap-2">
                            <img src={`https://randomuser.me/api/portraits/men/${i+40}.jpg`} alt={a.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-gray-900 font-medium text-xs">{a.name}</span>
                          </td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.visitId}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.date}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.gender}</td>
                          <td className="py-2 px-1 text-gray-600 text-xs">{a.disease}</td>
                          <td className="py-2 px-1 text-xs font-medium">
                            <select
                              className={`px-2 py-0.5 rounded-full text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] ${a.status === "Out-Patient" ? "bg-blue-100 text-blue-600" : a.status === "Pending" ? "bg-yellow-100 text-yellow-600" : a.status === "In-Patient" ? "bg-green-100 text-green-600" : a.status === "Scheduled" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"}`}
                              value={a.status}
                              onChange={e => handleStatusChange('next', a.visitId, e.target.value)}
                            >
                              {statusOptionsNextWeek.map(opt => (
                                <option key={`nextweek-${opt}`} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-1">
                            <select
                              className="px-2 py-1 rounded text-xs border focus:ring-2 focus:ring-[#7b6ffb] focus:border-[#7b6ffb] text-gray-700"
                              onChange={e => handleAction('next', a.visitId, e.target.value)}
                              value=""
                            >
                              <option value="" disabled className="text-gray-400">Select Action</option>
                              {a.status === 'Scheduled' && <option value="Approve">Approve</option>}
                              {a.status === 'Scheduled' && <option value="Decline">Decline</option>}
                              <option value="View">View</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-[modalIn_0.2s_ease]">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-4">
              <img src={doctorProfile.avatar} alt={doctorProfile.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#7b6ffb] shadow" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{doctorProfile.name}</h2>
                <p className="text-gray-500 text-sm mb-1">{doctorProfile.email}</p>
                <span className="inline-block bg-[#f3f4f6] text-[#7b6ffb] px-3 py-1 rounded-full text-xs font-semibold">{doctorProfile.role}</span>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.96); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-[modalIn_0.2s_ease]">
            <button
              onClick={() => setShowPatientModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7b6ffb]"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-4">
              <img src={`https://randomuser.me/api/portraits/men/31.jpg`} alt={selectedPatient.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#7b6ffb] shadow" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedPatient.name}</h2>
                <div className="text-gray-500 text-sm mb-1">Visit ID: {selectedPatient.visitId}</div>
                <div className="text-gray-500 text-sm mb-1">Date: {selectedPatient.date}</div>
                <div className="text-gray-500 text-sm mb-1">Gender: {selectedPatient.gender}</div>
                <div className="text-gray-500 text-sm mb-1">Disease: {selectedPatient.disease}</div>
                <div className="text-gray-500 text-sm mb-1">Status: <span className="font-semibold text-[#7b6ffb]">{selectedPatient.status}</span></div>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.96); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}