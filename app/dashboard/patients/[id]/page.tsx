"use client";
import { useParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api, { Appointment, Doctor, Patient, authAPI, User } from '@/app/services/api';
import TopBar from '@/components/TopBar';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const TABS = ["Dashboard", "Profile", "Doctors", "Booking History", "Document"];
const FINDINGS_TABS = ["Doctor Findings", "Doctor Suggestions", "Medicine"];

// ProfileForm component for patient profile
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
    <div className="flex justify-center items-start min-h-screen bg-[#f7f8fa] pt-4 pb-16">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl p-0">
        <h2 className="text-xl font-extrabold mb-4 text-gray-900 text-left">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Full name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f] text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">DOB</label>
            <input name="dob" value={form.dob} onChange={handleChange} placeholder="DD/MM/YYYY" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Adhar no</label>
            <input name="adhar" value={form.adhar} onChange={handleChange} placeholder="Enter Adhar number" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">National ID Number</label>
            <input name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="Enter National ID number" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]">
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Phone No</label>
            <input name="phone1" value={form.phone1} onChange={handleChange} placeholder="Enter phone number" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Phone No 2</label>
            <input name="phone2" value={form.phone2} onChange={handleChange} placeholder="Enter alternate phone number" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Job</label>
            <input name="job" value={form.job} onChange={handleChange} placeholder="Enter job title" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
        </div>
        <h2 className="text-xl font-extrabold mb-4 mt-6 text-gray-900 text-left">Family Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Father Name</label>
            <input name="father" value={form.father} onChange={handleChange} placeholder="Enter father name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Mother Name</label>
            <input name="mother" value={form.mother} onChange={handleChange} placeholder="Enter mother name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Wife Or Husband Name</label>
            <input name="spouse" value={form.spouse} onChange={handleChange} placeholder="Enter spouse name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
        </div>
        <h2 className="text-xl font-extrabold mb-4 mt-6 text-gray-900 text-left">Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Country Name</label>
            <input name="country" value={form.country} onChange={handleChange} placeholder="Enter country name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">State Name</label>
            <input name="state" value={form.state} onChange={handleChange} placeholder="Enter state name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">District Name</label>
            <input name="district" value={form.district} onChange={handleChange} placeholder="Enter district name" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Pin Code</label>
            <input name="pin" value={form.pin} onChange={handleChange} placeholder="Enter pin code" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-left text-black">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Enter address" className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 bg-[#f8faff] text-[#4f4f4f]" rows={2} />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button type="submit" className="w-60 bg-[#1a1aff] text-white py-2.5 rounded-xl font-bold text-base shadow-lg hover:bg-[#2323e6] transition">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

// DoctorsTab: Use the same logic and card as the main doctors page
function DoctorsTab() {
  const params = useParams();
  const patientId = params?.id;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const appts = await api.getAppointments();
        // Filter appointments for this patient
        const patientAppts = appts.filter((appt: Appointment) => appt.patient._id === patientId);
        setAppointments(patientAppts);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchAppointments();
  }, [patientId]);

  // Extract unique doctors from appointments
  const doctors: Doctor[] = Array.from(
    new Map(
      appointments.map(appt => [appt.doctor._id, {
        _id: appt.doctor._id,
        name: appt.doctor.name,
        specialization: appt.doctor.specialization,
        image: (appt.doctor as any).image || '/doctor.png',
        experience: 0,
        rating: 0,
        created_at: '',
        updated_at: '',
      }])
    ).values()
  );

  // Get unique doctor names and departments
  const doctorNames = Array.from(new Set(doctors.map(d => d.name)));
  const doctorDepartments = Array.from(new Set(doctors.map(d => d.specialization)));

  // Filtered doctors
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesDoctor = selectedDoctor ? d.name === selectedDoctor : true;
    const matchesDepartment = selectedDepartment ? d.specialization === selectedDepartment : true;
    return matchesSearch && matchesDoctor && matchesDepartment;
  });

  return (
    <div className="main-content max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 w-full">
      {/* Doctors Heading and Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-black">Doctors</h2>
          <span className="text-base text-black">({doctors.length})</span>
        </div>
      </div>
      <div className="w-full h-[70px] flex items-center rounded-xl shadow bg-[#f7f8fa] gap-4 mb-4 px-2 md:px-6">
        {/* Filter Icon and Label */}
        <div className="flex items-center gap-2">
          <img src="/filter.svg" alt="Filter" width={28} height={28} />
          <span className="font-semibold text-black">Filter By</span>
        </div>
        {/* Search Input */}
        <div className="flex-1 mx-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search doctor name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 rounded-full border border-gray-200 pl-10 pr-4 text-lg bg-[#fafbfc] text-black focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {/* Doctor Name Dropdown */}
        <select
          value={selectedDoctor}
          onChange={e => setSelectedDoctor(e.target.value)}
          className="h-11 rounded-full border border-gray-200 px-4 text-lg bg-[#fafbfc] text-black focus:outline-none"
        >
          <option value="">All Doctors</option>
          {doctorNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {/* Department Dropdown */}
        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}
          className="h-11 rounded-full border border-gray-200 px-4 text-lg bg-[#fafbfc] text-black focus:outline-none"
        >
          <option value="">All Departments</option>
          {doctorDepartments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>
      {/* Doctor Cards Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0 px-2 md:px-6">
        {loading ? (
          <div className="col-span-full text-center text-black py-12">
            <LoadingSpinner text="Loading doctors..." />
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-12">{error}</div>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, idx) => (
            <div key={doctor._id || idx} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center min-h-[260px] relative overflow-hidden">
              <span className="font-semibold text-gray-700 mb-2 block">Doctor Schedule</span>
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white group">
                  <Image
                    src="/doctordetails.jpg"
                    alt="Doctor"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Available
                  </div>
                  {/* Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 bg-gray-300/60 rounded-2xl">
                    <div>
                      <div className="bg-yellow-300 text-black px-3 py-1 rounded-full font-semibold text-xs inline-block mb-1">
                        Dr. Fila Soy
                      </div>
                      <div className="font-bold text-lg text-black">Cardiologist</div>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-white/60 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-gray-900">{doctor.name}</span>
                  <span className="block text-gray-600 text-sm">{doctor.specialization}</span>
              </div>
              </div>
              <button className="absolute bottom-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="#666666"/>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-black py-12">No doctors found.</div>
        )}
      </div>
    </div>
  );
}

// DocumentTab component  
function DocumentTab() {
  const [documents, setDocuments] = useState<Array<{
    id: number;
    name: string;
    description: string;
    doctorName: string;
    uploadDate: string;
    type: string;
    file?: File;
    fileUrl?: string;
  }>>([]);

  const [selectedReportName, setSelectedReportName] = useState('');
  const [selectedDocumentDoctor, setSelectedDocumentDoctor] = useState('');
  const [selectedDocumentDate, setSelectedDocumentDate] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    doctorName: '',
    type: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get unique values for filters
  const reportNames = Array.from(new Set(documents.map(d => d.name)));
  const documentDoctors = Array.from(new Set(documents.map(d => d.doctorName)));
  const documentDates = Array.from(new Set(documents.map(d => d.uploadDate)));

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesReportName = selectedReportName ? doc.name === selectedReportName : true;
    const matchesDoctor = selectedDocumentDoctor ? doc.doctorName === selectedDocumentDoctor : true;
    const matchesDate = selectedDocumentDate ? doc.uploadDate === selectedDocumentDate : true;
    return matchesReportName && matchesDoctor && matchesDate;
  });

  const resetDocumentFilters = () => {
    setSelectedReportName('');
    setSelectedDocumentDoctor('');
    setSelectedDocumentDate('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadForm({
        ...uploadForm,
        name: file.name.replace('.pdf', ''),
      });
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUploadForm({ ...uploadForm, [e.target.name]: e.target.value });
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    const fileUrl = URL.createObjectURL(selectedFile);
    const newDocument = {
      id: documents.length + 1,
      name: uploadForm.name,
      description: uploadForm.description,
      doctorName: uploadForm.doctorName,
      uploadDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      }),
      type: uploadForm.type,
      file: selectedFile,
      fileUrl: fileUrl
    };

    setDocuments([...documents, newDocument]);
    setShowUploadModal(false);
    setUploadForm({ name: '', description: '', doctorName: '', type: '' });
    setSelectedFile(null);
    alert('Document uploaded successfully!');
  };

  const handleViewDocument = (document: any) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      setDocuments(updatedDocuments);
      alert('Document deleted successfully!');
    }
  };

  const handlePrint = (documentId: number) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document && document.fileUrl) {
      const printWindow = window.open(document.fileUrl, '_blank');
      printWindow?.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Medical Documents (Reports)</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-[#5B7CFA] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4A63D2] transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Upload PDF Document
        </button>
      </div>

      {/* Filter Bar */}
      <div className="w-full bg-[#f7f8fa] rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
              </svg>
            </div>
          </div>

          {/* Report Name Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedReportName}
              onChange={e => setSelectedReportName(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
            >
              <option value="">Report Name ▼</option>
              {reportNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Doctor Name Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedDocumentDoctor}
              onChange={e => setSelectedDocumentDoctor(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            >
              <option value="">Doctor Name ▼</option>
              {documentDoctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          {/* Date Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedDocumentDate}
              onChange={e => setSelectedDocumentDate(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-36"
            >
              <option value="">Date ▼</option>
              {documentDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={resetDocumentFilters}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 ml-auto px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            </svg>
            Reset Filter
          </button>
        </div>
      </div>

             {/* Documents Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredDocuments.map((document) => (
           <div key={document.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
             <div className="flex items-start gap-4">
               {/* Document Icon */}
               <div 
                 className="w-12 h-12 bg-[#5B7CFA] rounded-lg flex items-center justify-center flex-shrink-0"
                 onClick={() => handleViewDocument(document)}
               >
                 <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                   <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                   <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z" fill="white"/>
                 </svg>
               </div>

               {/* Document Content */}
               <div 
                 className="flex-1 min-w-0"
                 onClick={() => handleViewDocument(document)}
               >
                 <h3 className="text-lg font-semibold text-black mb-2">{document.name}</h3>
                 <p className="text-sm text-black mb-3 line-clamp-2">{document.description}</p>
                 <div className="space-y-1">
                   <p className="text-sm text-black font-medium">{document.doctorName}</p>
                   <p className="text-xs text-green-500">
                     <span className="font-medium">Uploaded:</span> {document.uploadDate}
                   </p>
                   {document.file && (
                     <p className="text-xs text-blue-500">
                       <span className="font-medium">File:</span> {document.file.name} ({(document.file.size / 1024 / 1024).toFixed(2)} MB)
                     </p>
                   )}
                 </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col gap-2">
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     handleViewDocument(document);
                   }}
                   className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                   title="View PDF"
                 >
                   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                     <circle cx="12" cy="12" r="3"/>
                   </svg>
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     handlePrint(document.id);
                   }}
                   className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                   title="Print PDF"
                 >
                   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                     <polyline points="6,9 6,2 18,2 18,9"/>
                     <path d="M6,18H4a2,2 0 0,1-2-2v-5a2,2 0 0,1,2-2H20a2,2 0 0,1,2,2v5a2,2 0 0,1-2,2H18"/>
                     <polyline points="6,14 6,22 18,22 18,14"/>
                   </svg>
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     handleDeleteDocument(document.id);
                   }}
                   className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                   title="Delete PDF"
                 >
                   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                     <polyline points="3,6 5,6 21,6"/>
                     <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                     <line x1="10" y1="11" x2="10" y2="17"/>
                     <line x1="14" y1="11" x2="14" y2="17"/>
                   </svg>
                 </button>
               </div>
             </div>
           </div>
         ))}
       </div>

             {filteredDocuments.length === 0 && (
         <div className="text-center py-12 text-black">
           {documents.length === 0 ? (
             <div>
               <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
               </svg>
               <p className="text-lg font-medium text-black mb-2">No documents uploaded</p>
               <p className="text-sm text-black">Upload your first PDF document to get started</p>
               <button 
                 onClick={() => setShowUploadModal(true)}
                 className="mt-4 bg-[#5B7CFA] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4A63D2] transition-colors"
               >
                 Upload PDF Document
               </button>
             </div>
           ) : (
             "No documents found matching your filters."
           )}
         </div>
       )}

       {/* Upload Modal */}
       {showUploadModal && (
         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="p-8">
               {/* Modal Header */}
               <div className="mb-8">
                 <h2 className="text-2xl font-bold text-[#5B7CFA] mb-2">Create New Report</h2>
                 <div className="w-32 h-1 bg-[#5B7CFA] rounded-full"></div>
               </div>
               
               {/* Close button */}
               <button
                 onClick={() => {
                   setShowUploadModal(false);
                   setSelectedFile(null);
                   setUploadForm({ name: '', description: '', doctorName: '', type: '' });
                 }}
                 className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
                 aria-label="Close"
                 style={{lineHeight: 1}}
               >
                 ×
               </button>

               {/* Form */}
               <form onSubmit={handleSaveDocument}>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Left Column */}
                   <div className="space-y-6">
                     {/* Report Name */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Report Name</label>
                       <input
                         type="text"
                         name="name"
                         value={uploadForm.name}
                         onChange={handleUploadFormChange}
                         placeholder="charlenereed@gmail.com"
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                         required
                       />
                     </div>

                     {/* Date */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Date</label>
                       <input
                         type="text"
                         placeholder="DD/MM/YYY"
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                       />
                     </div>

                     {/* Description */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Description</label>
                       <textarea
                         name="description"
                         value={uploadForm.description}
                         onChange={handleUploadFormChange}
                         placeholder="charlenereed@gmail.com"
                         rows={6}
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all resize-none"
                         required
                       />
                     </div>
                   </div>

                   {/* Right Column */}
                   <div className="space-y-6">
                     {/* Doctor Name */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Doctor Name</label>
                       <input
                         type="text"
                         name="doctorName"
                         value={uploadForm.doctorName}
                         onChange={handleUploadFormChange}
                         placeholder="Charlene Reed"
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                         required
                       />
                     </div>

                     {/* Department */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Department</label>
                       <input
                         type="text"
                         name="type"
                         value={uploadForm.type}
                         onChange={handleUploadFormChange}
                         placeholder="Charlene Reed"
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                         required
                       />
                     </div>

                     {/* File Upload Area */}
                     <div>
                       <label className="block text-base font-semibold text-black mb-3">Report</label>
                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#5B7CFA] transition-colors">
                         <input
                           type="file"
                           accept=".pdf"
                           onChange={handleFileUpload}
                           className="hidden"
                           id="fileUpload"
                           required
                         />
                         <label htmlFor="fileUpload" className="cursor-pointer">
                           <div className="flex flex-col items-center">
                             <div className="w-12 h-12 bg-[#5B7CFA] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                               <svg width="24" height="24" fill="none" stroke="#5B7CFA" viewBox="0 0 24 24" strokeWidth="2">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                               </svg>
                             </div>
                             <div className="text-base text-black mb-1">
                               <span className="text-[#5B7CFA] font-semibold">Click to Upload</span> or drag and drop
                             </div>
                             <div className="text-sm text-black">(Max. file size: 25 MB)</div>
                           </div>
                         </label>
                         {selectedFile && (
                           <div className="mt-4 p-3 bg-green-50 rounded-lg">
                             <p className="text-sm text-green-600 font-medium">
                               ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                             </p>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-4 mt-8">
                   <button
                     type="button"
                     onClick={() => {
                       setShowUploadModal(false);
                       setSelectedFile(null);
                       setUploadForm({ name: '', description: '', doctorName: '', type: '' });
                     }}
                     className="px-6 py-3 border border-gray-300 text-black rounded-xl hover:bg-gray-50 transition-colors font-medium"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="px-12 py-3 bg-[#5B7CFA] text-white rounded-xl hover:bg-[#4A63D2] transition-colors font-semibold shadow-lg"
                   >
                     Save
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

// BookingHistoryTab component
function BookingHistoryTab() {
  const [bookings] = useState([
    {
      id: 1,
      timeTo: '10:00 AM',
      timeFrom: '09:00 AM',
      date: '04 Sep 2019',
      doctorName: 'Dr.Rosie Pearson',
      department: 'Cardiology',
      status: 'Completed'
    },
    {
      id: 2,
      timeTo: '02:00 PM',
      timeFrom: '01:00 PM',
      date: '05 Sep 2019',
      doctorName: 'Dr.John Smith',
      department: 'Neurology',
      status: 'Processing'
    },
    {
      id: 3,
      timeTo: '11:00 AM',
      timeFrom: '10:00 AM',
      date: '06 Sep 2019',
      doctorName: 'Dr.Sarah Johnson',
      department: 'Dermatology',
      status: 'Rejected'
    },
    {
      id: 4,
      timeTo: '03:00 PM',
      timeFrom: '02:00 PM',
      date: '07 Sep 2019',
      doctorName: 'Dr.Michael Brown',
      department: 'Orthopedics',
      status: 'Completed'
    },
    {
      id: 5,
      timeTo: '04:00 PM',
      timeFrom: '03:00 PM',
      date: '08 Sep 2019',
      doctorName: 'Dr.Emily Davis',
      department: 'Pediatrics',
      status: 'Processing'
    },
    {
      id: 6,
      timeTo: '09:00 AM',
      timeFrom: '08:00 AM',
      date: '09 Sep 2019',
      doctorName: 'Dr.Rosie Pearson',
      department: 'Cardiology',
      status: 'Completed'
    },
    {
      id: 7,
      timeTo: '05:00 PM',
      timeFrom: '04:00 PM',
      date: '10 Sep 2019',
      doctorName: 'Dr.David Wilson',
      department: 'Psychiatry',
      status: 'Processing'
    },
    {
      id: 8,
      timeTo: '12:00 PM',
      timeFrom: '11:00 AM',
      date: '11 Sep 2019',
      doctorName: 'Dr.Lisa Anderson',
      department: 'Gynecology',
      status: 'On Hold'
    },
    {
      id: 9,
      timeTo: '01:00 PM',
      timeFrom: '12:00 PM',
      date: '12 Sep 2019',
      doctorName: 'Dr.Robert Taylor',
      department: 'Ophthalmology',
      status: 'In Transit'
    },
    {
      id: 10,
      timeTo: '06:00 PM',
      timeFrom: '05:00 PM',
      date: '13 Sep 2019',
      doctorName: 'Dr.Jennifer Martinez',
      department: 'Endocrinology',
      status: 'Completed'
    },
    {
      id: 11,
      timeTo: '08:00 AM',
      timeFrom: '07:00 AM',
      date: '14 Sep 2019',
      doctorName: 'Dr.John Smith',
      department: 'Neurology',
      status: 'Processing'
    },
    {
      id: 12,
      timeTo: '07:00 PM',
      timeFrom: '06:00 PM',
      date: '15 Sep 2019',
      doctorName: 'Dr.Sarah Johnson',
      department: 'Dermatology',
      status: 'Completed'
    }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Get unique values for filters
  const doctorNames = Array.from(new Set(bookings.map(b => b.doctorName)));
  const departments = Array.from(new Set(bookings.map(b => b.department)));
  const dates = Array.from(new Set(bookings.map(b => b.date)));

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesDoctor = selectedDoctor ? booking.doctorName === selectedDoctor : true;
    const matchesDepartment = selectedDepartment ? booking.department === selectedDepartment : true;
    const matchesDate = selectedDate ? booking.date === selectedDate : true;
    return matchesDoctor && matchesDepartment && matchesDate;
  });

  const resetFilters = () => {
    setSelectedDoctor('');
    setSelectedDepartment('');
    setSelectedDate('');
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Completed': 'bg-green-100 text-green-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-red-100 text-red-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'In Transit': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="w-full bg-[#f7f8fa] rounded-xl shadow-sm mb-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
              </svg>
            </div>
          </div>

          {/* Doctor Name Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            >
              <option value="">All Doctors ▼</option>
              {doctorNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
            >
              <option value="">All Departments ▼</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Date Dropdown */}
          <div className="flex flex-col min-w-0">
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 px-3 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-36"
            >
              <option value="">All Dates ▼</option>
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 ml-auto px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            </svg>
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table Container with proper spacing */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">Time To</th>
                <th className="w-24 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">Time From</th>
                <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">Date</th>
                <th className="w-40 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">Doctor Name</th>
                <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">Department</th>
                <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-black border-b border-gray-200">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{booking.timeTo}</td>
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{booking.timeFrom}</td>
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{booking.date}</td>
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{booking.doctorName}</td>
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{booking.department}</td>
                  <td className="px-4 py-4 text-sm text-black whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-black">No booking history found.</div>
        )}
      </div>
    </div>
  );
}

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [findingsTab, setFindingsTab] = useState("Doctor Findings");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState<number[]>([]);
  const [expandedFindings, setExpandedFindings] = useState<number[]>([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddSuggestionModal, setShowAddSuggestionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Pantonix Tablet 20mg",
      dosage: "Day 2 times tablets",
      image: "/medicine.png"
    },
    {
      id: 2,
      name: "Pantonix Tablet 20mg",
      dosage: "Day 2 times tablets",
      image: "/medicine.png"
    },
    {
      id: 3,
      name: "Pantonix Tablet 20mg",
      dosage: "Day 2 times tablets",
      image: "/medicine.png"
    },
    {
      id: 4,
      name: "Pantonix Tablet 20mg",
      dosage: "Day 2 times tablets",
      image: "/medicine.png"
    },
    {
      id: 5,
      name: "Pantonix Tablet 20mg",
      dosage: "Day 2 times tablets",
      image: "/medicine.png"
    }
  ]);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    recommendation: '',
    followUp: '',
    notes: ''
  });
  const [findingForm, setFindingForm] = useState({
    cause: '',
    date: '',
    time: '',
    description: ''
  });

  // Add this with other state declarations
  const [showFrontView, setShowFrontView] = useState(true);

  const [patient, setPatient] = useState<Patient | null>(null);

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
    setCurrentUser(user);
  }, []);

  const handleFindingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFindingForm({ ...findingForm, [e.target.name]: e.target.value });
  };

  const handleSaveFinding = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to database
    console.log('Saving finding:', findingForm);
    setShowAddFindingModal(false);
    setFindingForm({ cause: '', date: '', time: '', description: '' });
    alert('Finding saved successfully!');
  };

  const toggleSuggestion = (suggestionId: number) => {
    setExpandedSuggestions(prev => 
      prev.includes(suggestionId) 
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const toggleFinding = (findingId: number) => {
    setExpandedFindings(prev => 
      prev.includes(findingId) 
        ? prev.filter(id => id !== findingId)
        : [...prev, findingId]
    );
  };

  const handleMedicineFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMedicineForm({ ...medicineForm, [e.target.name]: e.target.value });
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedicine = {
      id: medicines.length + 1,
      name: medicineForm.name,
      dosage: medicineForm.dosage,
      image: "/medicine.png"
    };
    setMedicines([...medicines, newMedicine]);
    setShowAddMedicineModal(false);
    setMedicineForm({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
    alert('Medicine added successfully!');
  };

  const handleSuggestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSuggestionForm({ ...suggestionForm, [e.target.name]: e.target.value });
  };

  const handleSaveSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    // If suggestions is not present, initialize as empty array
    const suggestions = Array.isArray((patient as any).suggestions) ? (patient as any).suggestions : [];
    const newSuggestion = {
      id: suggestions.length + 1,
      title: suggestionForm.title,
      uploaded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
      content: suggestionForm.recommendation
    };
    suggestions.push(newSuggestion);
    setShowAddSuggestionModal(false);
    setSuggestionForm({ title: '', recommendation: '', followUp: '', notes: '' });
    alert('Suggestion added successfully!');
  };

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(medicine => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      medicine.name.toLowerCase().includes(term) ||
      medicine.dosage.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-6">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-black">CareBot</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center px-4 py-2 rounded-lg font-bold shadow ${pathname === '/dashboard' ? 'bg-[rgba(113,97,239,0.6)] text-white' : 'bg-gray-100 text-black'}`}
              >
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
              <Link
                href="/dashboard/doctors"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/doctors' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 8L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 8L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                Doctors
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/patients"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/patients' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Patient
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/appointments"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/dashboard/appointments' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
                <span className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
                Appointment
              </Link>
            </li>
            <li>
              <Link
                href="/logout"
                className={`flex items-center px-4 py-2 rounded-lg font-normal hover:bg-[rgba(113,97,239,0.6)] ${pathname === '/logout' ? 'bg-[rgba(113,97,239,0.6)] text-white font-bold' : 'text-black'}`}
              >
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
      <main className="flex-1 p-8">
        <TopBar user={currentUser} onSearch={handleSearch} />
        {/* Page Content with proper spacing */}
        <div className="mt-6 max-w-7xl mx-auto">
          {/* Profile Header and Tabs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Image src={"/pro.png"} alt={patient?.name || "Patient"} width={64} height={64} className="rounded-full object-cover w-16 h-16" />
                <div>
                  <h2 className="text-lg font-bold text-black mb-1">{patient?.name}</h2>
                  <div className="text-sm text-black mb-1">{patient?.email}</div>
                  <div className="flex gap-3 text-xs text-black">
                    <span>Gender: <span className="text-green-500">{patient?.gender}</span></span>
                    <span>DOB: <span className="text-green-500">{patient?.dateOfBirth}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button className="bg-white border rounded-lg p-1.5 hover:bg-gray-100">
                  <svg width="16" height="16" fill="none" stroke="currentColor"><path d="M6 10h12M6 6h12M6 14h12M4 6v8a2 2 0 002 2h12a2 2 0 002-2V6"/></svg>
                </button>
                <button className="bg-[#5B7CFA] text-white rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-[#4663c6] transition-colors">Send</button>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-4">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-[#5B7CFA] text-[#5B7CFA]' : 'text-black hover:text-[#5B7CFA]'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Profile Form or Dashboard Content */}
            {activeTab === "Profile" ? (
              <ProfileForm />
            ) : activeTab === "Dashboard" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                {/* Body Images */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => setShowFrontView(true)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        showFrontView 
                          ? 'bg-[#5B7CFA] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Front View
                    </button>
                    <button 
                      onClick={() => setShowFrontView(false)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        !showFrontView 
                          ? 'bg-[#5B7CFA] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Side View
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src={showFrontView ? "/bodyf.png" : "/body.png"}
                      alt={showFrontView ? "Front Body View" : "Side Body View"}
                      width={250}
                      height={350}
                      className="object-contain transition-opacity duration-300"
                      priority
                    />
                  </div>
                </div>
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
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center w-full">
                  <div className="text-lg font-bold text-black mb-3 text-center">Medical History</div>
                  <div className="text-sm text-gray-600 text-center">
                    {patient?.medicalHistory || 'No medical history available.'}
                  </div>
                </div>
              </div>
            ) : activeTab === "Doctors" ? (
              <DoctorsTab />
            ) : activeTab === "Booking History" ? (
              <div className="mb-8">
                <BookingHistoryTab />
              </div>
            ) : activeTab === "Document" ? (
              <div className="mb-8">
                <DocumentTab />
              </div>
            ) : null}
            {/* Findings Tabs */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-6">
                {FINDINGS_TABS.map(tab => (
                  <button
                    key={tab}
                    className={`pb-1 text-sm font-medium transition-colors border-b-2 ${findingsTab === tab ? 'border-[#5B7CFA] text-[#5B7CFA]' : 'border-transparent text-black hover:text-[#5B7CFA]'}`}
                    onClick={() => setFindingsTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (findingsTab === "Medicine") {
                    setShowAddMedicineModal(true);
                  } else if (findingsTab === "Doctor Suggestions") {
                    setShowAddSuggestionModal(true);
                  } else {
                    setShowAddFindingModal(true);
                  }
                }}
                className="bg-[#A99DF8] text-white rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-[#5B7CFA] transition-colors flex items-center gap-2"
              >
                {findingsTab === "Medicine" ? "Add Medicines" : 
                 findingsTab === "Doctor Suggestions" ? "Add Suggestions" : "Add Findings"}
                <svg width="14" height="14" fill="none" stroke="currentColor"><path d="M8 4v8M4 8h8"/></svg>
              </button>
            </div>
            {/* Findings List */}
            <div className="space-y-2">
              {findingsTab === "Doctor Findings" && (patient?.findings ?? []).map(finding => (
                <div key={finding.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => toggleFinding(finding.id)}>
                    <div className="text-sm font-medium text-black">{finding.title}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-green-500">Uploaded: {finding.uploaded}</div>
                      <button className="text-black hover:text-blue-600 transition-transform" style={{ transform: expandedFindings.includes(finding.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {expandedFindings.includes(finding.id) && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-sm text-black leading-relaxed">{finding.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {findingsTab === "Doctor Suggestions" && (patient?.suggestions ?? []).map(suggestion => (
                <div key={suggestion.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => toggleSuggestion(suggestion.id)}>
                    <div className="text-sm font-medium text-black">{suggestion.title}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-green-500">Uploaded: {suggestion.uploaded}</div>
                      <button className="text-black hover:text-blue-600 transition-transform" style={{ transform: expandedSuggestions.includes(suggestion.id) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {expandedSuggestions.includes(suggestion.id) && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-sm text-black leading-relaxed">{suggestion.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {findingsTab === "Medicine" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredMedicines.map(medicine => (
                    <div key={medicine.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <img 
                          src="/picture.png" 
                          alt={medicine.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-black mb-1">{medicine.name}</h3>
                      <p className="text-xs text-gray-500">{medicine.dosage}</p>
                    </div>
                  ))}
                  {filteredMedicines.length === 0 && (
                    <div className="col-span-full bg-white rounded-lg p-8 text-center">
                      <div className="text-sm text-black mb-4">No medicines prescribed yet.</div>
                      <button 
                        onClick={() => setShowAddMedicineModal(true)}
                        className="bg-[#5B7CFA] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4A63D2] transition-colors"
                      >
                        Add First Medicine
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Finding Modal */}
          {showAddFindingModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#5B7CFA] mb-2">Doctor Findings</h2>
                    <div className="w-16 h-0.5 bg-[#5B7CFA] rounded-full mx-auto"></div>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setShowAddFindingModal(false)}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
                    aria-label="Close"
                    style={{lineHeight: 1}}
                  >
                    ×
                  </button>

                  {/* Form */}
                  <form onSubmit={handleSaveFinding} className="space-y-4">
                    {/* Cause Field */}
                                        <div>
                        <label className="block text-sm font-semibold text-black mb-2">Cause</label>
                        <input
                          type="text"
                          name="cause"
                          value={findingForm.cause}
                          onChange={handleFindingFormChange}
                          placeholder="Stomach ache"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                          required
                        />
                      </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Date Field */}
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={findingForm.date}
                          onChange={handleFindingFormChange}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Time Field */}
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={findingForm.time}
                          onChange={handleFindingFormChange}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Description</label>
                      <textarea
                        name="description"
                        value={findingForm.description}
                        onChange={handleFindingFormChange}
                        placeholder="Patient complains of mild abdominal discomfort, mostly after meals. No signs of nausea or vomiting. Vitals are within normal range. Suggested dietary changes and prescribed a mild antacid. Will follow up in one week if symptoms persist."
                        rows={5}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddFindingModal(false)}
                        className="px-4 py-2.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-[#5B7CFA] text-white rounded-lg hover:bg-[#4A63D2] transition-colors font-semibold shadow-md text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Add Suggestion Modal */}
          {showAddSuggestionModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#5B7CFA] mb-2">Doctor Suggestions</h2>
                    <div className="w-16 h-0.5 bg-[#5B7CFA] rounded-full mx-auto"></div>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => {
                      setShowAddSuggestionModal(false);
                      setSuggestionForm({ title: '', recommendation: '', followUp: '', notes: '' });
                    }}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
                    aria-label="Close"
                    style={{lineHeight: 1}}
                  >
                    ×
                  </button>

                  {/* Form */}
                  <form onSubmit={handleSaveSuggestion} className="space-y-4">
                    {/* Suggestion Title */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Suggestion Title</label>
                      <input
                        type="text"
                        name="title"
                        value={suggestionForm.title}
                        onChange={handleSuggestionFormChange}
                        placeholder="Patient Care Recommendation"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Recommendation */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Recommendation</label>
                      <textarea
                        name="recommendation"
                        value={suggestionForm.recommendation}
                        onChange={handleSuggestionFormChange}
                        placeholder="Based on the patient's condition, I recommend increasing fluid intake to 8-10 glasses per day. Consider a low-sodium diet and monitor blood pressure daily. Schedule follow-up appointment in 2 weeks."
                        rows={5}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Follow-up Instructions */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Follow-up Instructions</label>
                      <input
                        type="text"
                        name="followUp"
                        value={suggestionForm.followUp}
                        onChange={handleSuggestionFormChange}
                        placeholder="Schedule appointment in 2 weeks"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={suggestionForm.notes}
                        onChange={handleSuggestionFormChange}
                        placeholder="Any additional observations or recommendations..."
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSuggestionModal(false);
                          setSuggestionForm({ title: '', recommendation: '', followUp: '', notes: '' });
                        }}
                        className="px-4 py-2.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-[#5B7CFA] text-white rounded-lg hover:bg-[#4A63D2] transition-colors font-semibold shadow-md text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Add Medicine Modal */}
          {showAddMedicineModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-[#5B7CFA] mb-2">Add New Medicine</h2>
                    <div className="w-16 h-0.5 bg-[#5B7CFA] rounded-full mx-auto"></div>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => {
                      setShowAddMedicineModal(false);
                      setMedicineForm({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
                    }}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
                    aria-label="Close"
                    style={{lineHeight: 1}}
                  >
                    ×
                  </button>

                  {/* Form */}
                  <form onSubmit={handleSaveMedicine} className="space-y-4">
                    {/* Medicine Name */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Medicine Name</label>
                      <input
                        type="text"
                        name="name"
                        value={medicineForm.name}
                        onChange={handleMedicineFormChange}
                        placeholder="Pantonix Tablet 20mg"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Dosage</label>
                      <input
                        type="text"
                        name="dosage"
                        value={medicineForm.dosage}
                        onChange={handleMedicineFormChange}
                        placeholder="Day 2 times tablets"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Frequency and Duration Row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Frequency */}
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Frequency</label>
                        <input
                          type="text"
                          name="frequency"
                          value={medicineForm.frequency}
                          onChange={handleMedicineFormChange}
                          placeholder="2 times daily"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={medicineForm.duration}
                          onChange={handleMedicineFormChange}
                          placeholder="7 days"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Special Instructions</label>
                      <textarea
                        name="instructions"
                        value={medicineForm.instructions}
                        onChange={handleMedicineFormChange}
                        placeholder="Take with food. Do not take on empty stomach. Complete the full course even if symptoms disappear."
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMedicineModal(false);
                          setMedicineForm({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
                        }}
                        className="px-4 py-2.5 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-[#5B7CFA] text-white rounded-lg hover:bg-[#4A63D2] transition-colors font-semibold shadow-md text-sm"
                      >
                        Add Medicine
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}