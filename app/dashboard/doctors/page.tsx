"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import api, { Doctor, authAPI } from "../../services/api";
import TopBar from "@/components/TopBar";
import PatientSatisfaction from "@/app/components/PatientSatisfaction";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const summaryCards = [
  { label: "Total Earning", value: "", change: "" },
  { label: "Total Customers", value: "", change: "" },
  { label: "Available Doctors", value: "", change: "" },
  { label: "Total Services", value: "", change: "" },
];

const statusColors = {
  Completed: "bg-green-500",
  Pending: "bg-yellow-400",
  Rejected: "bg-red-500",
};

export default function DashboardPage() {
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] =
    useState<Doctor | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Doctor data state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal form state
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState("4.5");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Available specializations for dropdown
  const specializationOptions = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Oncology",
    "Psychiatry",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Surgery",
    "Endocrinology",
    "Gastroenterology",
    "Infectious Disease",
    "Nephrology",
    "Pulmonology",
    "Rheumatology",
    "Geriatrics",
    "Hematology",
    "Obstetrics and Gynecology",
    "Neonatology",
    "Pediatric Cardiology",
    "Pediatric Oncology",
    "Maternal-Fetal Medicine",
    "Reproductive Endocrinology",
    "Addiction Psychiatry",
    "Forensic Psychiatry",
    "Geriatric Psychiatry",
    "Radiology",
    "Interventional Radiology",
    "Pathology",
    "Anesthesiology",
    "Pain Medicine",
    "Preventive Medicine",
    "Occupational Medicine",
    "Aerospace Medicine",
    "Medical Genetics",
    "Palliative Care",
    "Rehabilitation Medicine",
    "Sports Medicine",
    "Plastic Surgery",
    "Neurosurgery",
    "Vascular Surgery",
    "Colorectal Surgery",
    "Transplant Surgery",
    "Trauma Surgery",
    "Critical Care Medicine",
    "Hospital Medicine",
  ];

  const notifications = [
    { id: 1, text: "New appointment booked." },
    { id: 2, text: "Doctor profile updated." },
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

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.getDoctors();
        // Handle both array and object response formats
        const doctorsData = Array.isArray(response)
          ? response
          : (response as any).doctors || [];
        setDoctors(doctorsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specializations
  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  );

  // Filtered doctors
  const filteredDoctors = doctors.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(term) ||
      d.email?.toLowerCase().includes(term) ||
      d.phone?.toLowerCase().includes(term) ||
      d.specialization?.toLowerCase().includes(term)
    ) && (selectedSpecialization ? d.specialization === selectedSpecialization : true);
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  async function handleSaveDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validation
    if (
      !doctorName.trim() ||
      !specialization.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    if (!email.includes("@")) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const doctorData = {
        name: doctorName.trim(),
        specialization: specialization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: parseInt(experience) || 0,
        rating: parseFloat(rating) || 4.5,
        image:
          image.trim() ||
          `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 70) + 1}.jpg`,
      };

      await api.createDoctor(doctorData);
      
      // Refresh doctors list
      const response = await api.getDoctors();
      const doctorsData = Array.isArray(response) ? response : (response as any).doctors || [];
      setDoctors(doctorsData);
      
      // Close modal after success
      setTimeout(() => {
        setShowCreateModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating doctor:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to create doctor. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleShowDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctorDetails(doctor);
    setShowDoctorDetails(true);
  };

  const handleSelectDoctorForSidebar = (doctor: Doctor) => {
    setSelectedDoctorDetails(doctor);
    setShowDoctorDetails(true);
  };

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageDoctor, setMessageDoctor] = useState<Doctor | null>(null);
  const [messageText, setMessageText] = useState("");

  const handleOpenMessageModal = (doctor: Doctor) => {
    setMessageDoctor(doctor);
    setShowMessageModal(true);
    setMessageText("");
  };
  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setMessageDoctor(null);
    setMessageText("");
  };
  const handleSendMessage = () => {
    // Here you would send the message to the backend
    // console.log('Message to', messageDoctor?.name, ':', messageText);
    setShowMessageModal(false);
    setMessageDoctor(null);
    setMessageText("");
  };

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
                className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${
                  pathname === "/dashboard"
                    ? "hover:bg-[rgba(113,97,239,0.6)] text-white"
                    : "bg-gray-100 text-black"
                }`}
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
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${
                  pathname === "/dashboard/doctors"
                    ? "bg-[rgba(113,97,239,0.6)] text-white font-bold"
                    : "text-black"
                }`}
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
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${
                  pathname === "/dashboard/patients"
                    ? "bg-[rgba(113,97,239,0.6)] text-white font-bold"
                    : "text-black"
                }`}
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
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${
                  pathname === "/dashboard/appointments"
                    ? "bg-[rgba(113,97,239,0.6)] text-white font-bold"
                    : "text-black"
                }`}
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Doctors ({filteredDoctors.length})</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#5B7CFA] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4a63d5] transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create New Doctor
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Image src="/filter.svg" alt="Filter" width={20} height={20} />
                <span className="font-medium">Filter By</span>
              </div>
              <div className="relative flex-grow max-w-xs">
                <input
                  type="text"
                  placeholder="Search doctor name"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent placeholder-black"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-gray-50 appearance-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent text-black"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner text="Loading doctors..." />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                      Error Loading Doctors
                    </div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <Image
                          src={
                            doctor.image ||
                            "/doctordetails.jpg"
                          }
                          alt={doctor.name}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {doctor.specialization}
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            {doctor.experience || "5"}+ Years
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                            Available
                          </span>
                        </div>
                      </div>
                      <div className="p-3 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold">
                              {doctor.rating || "4.5"}
                            </span>
                          </div>
                          <p className="text-gray-500">
                            {doctor.patient_count ||
                              Math.floor(Math.random() * 100) + 50}{" "}
                            Patients
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleShowDoctorDetails(doctor)}
                          className="text-xs text-center font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg py-1.5 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          className="text-xs text-center font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg py-1.5 transition-colors"
                          onClick={() => handleOpenMessageModal(doctor)}
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="hidden lg:block w-full lg:w-80 sticky top-8 self-start">
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="https://randomuser.me/api/portraits/men/34.jpg"
                    alt="Admin Profile"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    Dr. Dilip Anmangandla, MD
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    System Administrator
                  </p>
                </div>

                <div className="grid grid-cols-3 text-center my-4">
                  <div>
                    <div className="text-gray-500 text-xs">Appointment</div>
                    <div className="text-lg font-bold text-gray-900">4250</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Total Patients</div>
                    <div className="text-lg font-bold text-gray-900">32.1k</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Rate</div>
                    <div className="text-lg font-bold text-gray-900">4.8</div>
                  </div>
                </div>

                <hr className="my-3" />

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-base font-bold text-gray-900">
                      Upcoming Appointment
                    </h4>
                    <button className="text-gray-400">•••</button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          Nurse Visit 20
                        </p>
                        <p className="text-xs text-gray-500">
                          Dr. Carol D. Pollack-rundle
                        </p>
                        <p className="text-xs text-gray-400">
                          08:30 am - 10:30 am
                        </p>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          Annual Visit 15
                        </p>
                        <p className="text-xs text-gray-500">
                          Dr. Donald F. Watren
                        </p>
                        <p className="text-xs text-gray-400">
                          08:30 am - 10:30 am
                        </p>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </div>
                  </div>
                </div>

                <hr className="my-3" />

                <PatientSatisfaction />
              </div>
            </aside>
          </div>
        </div>
      </main>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[rgba(247,248,250,0.85)]">
          <div
            className="bg-white rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-200 absolute flex flex-col"
            style={{
              width: "1000px",
              height: "700px",
              top: "90px",
              left: "280px",
            }}
          >
            {/* Modal Heading - Single Line with Underline */}
            <div className="mb-8">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1966FF] mb-1"
                style={{ lineHeight: "1.1" }}
              >
                Create Doctor
              </h2>
              <div className="h-1 bg-[#4BA3FA] w-1/2 rounded" />
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            {/* Modal Content: Place your form here */}
            <div className="flex-1 overflow-y-auto">
              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✅ Doctor created successfully! The modal will close
                  automatically.
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  ❌ {submitError}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Profile Image */}
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <div className="relative">
                    <Image
                      src={
                        image ||
                        "https://randomuser.me/api/portraits/women/44.jpg"
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button className="absolute bottom-2 right-2 bg-[#377DFF] p-2 rounded-full border-2 border-white">
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Profile image will be auto-generated if no URL provided
                  </p>
                </div>

                {/* Right: Form Fields */}
                <form
                  id="create-doctor-form"
                  className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  onSubmit={handleSaveDoctor}
                >
                  {/* Doctor Name */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Doctor Name *
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter doctor name"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Specialization *
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    >
                      <option value="">Select specialization</option>
                      {specializationOptions.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter experience in years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Rating
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter rating (0-5)"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-[#FAFBFC] text-[#377DFF] focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter image URL or leave blank for auto-generated"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            {/* Sticky Save Button Footer */}
            <div className="pt-4 bg-white border-t border-gray-200 flex justify-end sticky bottom-0 left-0 right-0 z-10">
              <button
                type="submit"
                form="create-doctor-form"
                disabled={isSubmitting}
                className={`rounded-lg px-10 py-3 text-lg font-semibold transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#1A2CFE] text-white hover:bg-[#0f1fcc]"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Doctor Details Modal */}
      {showDoctorDetails && selectedDoctorDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Doctor Details</h2>
                <button
                  onClick={() => {
                    setShowDoctorDetails(false);
                    setSelectedDoctorDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Doctor Profile */}
                <div className="flex flex-col items-center">
                  <Image
                    src={
                      selectedDoctorDetails.image ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt={selectedDoctorDetails.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedDoctorDetails.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{selectedDoctorDetails.specialization}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{selectedDoctorDetails.rating || 4.5}</span>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-black">{selectedDoctorDetails.email || "doctor@example.com"}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-black">{selectedDoctorDetails.phone || "+1 234 567 890"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Information */}
                <div className="space-y-6">
                  {/* Professional Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-black">Experience:</span>
                        <span className="font-medium">{selectedDoctorDetails.experience || 10}+ Years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Education:</span>
                        <span className="font-medium">MD, PhD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Specialization:</span>
                        <span className="font-medium">{selectedDoctorDetails.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">License:</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-black">Working Hours:</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Working Days:</span>
                        <span className="font-medium">Monday - Friday</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Status:</span>
                        <span className="font-medium text-green-600">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDoctorDetails.patient_count || 0}
                        </div>
                        <div className="text-sm text-black">Total Patients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-sm text-black">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDoctorDetails.experience || 10}+
                        </div>
                        <div className="text-sm text-black">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedDoctorDetails.rating || 4.5}
                        </div>
                        <div className="text-sm text-black">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleOpenMessageModal(selectedDoctorDetails)}
                        className="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <span className="font-medium text-black">Send Message</span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </button>
                      <button
                        className="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-black">Schedule Appointment</span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </button>
                      <button
                        className="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-black">View Reports</span>
                        </div>
                        <span className="text-gray-400">&gt;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDoctorDetails(false);
                    setSelectedDoctorDetails(null);
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMessageModal && messageDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Send Message to {messageDoctor.name}
              </h2>
              <button
                onClick={handleCloseMessageModal}
                className="text-gray-400 hover:text-gray-600"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseMessageModal}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                disabled={!messageText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
