"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import api, {
  DashboardStats,
  Appointment,
  authAPI,
  getDashboardStats,
  getRecentAppointments,
  Patient,
} from "@/app/services/api";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>(
    []
  );
  const [drSarahPatients, setDrSarahPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter appointments based on search term
  const filteredAppointments = recentAppointments.filter((appointment) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appointment.patient?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.name?.toLowerCase().includes(term) ||
      appointment.doctor?.specialization?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term) ||
      appointment.date?.toLowerCase().includes(term)
    );
  });

  // Filter Dr. Sarah's patients based on search term
  const filteredDrSarahPatients = drSarahPatients.filter((patient) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(term) ||
      patient.email?.toLowerCase().includes(term) ||
      patient.phone?.toLowerCase().includes(term) ||
      patient.gender?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, appointments] = await Promise.all([
          getDashboardStats(),
          getRecentAppointments(),
        ]);
        setDashboardStats(stats);
        setRecentAppointments(appointments);

        // Fetch Dr. Sarah Wilson's patients
        const allAppointments = await api.getAppointments();
        const drSarahAppointments = allAppointments.filter(
          (appt: Appointment) => appt.doctor.name === "Dr. Sarah Wilson"
        );

        // Get unique patients from Dr. Sarah's appointments
        const uniquePatients = Array.from(
          new Map(
            drSarahAppointments.map((appt) => [
              appt.patient._id,
              {
                _id: appt.patient._id,
                name: appt.patient.name,
                email: appt.patient.email,
                phone: appt.patient.phone,
                gender: appt.patient.gender,
                dateOfBirth: "",
                address: "",
                medicalHistory: "",
                appointment_count: 0,
                last_appointment: "",
                created_at: "",
                updated_at: "",
              },
            ])
          ).values()
        );

        setDrSarahPatients(uniquePatients);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
          <div className="flex items-center mb-10">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-black">CareBot</span>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-black font-bold shadow"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="currentColor"
                        fillOpacity="0.1"
                      />
                    </svg>
                  </span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/doctors"
                  className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 8L18 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 8L16 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/patients"
                  className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  Patients
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/appointments"
                  className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="8"
                        y1="2"
                        x2="8"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="21"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/payments"
                  className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Payments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
                >
                  <span className="mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.73 21A2 2 0 0 1 10.27 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Notifications
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <Link
              href="/logout"
              className="flex items-center px-4 py-2 rounded-lg text-black font-normal hover:bg-[rgba(113,97,239,0.6)]"
            >
              <span className="mr-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="16,17 21,12 16,7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="21"
                    y1="12"
                    x2="9"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Logout
            </Link>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
          <TopBar user={currentUser} onSearch={handleSearch} />
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome, {currentUser?.username || "Admin"}!
              </h1>
              <p className="text-base text-gray-600">
                Here are your most recent appointments.
              </p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-4 text-white shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3.5"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    </svg>
                    Total Patients
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">
                    {dashboardStats?.total_patients || 0}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-4 text-white shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Total Doctors
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">
                    {dashboardStats?.total_doctors || 0}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-4 text-white shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Total Appointments
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">
                    {dashboardStats?.total_appointments || 0}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-4 text-white shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold">
                    {dashboardStats?.completed_appointments || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1 space-y-6">
                {/* Recent Appointments */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Appointments
                    </h2>
                    <Link
                      href="/dashboard/appointments"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {appointment.patient.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {appointment.patient.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {appointment.doctor.name} • {appointment.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {appointment.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.time}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                statusColors[
                                  appointment.status as keyof typeof statusColors
                                ] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No recent appointments found.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Patients - Dr. Sarah Wilson */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Dr. Sarah Wilson's Patients
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Recent patients under Dr. Sarah Wilson's care
                      </p>
                    </div>
                    <Link
                      href="/dashboard/patients"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Patients
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredDrSarahPatients.length > 0 ? (
                      filteredDrSarahPatients.map((patient) => (
                        <Link
                          key={patient._id}
                          href={`/dashboard/patients/${patient._id}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {patient.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {patient.name}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                {patient.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {patient.gender}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  {patient.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600">
                          No patients found for Dr. Sarah Wilson
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Patients will appear here once they have appointments
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar - Admin Profile */}
              <aside className="hidden lg:block w-full lg:w-80 sticky top-8 self-start">
                <div 
                  className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowAdminModal(true)}
                >
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src="https://randomuser.me/api/portraits/men/34.jpg"
                      alt="Admin Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                    <h3 className="text-lg font-bold text-gray-900">
                      {currentUser?.username || "Admin"}, MD
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      System Administrator
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Click to view details</p>
                  </div>

                  <div className="grid grid-cols-3 text-center my-4">
                    <div>
                      <div className="text-gray-500 text-xs">Appointments</div>
                      <div className="text-lg font-bold text-gray-900">
                        {dashboardStats?.total_appointments || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">
                        Total Patients
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {dashboardStats?.total_patients || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Doctors</div>
                      <div className="text-lg font-bold text-gray-900">
                        {dashboardStats?.total_doctors || 0}
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-base font-bold text-gray-900">
                        Quick Actions
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/dashboard/doctors"
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            Manage Doctors
                          </span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </Link>
                      <Link
                        href="/dashboard/patients"
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            View Patients
                          </span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </Link>
                      <Link
                        href="/dashboard/appointments"
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            Appointments
                          </span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Details</h2>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <Image
                  src="https://randomuser.me/api/portraits/men/34.jpg"
                  alt="Admin Profile"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentUser?.username || "Admin"}, MD
                </h3>
                <p className="text-gray-600 mb-2">System Administrator</p>
                <p className="text-sm text-gray-500">{currentUser?.email || "admin@hospital.com"}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">System Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardStats?.total_appointments || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Appointments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardStats?.total_patients || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Patients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardStats?.total_doctors || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Doctors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboardStats?.completed_appointments || 0}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Admin Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">System Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">Administration</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Level:</span>
                      <span className="font-medium text-green-600">Full Access</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="font-medium">Today</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard/doctors"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAdminModal(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-700">Manage Doctors</span>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </Link>
                    <Link
                      href="/dashboard/patients"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAdminModal(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-700">View Patients</span>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </Link>
                    <Link
                      href="/dashboard/appointments"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAdminModal(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-700">Appointments</span>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
