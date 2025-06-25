"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { authAPI } from '@/app/services/api';

const statCards = [
  { label: "Total Patients", value: "12.3K" },
  { label: "New Patients", value: "1.2K" },
  { label: "Appointments", value: "3.4K" },
  { label: "Total Hours", value: "120 hr" },
];

const recentPatients = [
  { name: "Christine Brooks", id: "00001", doctor: "Dr. Rosie Pearson", date: "04 Sep 2019", department: "Medicine", status: "Completed" },
  { name: "Rosie Pearson", id: "00002", doctor: "Dr. Jasim", date: "28 May 2019", department: "Book", status: "Processing" },
  { name: "Darrell Caldwell", id: "00003", doctor: "Dr. Joseph", date: "23 Nov 2019", department: "Electric", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  "In Transit": "bg-blue-100 text-blue-700",
};

const TABS = ["Dashboard", "Profile", "Doctors", "Booking History", "Document", "Medical Records"];

export default function DoctorPatientsDashboard() {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      date: "2024-01-08",
      doctor: "Dr. Sarah Wilson",
      type: "General Checkup",
      diagnosis: "Healthy",
      prescription: "None required",
      notes: "Patient is in good health. Blood pressure and heart rate normal.",
      tests: ["Blood Pressure", "Heart Rate", "Temperature"],
      results: {
        "Blood Pressure": "120/80 mmHg",
        "Heart Rate": "72 bpm",
        "Temperature": "98.6°F"
      } as { [key: string]: string }
    },
    {
      id: 2,
      date: "2023-12-15",
      doctor: "Dr. Michael Chen",
      type: "Neurology Consultation",
      diagnosis: "Migraine",
      prescription: "Ibuprofen 400mg as needed",
      notes: "Patient experiencing occasional migraines. Recommend stress management techniques.",
      tests: ["Neurological Exam"],
      results: {
        "Neurological Exam": "Normal reflexes and coordination"
      } as { [key: string]: string }
    }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      prescribedBy: "Dr. Michael Chen",
      prescribedDate: "2023-12-15",
      refills: 2,
      status: "Active"
    }
  ]);

  const [labResults, setLabResults] = useState([
    {
      id: 1,
      testName: "Complete Blood Count",
      date: "2024-01-08",
      status: "Normal",
      results: {
        "Hemoglobin": "14.2 g/dL",
        "White Blood Cells": "7,500/μL",
        "Platelets": "250,000/μL"
      }
    },
    {
      id: 2,
      testName: "Lipid Panel",
      date: "2024-01-08",
      status: "Normal",
      results: {
        "Total Cholesterol": "180 mg/dL",
        "HDL": "55 mg/dL",
        "LDL": "100 mg/dL",
        "Triglycerides": "120 mg/dL"
      }
    }
  ]);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) setDate(value);
  };

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-700";
      case "Abnormal":
        return "bg-red-100 text-red-700";
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            <li><Link href="/doctor/dashboard" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Dashboard</Link></li>
            <li><Link href="/doctor/dashboard/patients" className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-bold shadow">Patients</Link></li>
            <li><Link href="/doctor/dashboard/appointments" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Appointments</Link></li>
            <li><Link href="/doctor/dashboard/payments" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Payments</Link></li>
            <li><Link href="/doctor/dashboard/notification" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Notification</Link></li>
            <li><Link href="/" className="flex items-center px-4 py-2 rounded-lg text-gray-700 font-normal hover:bg-[rgba(113,97,239,0.6)]">Logout</Link></li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        {/* Welcome and stats cards */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Patients Dashboard</h1>
            <p className="text-base text-gray-700">Overview of all patients and recent activity.</p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-gradient-to-r from-[#b7b8f3] to-[#7b6ffb] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <span className="text-sm font-medium mb-2 opacity-90">{card.label}</span>
              <span className="text-3xl font-bold mb-1">{card.value}</span>
            </div>
          ))}
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Left: Recent Patients Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-sm min-h-[210px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-800">Recent Patients</span>
                <Link href="/dashboard/patients" className="text-[#7b6ffb] font-medium text-xs hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                      <th className="py-2 px-1">ID</th>
                      <th className="py-2 px-1">Name</th>
                      <th className="py-2 px-1">Doctor</th>
                      <th className="py-2 px-1">Date</th>
                      <th className="py-2 px-1">Department</th>
                      <th className="py-2 px-1">Status</th>
                      <th className="py-2 px-1 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((p, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-1 font-mono text-gray-700">{p.id}</td>
                        <td className="py-2 px-1 text-gray-900">{p.name}</td>
                        <td className="py-2 px-1 text-gray-700">{p.doctor}</td>
                        <td className="py-2 px-1 text-gray-700">{p.date}</td>
                        <td className="py-2 px-1 text-gray-700">{p.department}</td>
                        <td className="py-2 px-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-200 text-gray-700'}`}>{p.status}</span>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <Link href={`/dashboard/patients/${p.id}`}>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                              View Profile
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Right: Calendar Widget */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-2 min-h-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-semibold text-gray-800">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
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
              </div>
            </div>
          </div>
        </div>
        {/* Full Patients Table Section */}
        <div className="mt-8">
          {/* Patients Heading, Tabs, Filter Bar */}
          {/* ...copy from /dashboard/patients/page.tsx... */}

          {/* Patients Table */}
          {/* ...copy from /dashboard/patients/page.tsx... */}
        </div>

        {/* Patient Medical Records */}
        <div className="mt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Medical Records</h1>
            <p className="text-gray-600">View the patient's complete medical history and test results</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview", count: medicalRecords.length },
                  { id: "prescriptions", label: "Prescriptions", count: prescriptions.length },
                  { id: "lab-results", label: "Lab Results", count: labResults.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-[#7b6ffb] text-[#7b6ffb]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                          <p className="text-sm text-gray-600">{record.doctor} • {record.date}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                          <p className="text-gray-700">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Prescription</h4>
                          <p className="text-gray-700">{record.prescription}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-gray-700">{record.notes}</p>
                      </div>
                      
                      {record.tests.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Tests & Results</h4>
                          <div className="space-y-2">
                            {record.tests.map((test) => (
                              <div key={test} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{test}</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {record.results[test]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === "prescriptions" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Prescriptions</h2>
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{prescription.medication}</h3>
                            <p className="text-sm text-gray-600">
                              {prescription.dosage} • {prescription.frequency}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                            {prescription.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Prescribed by:</span>
                            <p className="font-medium">{prescription.prescribedBy}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="font-medium">{prescription.prescribedDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Refills:</span>
                            <p className="font-medium">{prescription.refills} remaining</p>
                          </div>
                          <div>
                            <button className="px-4 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors text-sm">
                              Request Refill
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Results Tab */}
              {activeTab === "lab-results" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Laboratory Results</h2>
                  <div className="space-y-6">
                    {labResults.map((result) => (
                      <div key={result.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                            <p className="text-sm text-gray-600">Date: {result.date}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {Object.entries(result.results).map(([test, value]) => (
                            <div key={test} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{test}</span>
                              <span className="text-sm font-medium text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                            Download Report
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                            Share with Doctor
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Download Records</h3>
                  <p className="text-sm text-gray-600">Get your complete medical history</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Share Records</h3>
                  <p className="text-sm text-gray-600">Share with healthcare providers</p>
                </div>
              </button>

              <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Request Records</h3>
                  <p className="text-sm text-gray-600">Request from other providers</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MedicalRecordsTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      date: "2024-01-08",
      doctor: "Dr. Sarah Wilson",
      type: "General Checkup",
      diagnosis: "Healthy",
      prescription: "None required",
      notes: "Patient is in good health. Blood pressure and heart rate normal.",
      tests: ["Blood Pressure", "Heart Rate", "Temperature"],
      results: {
        "Blood Pressure": "120/80 mmHg",
        "Heart Rate": "72 bpm",
        "Temperature": "98.6°F"
      } as { [key: string]: string }
    },
    {
      id: 2,
      date: "2023-12-15",
      doctor: "Dr. Michael Chen",
      type: "Neurology Consultation",
      diagnosis: "Migraine",
      prescription: "Ibuprofen 400mg as needed",
      notes: "Patient experiencing occasional migraines. Recommend stress management techniques.",
      tests: ["Neurological Exam"],
      results: {
        "Neurological Exam": "Normal reflexes and coordination"
      } as { [key: string]: string }
    }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      prescribedBy: "Dr. Michael Chen",
      prescribedDate: "2023-12-15",
      refills: 2,
      status: "Active"
    }
  ]);

  const [labResults, setLabResults] = useState([
    {
      id: 1,
      testName: "Complete Blood Count",
      date: "2024-01-08",
      status: "Normal",
      results: {
        "Hemoglobin": "14.2 g/dL",
        "White Blood Cells": "7,500/μL",
        "Platelets": "250,000/μL"
      }
    },
    {
      id: 2,
      testName: "Lipid Panel",
      date: "2024-01-08",
      status: "Normal",
      results: {
        "Total Cholesterol": "180 mg/dL",
        "HDL": "55 mg/dL",
        "LDL": "100 mg/dL",
        "Triglycerides": "120 mg/dL"
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-700";
      case "Abnormal":
        return "bg-red-100 text-red-700";
      case "Active":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Medical Records</h1>
        <p className="text-gray-600">View the patient's complete medical history and test results</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", count: medicalRecords.length },
              { id: "prescriptions", label: "Prescriptions", count: prescriptions.length },
              { id: "lab-results", label: "Lab Results", count: labResults.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-[#7b6ffb] text-[#7b6ffb]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
              {medicalRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                      <p className="text-sm text-gray-600">{record.doctor} • {record.date}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Completed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                      <p className="text-gray-700">{record.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prescription</h4>
                      <p className="text-gray-700">{record.prescription}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-700">{record.notes}</p>
                  </div>
                  
                  {record.tests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Tests & Results</h4>
                      <div className="space-y-2">
                        {record.tests.map((test) => (
                          <div key={test} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{test}</span>
                            <span className="text-sm font-medium text-gray-900">
                              {record.results[test]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === "prescriptions" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Prescriptions</h2>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{prescription.medication}</h3>
                        <p className="text-sm text-gray-600">
                          {prescription.dosage} • {prescription.frequency}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Prescribed by:</span>
                        <p className="font-medium">{prescription.prescribedBy}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-medium">{prescription.prescribedDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Refills:</span>
                        <p className="font-medium">{prescription.refills} remaining</p>
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors text-sm">
                          Request Refill
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === "lab-results" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Laboratory Results</h2>
              <div className="space-y-6">
                {labResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                        <p className="text-sm text-gray-600">Date: {result.date}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(result.results).map(([test, value]) => (
                        <div key={test} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{test}</span>
                          <span className="text-sm font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        Download Report
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        Share with Doctor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Download Records</h3>
              <p className="text-sm text-gray-600">Get your complete medical history</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Share Records</h3>
              <p className="text-sm text-gray-600">Share with healthcare providers</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Request Records</h3>
              <p className="text-sm text-gray-600">Request from other providers</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 