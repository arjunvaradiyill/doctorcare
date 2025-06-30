"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import api, { Appointment, authAPI } from "@/app/services/api";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const statusColors: { [key: string]: string } = {
  completed: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
  "in transit": "bg-purple-100 text-purple-700",
  "on hold": "bg-yellow-100 text-yellow-700",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterPatient, setFilterPatient] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Get unique values for dropdowns
  const uniqueDates = Array.from(
    new Set(appointments.map((a) => new Date(a.date).toLocaleDateString()))
  );
  const uniquePatients = Array.from(
    new Set(appointments.map((a) => a.patient?.name))
  );
  const uniqueDoctors = Array.from(
    new Set(appointments.map((a) => a.doctor?.name))
  );
  const uniqueDepartments = Array.from(
    new Set(appointments.map((a) => a.doctor?.specialization))
  );
  const uniqueStatuses = Array.from(new Set(appointments.map((a) => a.status)));

  // Filtering logic
  const filteredAppointments = appointments.filter((a) => {
    // Search term filtering
    const searchMatch =
      !searchTerm ||
      (a.patient?.name &&
        a.patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.doctor?.name &&
        a.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.doctor?.specialization &&
        a.doctor.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (a.status && a.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.date && a.date.toLowerCase().includes(searchTerm.toLowerCase()));

    // Dropdown filters
    const dateMatch =
      !filterDate || new Date(a.date).toLocaleDateString() === filterDate;
    const patientMatch = !filterPatient || a.patient?.name === filterPatient;
    const doctorMatch = !filterDoctor || a.doctor?.name === filterDoctor;
    const departmentMatch =
      !filterDepartment || a.doctor?.specialization === filterDepartment;
    const statusMatch = !filterStatus || a.status === filterStatus;

    return (
      searchMatch &&
      dateMatch &&
      patientMatch &&
      doctorMatch &&
      departmentMatch &&
      statusMatch
    );
  });

  const resetFilters = () => {
    setFilterDate("");
    setFilterPatient("");
    setFilterDoctor("");
    setFilterDepartment("");
    setFilterStatus("");
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getAppointments();
        setAppointments(data);
      } catch (err) {
        setError("Failed to fetch appointments data");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading appointments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
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
                Patient
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/appointments"
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
                Appointment
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:3001/"
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
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        <TopBar user={currentUser} onSearch={handleSearch} />
        
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 mt-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome back, {currentUser?.username}!
            </h1>
            <p className="text-base text-gray-600">
              Manage your appointments and scheduling efficiently.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Appointments
                  </p>
                  <p className="text-3xl font-bold">{appointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Completed
                  </p>
                  <p className="text-3xl font-bold">
                    {
                      appointments.filter(
                        (a) => a.status.toLowerCase() === "completed"
                      ).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">
                    {
                      appointments.filter(
                        (a) => a.status.toLowerCase() === "pending"
                      ).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold">
                    {
                      appointments.filter((a) => {
                        const today = new Date().toDateString();
                        const appointmentDate = new Date(a.date).toDateString();
                        return today === appointmentDate;
                      }).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Appointments Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {filteredAppointments.length} of {appointments.length}{" "}
                  appointments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582M20 20v-5h-.581M5 19A9 9 0 1119 5"
                    />
                  </svg>
                  Reset Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Appointment
                </button>
              </div>
            </div>

            {/* Modern Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Filter appointments by different criteria
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="relative">
                      <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      >
                        <option value="">All Dates</option>
                        {uniqueDates.map((date) => (
                          <option key={`date-${date}`} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Patient Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Patient
                    </label>
                    <div className="relative">
                      <select
                        value={filterPatient}
                        onChange={(e) => setFilterPatient(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      >
                        <option value="">All Patients</option>
                        {uniquePatients.map((name) => (
                          <option key={`patient-${name}`} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Doctor
                    </label>
                    <div className="relative">
                      <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      >
                        <option value="">All Doctors</option>
                        {uniqueDoctors.map((name) => (
                          <option key={`doctor-${name}`} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      >
                        <option value="">All Departments</option>
                        {uniqueDepartments.map((dept) => (
                          <option key={`dept-${dept}`} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                      >
                        <option value="">All Statuses</option>
                        {uniqueStatuses.map((status) => (
                          <option key={`status-${status}`} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appointments List
                  </h3>
                  <div className="text-sm text-gray-600">
                    {filteredAppointments.length} appointments found
                  </div>
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No appointments found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredAppointments.map((appointment, idx) => (
                        <tr
                          key={appointment._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              #{String(idx + 1).padStart(5, "0")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {appointment.patient?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "P"}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.patient?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.patient?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-600 font-semibold text-sm">
                                  {appointment.doctor?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "D"}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.doctor?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.doctor?.specialization || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {appointment.doctor?.specialization || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                statusColors[
                                  appointment.status.toLowerCase()
                                ] || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowDetails(true);
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Appointment Details Modal */}
            {showDetails && selectedAppointment && (
              <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Appointment Details</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Patient Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.patient?.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Patient Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.patient?.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Doctor Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.doctor?.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.doctor?.specialization}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(
                          selectedAppointment.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedAppointment.status}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedAppointment.type}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAppointment.notes || "No notes available"}
                      </p>
                    </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
