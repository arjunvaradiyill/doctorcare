"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api, { Patient } from '@/app/services/api';
import { authAPI, ProfileData } from '@/app/services/api';
import Image from "next/image";
import Link from "next/link";

const TABS = ["Dashboard", "Profile", "Booking History", "Document"];

const ProfileForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dob: "",
    adhar: "",
    nationalId: "",
    bloodGroup: "",
    phone1: "",
    phone2: "",
    job: "",
    father: "",
    mother: "",
    spouse: "",
    country: "",
    state: "",
    district: "",
    pin: "",
    address: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile saved! (placeholder)");
  };
  return (
    <div className="flex justify-center items-start bg-[#f7f8fa] pt-4 pb-16 w-full">
      <form onSubmit={handleSubmit} className="w-full p-0">
        {/* ...profile form fields as before... */}
        {/* For brevity, you can copy the form fields from the dashboard page */}
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 text-left">Personal Details</h2>
        {/* ...rest of the form... */}
      </form>
    </div>
  );
};

const BookingHistoryTab = () => {
  // ...copy the BookingHistoryTab logic from dashboard page...
  // For brevity, you can copy the code from the dashboard page
  return (
    <div className="w-full">
      {/* ...booking history table and filters... */}
    </div>
  );
};

export default function MedicalRecordsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Document");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ username: string } | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchPatient() {
      if (typeof params.id === 'string') {
        const data = await api.getPatientById(params.id);
        setPatient(data);
      }
    }
    fetchPatient();
  }, [params.id]);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setLoggedInUser(user);
    authAPI.getProfile().then(profile => setUserProfile(profile)).catch(() => setUserProfile(null));
  }, []);

  const [documents, setDocuments] = useState<Array<{
    id: number;
    name: string;
    description: string;
    doctorName: string;
    uploadDate: string;
    type: string;
    file?: File;
    fileUrl?: string;
  }>>([
    // Example data for demo
    {
      id: 1,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    },
    {
      id: 2,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    },
    {
      id: 3,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    },
    {
      id: 4,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    },
    {
      id: 5,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    },
    {
      id: 6,
      name: "X Ray Report",
      description: "Is simply dummy text of The Printing And Typesetting Industry.",
      doctorName: "Dr.Rosie Pearson",
      uploadDate: "Jan 21, 2020",
      type: "Radiology"
    }
  ]);

  const [selectedReportName, setSelectedReportName] = useState("");
  const [selectedDocumentDate, setSelectedDocumentDate] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    doctorName: "",
    type: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get unique values for filters
  const reportNames = Array.from(new Set(documents.map((d) => d.name)));
  const documentDates = Array.from(new Set(documents.map((d) => d.uploadDate)));

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesReportName = selectedReportName ? doc.name === selectedReportName : true;
    const matchesDate = selectedDocumentDate ? doc.uploadDate === selectedDocumentDate : true;
    return matchesReportName && matchesDate;
  });

  const resetDocumentFilters = () => {
    setSelectedReportName("");
    setSelectedDocumentDate("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadForm({
        ...uploadForm,
        name: file.name.replace(".pdf", ""),
      });
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setUploadForm({ ...uploadForm, [e.target.name]: e.target.value });
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }
    const fileUrl = URL.createObjectURL(selectedFile);
    const newDocument = {
      id: documents.length + 1,
      name: uploadForm.name,
      description: uploadForm.description,
      doctorName: uploadForm.doctorName,
      uploadDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      type: uploadForm.type,
      file: selectedFile,
      fileUrl: fileUrl,
    };
    setDocuments([...documents, newDocument]);
    setShowUploadModal(false);
    setUploadForm({ name: "", description: "", doctorName: "", type: "" });
    setSelectedFile(null);
    alert("Document uploaded successfully!");
  };

  const handleViewDocument = (document: any) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  const handlePrint = (documentId: number) => {
    const document = documents.find((doc) => doc.id === documentId);
    if (document && document.fileUrl) {
      const printWindow = window.open(document.fileUrl, "_blank");
      printWindow?.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  return (
    <div className="min-h-screen min-w-[1200px] bg-[#f7f8fa] py-8 px-4 md:px-12">
      <div className="w-full">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Image src={"/pro.png"} alt={patient?.name || "Patient"} width={64} height={64} className="rounded-full object-cover w-16 h-16" />
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-bold text-black mb-1">
                {loggedInUser?.username ? loggedInUser.username : "Logged User"}
              </h2>
              <div className="flex gap-6 text-sm text-black">
                <span>Gender: <span className="text-green-500">{patient?.gender || "-"}</span></span>
                <span>DOB: <span className="text-green-500">{userProfile?.dateOfBirth || patient?.dateOfBirth || "-"}</span></span>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-16 border-b border-gray-200 mb-8 justify-center">
          {TABS.map(tab => {
            let href = "#";
            if (typeof params.id === 'string') {
              if (tab === "Dashboard") href = `/dashboard/patients/${params.id}`;
              if (tab === "Profile") href = `/dashboard/patients/${params.id}?tab=Profile`;
              if (tab === "Booking History") href = `/dashboard/patients/${params.id}?tab=Booking%20History`;
              if (tab === "Document") href = `/patient/medical-records?id=${params.id}`;
            }
            return (
              <button
                key={tab}
                className={`relative px-10 py-4 text-lg font-medium transition-colors rounded-t-lg ${tab === activeTab ? 'bg-[#7b6ffb] text-white' : 'text-gray-500 hover:text-[#7b6ffb]'} `}
                style={tab === activeTab ? { boxShadow: '0 4px 0 0 #1a1aff inset' } : {}}
                aria-current={tab === activeTab ? 'page' : undefined}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="w-full mx-auto">
          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
              {/* Stat Cards - stacked vertically */}
              <div className="flex flex-col gap-3">
                <div className="rounded-xl bg-[#E6E8FC] p-4 flex flex-col items-center w-full">
                  <span className="text-2xl font-bold text-[#5B7CFA]">{patient?.appointment_count || 0}</span>
                  <span className="mt-1 text-sm text-black font-medium">Total Appointments</span>
                </div>
                <div className="rounded-xl bg-[#D2F6E7] p-4 flex flex-col items-center w-full">
                  <span className="text-2xl font-bold text-[#22C55E]">{patient?.phone || 'N/A'}</span>
                  <span className="mt-1 text-sm text-black font-medium">Phone Number</span>
                </div>
                <div className="rounded-xl bg-[#FEF6E7] p-4 flex flex-col items-center w-full">
                  <span className="text-2xl font-bold text-[#F59E42]">{patient?.gender || 'N/A'}</span>
                  <span className="mt-1 text-sm text-black font-medium">Gender</span>
                </div>
              </div>
              {/* Medical History Card */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center w-full md:col-span-2">
                <div className="text-lg font-bold text-black mb-3 text-center">Medical History</div>
                <div className="text-sm text-gray-600 text-center">
                  {patient?.medicalHistory || 'No medical history available.'}
                </div>
              </div>
            </div>
          )}
          {activeTab === "Profile" && <ProfileForm />}
          {activeTab === "Booking History" && <BookingHistoryTab />}
          {activeTab === "Document" && (
            <>
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex flex-1 items-center gap-2 bg-white rounded-xl shadow-sm p-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
                    </svg>
                  </div>
                  <select
                    value={selectedReportName}
                    onChange={(e) => setSelectedReportName(e.target.value)}
                    className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                  >
                    <option value="">Report Name ▼</option>
                    {reportNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedDocumentDate}
                    onChange={(e) => setSelectedDocumentDate(e.target.value)}
                    className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-36"
                  >
                    <option value="">Date ▼</option>
                    {documentDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={resetDocumentFilters}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 ml-auto px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                    Reset Filter
                  </button>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#7b6ffb] text-white rounded-lg px-6 py-3 text-base font-semibold hover:bg-[#5B7CFA] transition-colors flex items-center gap-2 shadow"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Create New Report
                </button>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between min-h-[200px]"
                    onClick={() => handleViewDocument(document)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#7b6ffb] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z" fill="white" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black mb-1">{document.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{document.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-black font-medium">{document.doctorName}</p>
                          <p className="text-xs text-green-500">
                            <span className="font-medium">Uploaded:</span> {document.uploadDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(document.id);
                        }}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                        title="Print PDF"
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <polyline points="6,9 6,2 18,2 18,9" />
                          <path d="M6,18H4a2,2 0 0,1-2-2v-5a2,2 0 0,1,2-2H20a2,2 0 0,1,2,2v5a2,2 0 0,1-2,2H18" />
                          <polyline points="6,14 6,22 18,22 18,14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12 text-black">
                  {documents.length === 0 ? (
                    <div>
                      <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-black mb-2">No documents uploaded</p>
                      <p className="text-sm text-black">Upload your first PDF document to get started</p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 bg-[#7b6ffb] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#5B7CFA] transition-colors"
                      >
                        Create New Report
                      </button>
                    </div>
                  ) : (
                    "No documents found matching your filters."
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-xl relative flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowUploadModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl  text-black font-bold text-center mb-8 mt-2">Place your reports</h2>
            <label htmlFor="file-upload" className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#a996fd] bg-[#e6e0fa] bg-opacity-70 rounded-2xl py-12 mb-8 transition hover:bg-[#d6cafd]">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-[#7b6ffb]"><rect width="24" height="24" rx="6" fill="#a996fd" fillOpacity="0.3"/><path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="#7b6ffb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="8" y="16" width="8" height="2" rx="1" fill="#7b6ffb"/></svg>
              <span className="text-lg font-medium text-[#7b6ffb]">Upload your files</span>
              <input id="file-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
            <form onSubmit={handleSaveDocument} className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <label className="block text-gray-500 text-base mb-2" htmlFor="doc-name">Document Name</label>
                <div className="flex items-center w-full bg-white border border-[#a996fd] rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#7b6ffb]">
                  <input
                    id="doc-name"
                    name="name"
                    value={uploadForm.name}
                    onChange={handleUploadFormChange}
                    placeholder="Document Name"
                    className="flex-1 bg-transparent outline-none text-black text-lg font-medium"
                    required
                  />
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="ml-2 text-[#7b6ffb]"><rect width="24" height="24" rx="6" fill="#a996fd" fillOpacity="0.2"/><path d="M8 16V8a2 2 0 012-2h4a2 2 0 012 2v8" stroke="#7b6ffb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="8" y="16" width="8" height="2" rx="1" fill="#7b6ffb"/></svg>
                </div>
              </div>
              <button type="submit" className="w-full md:w-56 bg-[#7b6ffb] text-white rounded-full py-3 text-lg font-semibold mt-6 md:mt-0 shadow hover:bg-[#5B7CFA] transition">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 