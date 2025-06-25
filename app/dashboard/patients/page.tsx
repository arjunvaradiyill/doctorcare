"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import api, {
  Patient,
  Appointment,
  patientsAPI,
  authAPI,
} from "@/app/services/api";
import { appointmentsAPI } from "@/app/services/api";
import TopBar from "@/components/TopBar";

const statusColors: { [key: string]: string } = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  "on hold": "bg-gray-100 text-gray-700",
};

const statusOptions = [
  "completed",
  "processing",
  "pending",
  "cancelled",
  "on hold",
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [latestAppointments, setLatestAppointments] = useState<{
    [patientId: string]: Appointment | null;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Add New Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showBookAppointmentModal, setShowBookAppointmentModal] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modal form state
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Get user information using authAPI
  const adminName = currentUser?.username || "Admin";
  const adminEmail = currentUser?.email || "";
  const adminRole = currentUser?.role || "Admin";
  const adminImage =
    currentUser?.image || "https://randomuser.me/api/portraits/men/1.jpg";

  const resetForm = () => {
    setPatientName("");
    setEmail("");
    setPhone("");
    setGender("");
    setDateOfBirth("");
    setAddress("");
    setMedicalHistory("");
    setSubmitError(null);
  };

  const resetFilters = () => {
    setFilterName("");
    setFilterEmail("");
    setFilterGender("");
    setFilterPhone("");
    setSearchTerm("");
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Client-side validation
    if (!patientName.trim()) {
      setSubmitError("Patient name is required");
      setIsSubmitting(false);
      return;
    }

    if (!email.trim()) {
      setSubmitError("Email is required");
      setIsSubmitting(false);
      return;
    }

    if (!phone.trim()) {
      setSubmitError("Phone number is required");
      setIsSubmitting(false);
      return;
    }

    if (!gender) {
      setSubmitError("Gender is required");
      setIsSubmitting(false);
      return;
    }

    if (!dateOfBirth) {
      setSubmitError("Date of birth is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const newPatientData = {
        name: patientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth,
        address: address.trim(),
        medicalHistory: medicalHistory.trim(),
      };

      const response = await patientsAPI.createPatient(newPatientData as any);

      // Add the new patient to the frontend list
      setPatients((prevPatients) => [...prevPatients, response.patient]);

      // Close modal and reset form
      setShowAddPatientModal(false);
      resetForm();
    } catch (err: any) {
      console.error("Error creating patient:", err);
      setSubmitError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create patient"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await patientsAPI.getPatients();
        setPatients(patientsData.patients);
        // Fetch latest appointment for each patient
        const appointmentsMap: { [patientId: string]: Appointment | null } = {};
        await Promise.all(
          patientsData.patients.map(async (patient: Patient) => {
            try {
              const appts = await api.getAppointments();
              const patientAppts = appts.filter(
                (appt: Appointment) => appt.patient._id === patient._id
              );
              appointmentsMap[patient._id] = patientAppts[0] || null;
            } catch {
              appointmentsMap[patient._id] = null;
            }
          })
        );
        setLatestAppointments(appointmentsMap);
      } catch (err) {
        setError("Failed to fetch patients or appointments");
        // It's good practice to ensure patients is an array even on error
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Get current user information
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Get unique values for dropdowns
  const uniqueNames = Array.from(
    new Set(patients.filter((p) => p && p.name).map((p) => p.name))
  );
  const uniqueEmails = Array.from(
    new Set(patients.filter((p) => p && p.email).map((p) => p.email))
  );
  const uniqueGenders = Array.from(
    new Set(patients.filter((p) => p && p.gender).map((p) => p.gender))
  );
  const uniquePhones = Array.from(
    new Set(patients.filter((p) => p && p.phone).map((p) => p.phone))
  );

  // Filtering logic
  const filteredPatients = patients.filter((p) => {
    if (!p) return false;
    // Search term filtering (case-insensitive partial match)
    const searchMatch =
      !searchTerm ||
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.phone && p.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.gender && p.gender.toLowerCase().includes(searchTerm.toLowerCase()));

    // Dropdown filters (exact matches)
    const nameMatch = !filterName || p.name === filterName;
    const emailMatch = !filterEmail || p.email === filterEmail;
    const genderMatch = !filterGender || p.gender === filterGender;
    const phoneMatch = !filterPhone || p.phone === filterPhone;

    return searchMatch && nameMatch && emailMatch && genderMatch && phoneMatch;
  });

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
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
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
        <div className="w-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Patient Management
            </h1>
            <p className="text-gray-600 text-base">
              Manage your patients and their information
            </p>
          </div>

          {/* Header Section with Add Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-black">
                Patients ({filteredPatients.length})
              </h2>
            </div>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="bg-[#7b6ffb] text-white px-8 py-3 rounded-lg hover:bg-[#6a5de8] transition-colors font-semibold flex items-center gap-2 text-lg"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Patient
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-black">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-red-500 hover:text-red-600 underline flex items-center gap-1"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
                Reset All Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <select
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent transition-colors text-sm ${
                    filterName ? "bg-blue-50 border-blue-300" : "bg-white"
                  }`}
                >
                  <option value="" className="text-gray-500">
                    All Names
                  </option>
                  {uniqueNames.map((name) => (
                    <option
                      key={`name-${name}`}
                      value={name}
                      className="text-gray-700"
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <select
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent transition-colors text-sm ${
                    filterEmail ? "bg-blue-50 border-blue-300" : "bg-white"
                  }`}
                >
                  <option value="" disabled className="text-gray-500">
                    All Emails
                  </option>
                  {uniqueEmails.map((email) => (
                    <option
                      key={`email-${email}`}
                      value={email}
                      className="text-gray-700"
                    >
                      {email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent transition-colors text-sm ${
                    filterGender ? "bg-blue-50 border-blue-300" : "bg-white"
                  }`}
                >
                  <option value="" disabled className="text-gray-500">
                    All Genders
                  </option>
                  {uniqueGenders.map((gender) => (
                    <option
                      key={`gender-${gender}`}
                      value={gender}
                      className="text-gray-700"
                    >
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <select
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  className={`w-full border border-gray-300 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent transition-colors text-sm ${
                    filterPhone ? "bg-blue-50 border-blue-300" : "bg-white"
                  }`}
                >
                  <option value="" disabled className="text-gray-500">
                    All Phones
                  </option>
                  {uniquePhones.map((phone) => (
                    <option
                      key={`phone-${phone}`}
                      value={phone}
                      className="text-gray-700"
                    >
                      {phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 w-full mt-0">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">
                  Patient Records
                </h3>
                <div className="text-sm text-gray-600 bg-white px-2 py-0.5 rounded-full border">
                  {filteredPatients.length} of {patients.length} patients
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-48 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-16">
                            <svg
                              className="w-24 h-24 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-base font-semibold text-black mb-8">
                            No patients found
                          </p>
                          <p className="text-base text-gray-600 mb-16 max-w-md">
                            Try adjusting your search or filter criteria to find
                            the patients you're looking for.
                          </p>
                          <button
                            onClick={resetFilters}
                            className="text-base text-[#7b6ffb] hover:text-[#6a5de8] underline font-medium"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, idx) => {
                      const appt = latestAppointments[patient._id];
                      return (
                        <tr
                          key={patient._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-500">
                              #{String(idx + 1).padStart(5, "0")}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {patient.name?.charAt(0)?.toUpperCase() ||
                                    "P"}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-black">
                                  {patient.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Patient
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {patient.email}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {patient.phone}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                patient.gender?.toLowerCase() === "male"
                                  ? "bg-blue-100 text-blue-800"
                                  : patient.gender?.toLowerCase() === "female"
                                  ? "bg-pink-100 text-pink-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {patient.gender?.charAt(0)?.toUpperCase() +
                                patient.gender?.slice(1) || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {appt?.status ? (
                              <select
                                value={appt.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    await appointmentsAPI.updateAppointmentStatus(
                                      appt._id,
                                      newStatus
                                    );
                                    setLatestAppointments((prev) => ({
                                      ...prev,
                                      [patient._id]: {
                                        ...appt,
                                        status: newStatus,
                                      },
                                    }));
                                  } catch (err) {
                                    alert("Failed to update status");
                                  }
                                }}
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold focus:ring-2 focus:ring-[#7b6ffb] transition-colors appearance-none cursor-pointer border-0
                                  ${
                                    statusColors[appt.status.toLowerCase()] ||
                                    "bg-gray-100 text-gray-800"
                                  }`}
                                style={{ minWidth: 80 }}
                              >
                                {statusOptions.map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                    className={
                                      statusColors[status.toLowerCase()] ||
                                      "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                No Appointments
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <Link
                              href={`/dashboard/patients/${patient._id}`}
                              className="inline-flex items-center px-3 py-1 bg-[#7b6ffb] hover:bg-[#6a5de8] text-white rounded-md font-medium text-sm transition-colors"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="mr-1"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              View Profile
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowBookAppointmentModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md font-medium text-sm transition-colors ml-1"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="mr-1"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              Book Appointment
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Patient Modal */}
          {showAddPatientModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add New Patient
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddPatientModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter patient's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter patient's email"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male" className="text-gray-700">
                          Male
                        </option>
                        <option value="female" className="text-gray-700">
                          Female
                        </option>
                        <option value="other" className="text-gray-700">
                          Other
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      placeholder="Enter patient's address"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Medical History
                    </label>
                    <textarea
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      placeholder="Enter any relevant medical history"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPatientModal(false);
                        resetForm();
                      }}
                      className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      {isSubmitting ? "Adding..." : "Add Patient"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Book Appointment Modal */}
          {showBookAppointmentModal && selectedPatient && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Book Appointment for {selectedPatient.name}
                  </h2>
                  <button
                    onClick={() => setShowBookAppointmentModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Doctor
                    </label>
                    <select className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent text-base">
                      <option>Select Doctor</option>
                      <option>Dr. John Doe</option>
                      <option>Dr. Jane Smith</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent text-base"
                      placeholder="Any additional notes..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookAppointmentModal(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors text-base"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
