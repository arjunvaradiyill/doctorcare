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
          <MedicalRecordsTab />
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
        </div> */}
      </main>
    </div>
  );
}

function MedicalRecordsTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [patientData, setPatientData] = useState({
    // Patient Admission Details
    admissionDetails: {
      patientId: "IP-2024-001",
      admissionDate: "2024-01-15",
      department: "Cardiology",
      consultingDoctor: "Dr. Sarah Wilson",
      roomNumber: "C-205",
      wardNumber: "Cardiac Care Unit",
      reasonForAdmission: "Acute myocardial infarction with chest pain and shortness of breath",
      admissionType: "Emergency"
    },
    
    // Patient Personal Information
    personalInfo: {
      fullName: "John Michael Anderson",
      gender: "Male",
      age: 58,
      dateOfBirth: "1966-03-15",
      bloodGroup: "O+",
      contactNumber: "+1 (555) 123-4567",
      emergencyContact: {
        name: "Mary Anderson",
        relationship: "Spouse",
        phone: "+1 (555) 987-6543"
      },
      address: "123 Oak Street, Springfield, IL 62701"
    },
    
    // Medical History
    medicalHistory: {
      chronicConditions: [
        "Hypertension (diagnosed 2010)",
        "Type 2 Diabetes (diagnosed 2015)",
        "Hyperlipidemia (diagnosed 2018)"
      ],
      surgicalHistory: [
        {
          procedure: "Appendectomy",
          date: "1995-06-20",
          hospital: "Springfield General Hospital"
        },
        {
          procedure: "Cataract Surgery (Right Eye)",
          date: "2020-03-10",
          hospital: "Springfield Eye Institute"
        }
      ],
      allergies: [
        {
          allergen: "Penicillin",
          reaction: "Rash and difficulty breathing",
          severity: "Severe"
        },
        {
          allergen: "Sulfa drugs",
          reaction: "Nausea and vomiting",
          severity: "Moderate"
        }
      ],
      familyHistory: [
        "Father: Heart disease (deceased at 65)",
        "Mother: Diabetes (alive, age 82)",
        "Sister: Hypertension (alive, age 55)"
      ]
    },
    
    // Current Medications
    currentMedications: [
      {
        id: 1,
        name: "Metformin",
        dosage: "500mg",
        route: "Oral",
        frequency: "Twice daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
        id: 2,
        name: "Amlodipine",
        dosage: "5mg",
        route: "Oral",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
        id: 3,
        name: "Aspirin",
        dosage: "81mg",
        route: "Oral",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
        id: 4,
        name: "Atorvastatin",
        dosage: "20mg",
        route: "Oral",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      }
    ],
    
    // Vitals Monitoring
    vitalsMonitoring: [
      {
        id: 1,
        date: "2024-01-15",
        time: "08:00",
        bloodPressure: "160/95",
        pulse: "88",
        temperature: "98.6°F",
        respirationRate: "18",
        oxygenSaturation: "96%",
        notes: "Patient admitted with chest pain"
      },
      {
        id: 2,
        date: "2024-01-15",
        time: "12:00",
        bloodPressure: "155/90",
        pulse: "82",
        temperature: "98.4°F",
        respirationRate: "16",
        oxygenSaturation: "97%",
        notes: "Post-medication administration"
      },
      {
        id: 3,
        date: "2024-01-15",
        time: "16:00",
        bloodPressure: "150/88",
        pulse: "78",
        temperature: "98.2°F",
        respirationRate: "15",
        oxygenSaturation: "98%",
        notes: "Stable condition"
      },
      {
        id: 4,
        date: "2024-01-16",
        time: "08:00",
        bloodPressure: "145/85",
        pulse: "76",
        temperature: "98.0°F",
        respirationRate: "14",
        oxygenSaturation: "98%",
        notes: "Improving condition"
      }
    ],
    
    // Lab Investigations
    labInvestigations: [
      {
        testName: "Complete Blood Count (CBC)",
        date: "2024-01-15",
        status: "Done",
        remarks: "WBC: 8.5, RBC: 4.8, Hemoglobin: 14.2, Platelets: 250,000"
      },
      {
        testName: "Cardiac Enzymes (Troponin)",
        date: "2024-01-15",
        status: "Done",
        remarks: "Troponin I: 2.5 ng/mL (elevated), CK-MB: 45 ng/mL"
      },
      {
        testName: "Electrocardiogram (ECG)",
        date: "2024-01-15",
        status: "Done",
        remarks: "ST-segment elevation in leads II, III, aVF"
      },
      {
        testName: "Chest X-Ray",
        date: "2024-01-15",
        status: "Done",
        remarks: "Normal cardiac silhouette, clear lung fields"
      },
      {
        testName: "Echocardiogram",
        date: "2024-01-16",
        status: "Pending",
        remarks: "Scheduled for tomorrow morning"
      },
      {
        testName: "Lipid Profile",
        date: "2024-01-16",
        status: "Pending",
        remarks: "Fasting required"
      }
    ],
    
    // Treatment Plan
    treatmentPlan: {
      currentTreatment: [
        "Cardiac monitoring in CCU",
        "Oxygen therapy as needed",
        "Pain management with nitroglycerin",
        "Antiplatelet therapy with aspirin",
        "Beta-blocker therapy (Metoprolol)",
        "ACE inhibitor therapy (Lisinopril)"
      ],
      dietRestrictions: [
        "Low-sodium diet (<2g/day)",
        "Low-fat diet",
        "Diabetic diet (carbohydrate controlled)",
        "No caffeine or alcohol"
      ],
      monitoringInstructions: [
        "Continuous cardiac monitoring",
        "Vital signs every 4 hours",
        "Blood glucose monitoring 4 times daily",
        "Daily weight measurement",
        "Strict bed rest for first 24 hours"
      ],
      activityRestrictions: [
        "Bed rest for first 24 hours",
        "Gradual ambulation with assistance",
        "No heavy lifting or strenuous activity",
        "Cardiac rehabilitation referral upon discharge"
      ]
    },
    
    // Interim Billing Summary
    billingSummary: {
      roomCharges: {
        dailyRate: 850,
        daysStayed: 2,
        total: 1700
      },
      doctorConsultation: {
        cardiologist: 300,
        emergencyPhysician: 200,
        total: 500
      },
      medications: {
        emergencyMedications: 150,
        regularMedications: 75,
        total: 225
      },
      labTests: {
        cbc: 85,
        cardiacEnzymes: 120,
        ecg: 95,
        chestXray: 110,
        total: 410
      },
      procedures: {
        ivInsertion: 50,
        cardiacMonitoring: 200,
        total: 250
      },
      totalCharges: 3085
    },
    
    // Doctor's Notes
    doctorsNotes: [
      {
        id: 1,
        date: "2024-01-15",
        time: "08:30",
        doctor: "Dr. Sarah Wilson",
        note: "Patient admitted with acute chest pain radiating to left arm. ECG shows ST-segment elevation consistent with inferior wall MI. Started on aspirin, nitroglycerin, and morphine for pain. Cardiac catheterization recommended."
      },
      {
        id: 2,
        date: "2024-01-15",
        time: "14:00",
        doctor: "Dr. Sarah Wilson",
        note: "Patient's pain has improved with medication. Troponin levels elevated confirming myocardial infarction. Patient stable on cardiac monitoring. Family informed of condition."
      },
      {
        id: 3,
        date: "2024-01-16",
        time: "09:00",
        doctor: "Dr. Sarah Wilson",
        note: "Patient had uneventful night. Vital signs stable. Pain controlled. Planning for cardiac catheterization today. Patient and family education provided regarding heart disease and lifestyle modifications."
      }
    ]
  });

  // Form states for interactive features
  const [vitalsForm, setVitalsForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    bloodPressure: "",
    pulse: "",
    temperature: "",
    respirationRate: "",
    oxygenSaturation: "",
    notes: ""
  });

  const [notesForm, setNotesForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    doctor: "Dr. Sarah Wilson",
    note: ""
  });

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    route: "Oral",
    frequency: "",
    prescribedBy: "Dr. Sarah Wilson",
    startDate: new Date().toISOString().split('T')[0]
  });

  // Edit states
  const [editingVital, setEditingVital] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [showAddMedication, setShowAddMedication] = useState(false);

  // Quick Actions Modal States
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState("");

  // Quick Action Form States
  const [addVitalsForm, setAddVitalsForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    bloodPressure: "",
    pulse: "",
    temperature: "",
    respirationRate: "",
    oxygenSaturation: "",
    notes: ""
  });

  const [prescribeForm, setPrescribeForm] = useState({
    medicationName: "",
    dosage: "",
    route: "Oral",
    frequency: "",
    duration: "",
    instructions: "",
    prescribedBy: "Dr. Sarah Wilson"
  });

  const [addNoteForm, setAddNoteForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    noteType: "Clinical",
    note: "",
    doctor: "Dr. Sarah Wilson"
  });

  const [orderTestsForm, setOrderTestsForm] = useState({
    testName: "",
    testType: "Blood",
    priority: "Routine",
    instructions: "",
    orderedBy: "Dr. Sarah Wilson"
  });

  const [downloadRecordsForm, setDownloadRecordsForm] = useState({
    recordType: "Complete",
    dateRange: "All",
    format: "PDF",
    includeNotes: true,
    includeLabs: true
  });

  const [shareRecordsForm, setShareRecordsForm] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientType: "Doctor",
    recordType: "Complete",
    accessDuration: "7 days",
    message: ""
  });

  const [showDetails, setShowDetails] = useState(false);

  const handleVitalsSubmit = () => {
    if (!vitalsForm.bloodPressure || !vitalsForm.pulse) {
      alert("Please fill in required fields (Blood Pressure and Pulse)");
      return;
    }

    const newVital = {
      id: Date.now(),
      ...vitalsForm
    };

    setPatientData(prev => ({
      ...prev,
      vitalsMonitoring: [...prev.vitalsMonitoring, newVital]
    }));

    // Reset form
    setVitalsForm({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressure: "",
      pulse: "",
      temperature: "",
      respirationRate: "",
      oxygenSaturation: "",
      notes: ""
    });

    alert("Vital signs added successfully!");
  };

  const handleVitalsEdit = (vital) => {
    setEditingVital(vital);
    setVitalsForm({
      date: vital.date,
      time: vital.time,
      bloodPressure: vital.bloodPressure,
      pulse: vital.pulse,
      temperature: vital.temperature,
      respirationRate: vital.respirationRate,
      oxygenSaturation: vital.oxygenSaturation,
      notes: vital.notes
    });
  };

  const handleVitalsUpdate = () => {
    setPatientData(prev => ({
      ...prev,
      vitalsMonitoring: prev.vitalsMonitoring.map(vital => 
        vital.id === editingVital.id ? { ...vital, ...vitalsForm } : vital
      )
    }));

    setEditingVital(null);
    setVitalsForm({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      bloodPressure: "",
      pulse: "",
      temperature: "",
      respirationRate: "",
      oxygenSaturation: "",
      notes: ""
    });

    alert("Vital signs updated successfully!");
  };

  const handleVitalsDelete = (vitalId) => {
    if (confirm("Are you sure you want to delete this vital sign record?")) {
      setPatientData(prev => ({
        ...prev,
        vitalsMonitoring: prev.vitalsMonitoring.filter(vital => vital.id !== vitalId)
      }));
      alert("Vital sign record deleted successfully!");
    }
  };

  // Handlers for Doctor Notes
  const handleNotesSubmit = () => {
    if (!notesForm.note.trim()) {
      alert("Please enter a clinical note");
      return;
    }

    const newNote = {
      id: Date.now(),
      ...notesForm
    };

    setPatientData(prev => ({
      ...prev,
      doctorsNotes: [...prev.doctorsNotes, newNote]
    }));

    // Reset form
    setNotesForm({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      doctor: "Dr. Sarah Wilson",
      note: ""
    });

    alert("Clinical note added successfully!");
  };

  const handleNotesEdit = (note) => {
    setEditingNote(note);
    setNotesForm({
      date: note.date,
      time: note.time,
      doctor: note.doctor,
      note: note.note
    });
  };

  const handleNotesUpdate = () => {
    setPatientData(prev => ({
      ...prev,
      doctorsNotes: prev.doctorsNotes.map(note => 
        note.id === editingNote.id ? { ...note, ...notesForm } : note
      )
    }));

    setEditingNote(null);
    setNotesForm({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      doctor: "Dr. Sarah Wilson",
      note: ""
    });

    alert("Clinical note updated successfully!");
  };

  const handleNotesDelete = (noteId) => {
    if (confirm("Are you sure you want to delete this clinical note?")) {
      setPatientData(prev => ({
        ...prev,
        doctorsNotes: prev.doctorsNotes.filter(note => note.id !== noteId)
      }));
      alert("Clinical note deleted successfully!");
    }
  };

  // Handlers for Medications
  const handleMedicationEdit = (medication) => {
    setEditingMedication(medication);
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      route: medication.route,
      frequency: medication.frequency,
      prescribedBy: medication.prescribedBy,
      startDate: medication.startDate
    });
  };

  const handleMedicationUpdate = () => {
    if (!medicationForm.name || !medicationForm.dosage || !medicationForm.frequency) {
      alert("Please fill in all required fields");
      return;
    }

    setPatientData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.map(med => 
        med.id === editingMedication.id ? { ...med, ...medicationForm } : med
      )
    }));

    setEditingMedication(null);
    setMedicationForm({
      name: "",
      dosage: "",
      route: "Oral",
      frequency: "",
      prescribedBy: "Dr. Sarah Wilson",
      startDate: new Date().toISOString().split('T')[0]
    });

    alert("Medication updated successfully!");
  };

  const handleMedicationDiscontinue = (medicationId) => {
    if (confirm("Are you sure you want to discontinue this medication?")) {
      setPatientData(prev => ({
        ...prev,
        currentMedications: prev.currentMedications.filter(med => med.id !== medicationId)
      }));
      alert("Medication discontinued successfully!");
    }
  };

  const handleAddMedication = () => {
    if (!medicationForm.name || !medicationForm.dosage || !medicationForm.frequency) {
      alert("Please fill in all required fields");
      return;
    }

    const newMedication = {
      id: Date.now(),
      ...medicationForm
    };

    setPatientData(prev => ({
      ...prev,
      currentMedications: [...prev.currentMedications, newMedication]
    }));

    setMedicationForm({
      name: "",
      dosage: "",
      route: "Oral",
      frequency: "",
      prescribedBy: "Dr. Sarah Wilson",
      startDate: new Date().toISOString().split('T')[0]
    });

    setShowAddMedication(false);
    alert("Medication added successfully!");
  };

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
      case "Done":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Quick Action Handlers
  const handleQuickAction = (action: string) => {
    setActiveQuickAction(action);
    setShowQuickActionModal(true);
  };

  const handleAddVitalsQuick = () => {
    if (!addVitalsForm.bloodPressure || !addVitalsForm.pulse) {
      alert("Please fill in required fields (Blood Pressure and Pulse)");
      return;
    }

    const newVital = {
      id: Date.now(),
      ...addVitalsForm
    };

    setPatientData(prev => ({
      ...prev,
      vitalsMonitoring: [...prev.vitalsMonitoring, newVital]
    }));

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert("Vital signs added successfully!");
  };

  const handlePrescribe = () => {
    if (!prescribeForm.medicationName || !prescribeForm.dosage || !prescribeForm.frequency) {
      alert("Please fill in all required fields");
      return;
    }

    const newMedication = {
      id: Date.now(),
      name: prescribeForm.medicationName,
      dosage: prescribeForm.dosage,
      route: prescribeForm.route,
      frequency: prescribeForm.frequency,
      prescribedBy: prescribeForm.prescribedBy,
      startDate: new Date().toISOString().split('T')[0]
    };

    setPatientData(prev => ({
      ...prev,
      currentMedications: [...prev.currentMedications, newMedication]
    }));

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert("Medication prescribed successfully!");
  };

  const handleAddNoteQuick = () => {
    if (!addNoteForm.note.trim()) {
      alert("Please enter a clinical note");
      return;
    }

    const newNote = {
      id: Date.now(),
      date: addNoteForm.date,
      time: addNoteForm.time,
      doctor: addNoteForm.doctor,
      note: addNoteForm.note
    };

    setPatientData(prev => ({
      ...prev,
      doctorsNotes: [...prev.doctorsNotes, newNote]
    }));

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert("Clinical note added successfully!");
  };

  const handleOrderTests = () => {
    if (!orderTestsForm.testName) {
      alert("Please enter test name");
      return;
    }

    const newTest = {
      testName: orderTestsForm.testName,
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      remarks: `Ordered by ${orderTestsForm.orderedBy}. Priority: ${orderTestsForm.priority}. ${orderTestsForm.instructions}`
    };

    setPatientData(prev => ({
      ...prev,
      labInvestigations: [...prev.labInvestigations, newTest]
    }));

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert("Test ordered successfully!");
  };

  const handleViewReports = () => {
    setShowQuickActionModal(false);
    setActiveQuickAction("");
    // Navigate to reports tab or show reports
    alert("Reports functionality - Navigate to Reports section");
  };

  const handleBilling = () => {
    setShowQuickActionModal(false);
    setActiveQuickAction("");
    // Navigate to billing tab or show billing
    alert("Billing functionality - Navigate to Billing section");
  };

  const handleDownloadRecords = () => {
    if (!downloadRecordsForm.recordType) {
      alert("Please select record type");
      return;
    }

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert(`Downloading ${downloadRecordsForm.recordType} records in ${downloadRecordsForm.format} format...`);
  };

  const handleShareRecords = () => {
    if (!shareRecordsForm.recipientEmail || !shareRecordsForm.recipientName) {
      alert("Please fill in recipient details");
      return;
    }

    setShowQuickActionModal(false);
    setActiveQuickAction("");
    alert(`Records shared with ${shareRecordsForm.recipientName} (${shareRecordsForm.recipientEmail})`);
  };

  const handleViewProfile = () => {
    setShowQuickActionModal(false);
    setActiveQuickAction("");
    // Navigate to patient profile or show profile details
    alert("Viewing patient profile - Navigate to Profile section");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Medical Records</h1>
        <p className="text-gray-600">NHO-compliant comprehensive medical history and details</p>
      </div>

      {/* Interactive Features Highlight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Interactive Features Available</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Vitals Tab</p>
              <p className="text-sm text-gray-600">Add new vital signs</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Doctor Notes Tab</p>
              <p className="text-sm text-gray-600">Add clinical notes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Medications Tab</p>
              <p className="text-sm text-gray-600">Edit prescriptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", count: 9 },
              { id: "admission", label: "Admission", count: 1 },
              { id: "personal", label: "Personal Info", count: 1 },
              { id: "history", label: "Medical History", count: 4 },
              { id: "medications", label: "Medications", count: patientData.currentMedications.length },
              { id: "vitals", label: "Vitals", count: patientData.vitalsMonitoring.length },
              { id: "labs", label: "Lab Tests", count: patientData.labInvestigations.length },
              { id: "treatment", label: "Treatment", count: 4 },
              { id: "billing", label: "Billing", count: 1 },
              { id: "notes", label: "Doctor Notes", count: patientData.doctorsNotes.length }
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
              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => handleQuickAction("addVitals")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📋</div>
                    <div className="text-sm font-medium text-gray-900">Add Vitals</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("prescribe")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">💊</div>
                    <div className="text-sm font-medium text-gray-900">Prescribe</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("addNote")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📝</div>
                    <div className="text-sm font-medium text-gray-900">Add Note</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("orderTests")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">🔬</div>
                    <div className="text-sm font-medium text-gray-900">Order Tests</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("viewReports")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-gray-900">View Reports</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("billing")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">💳</div>
                    <div className="text-sm font-medium text-gray-900">Billing</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("downloadRecords")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📥</div>
                    <div className="text-sm font-medium text-gray-900">Download Records</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("shareRecords")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">📤</div>
                    <div className="text-sm font-medium text-gray-900">Share Records</div>
                  </button>
                  <button 
                    onClick={() => handleQuickAction("viewProfile")}
                    className="p-4 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    <div className="text-blue-600 text-2xl mb-2">👤</div>
                    <div className="text-sm font-medium text-gray-900">View Profile</div>
                  </button>
                </div>
              </div>
              {/* Recent Patients trigger */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Recent Patients
                </button>
              </div>
              {/* Only show details if showDetails is true */}
              {showDetails && (
                <>
                  {/* Patient Admission Details */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Admission Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                          <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border">{patientData.admissionDetails.patientId}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                          <p className="text-sm text-gray-900">{patientData.admissionDetails.admissionDate}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <p className="text-sm text-gray-900">{patientData.admissionDetails.department}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Consulting Doctor</label>
                          <p className="text-sm text-gray-900">{patientData.admissionDetails.consultingDoctor}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                          <p className="text-sm text-gray-900">{patientData.admissionDetails.roomNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                          <p className="text-sm text-gray-900">{patientData.admissionDetails.wardNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Admission Type</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            patientData.admissionDetails.admissionType === 'Emergency' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {patientData.admissionDetails.admissionType}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Admission</label>
                          <p className="text-sm text-gray-900 leading-relaxed">{patientData.admissionDetails.reasonForAdmission}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Personal Information */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="text-sm text-gray-900 font-medium">{patientData.personalInfo.fullName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <p className="text-sm text-gray-900">{patientData.personalInfo.gender}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <p className="text-sm text-gray-900">{patientData.personalInfo.age} years</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <p className="text-sm text-gray-900">{patientData.personalInfo.dateOfBirth}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {patientData.personalInfo.bloodGroup}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                          <p className="text-sm text-gray-900">{patientData.personalInfo.contactNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                          <div className="bg-gray-50 p-3 rounded border">
                            <p className="text-sm text-gray-900 font-medium">{patientData.personalInfo.emergencyContact.name}</p>
                            <p className="text-sm text-gray-600">{patientData.personalInfo.emergencyContact.relationship}</p>
                            <p className="text-sm text-gray-600">{patientData.personalInfo.emergencyContact.phone}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <p className="text-sm text-gray-900 leading-relaxed">{patientData.personalInfo.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical History Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Chronic Conditions</h4>
                        <ul className="space-y-1">
                          {patientData.medicalHistory.chronicConditions.map((condition, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Surgical History</h4>
                        <ul className="space-y-1">
                          {patientData.medicalHistory.surgicalHistory.map((surgery, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              <div className="font-medium">{surgery.procedure}</div>
                              <div className="text-gray-600">{surgery.date}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                        <ul className="space-y-1">
                          {patientData.medicalHistory.allergies.map((allergy, index) => (
                            <li key={index} className="text-sm text-gray-700">
                              <div className="font-medium">{allergy.allergen}</div>
                              <div className="text-gray-600">{allergy.reaction}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Family History</h4>
                        <ul className="space-y-1">
                          {patientData.medicalHistory.familyHistory.map((history, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {history}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Current Medications Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {patientData.currentMedications.map((medication, index) => (
                        <div key={medication.id} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="font-medium text-gray-900 text-sm">{medication.name}</div>
                          <div className="text-gray-600 text-sm">{medication.dosage}</div>
                          <div className="text-gray-600 text-sm">{medication.frequency}</div>
                          <div className="text-gray-500 text-xs mt-1">{medication.route}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Vitals Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vitals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {patientData.vitalsMonitoring.slice(-4).map((vital, index) => (
                        <div key={vital.id} className="bg-gray-50 p-4 rounded-lg border text-center">
                          <div className="text-sm text-gray-600 mb-1">{vital.date}</div>
                          <div className="font-medium text-gray-900">BP: {vital.bloodPressure}</div>
                          <div className="text-sm text-gray-600">Pulse: {vital.pulse}</div>
                          <div className="text-sm text-gray-600">Temp: {vital.temperature}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lab Tests Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Investigations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {patientData.labInvestigations.map((test, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-900 text-sm">{test.testName}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              test.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {test.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{test.date}</div>
                          {test.remarks && (
                            <div className="text-sm text-gray-500 mt-1">{test.remarks}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Plan Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Current Treatment</h4>
                        <ul className="space-y-1">
                          {patientData.treatmentPlan.currentTreatment.map((treatment, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {treatment}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Diet Restrictions</h4>
                        <ul className="space-y-1">
                          {patientData.treatmentPlan.dietRestrictions.map((diet, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {diet}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Monitoring</h4>
                        <ul className="space-y-1">
                          {patientData.treatmentPlan.monitoringInstructions.map((instruction, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Activity Restrictions</h4>
                        <ul className="space-y-1">
                          {patientData.treatmentPlan.activityRestrictions.map((restriction, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {restriction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Billing Summary */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Room Charges</div>
                        <div className="font-medium text-gray-900">${patientData.billingSummary.roomCharges.total}</div>
                        <div className="text-xs text-gray-500">{patientData.billingSummary.roomCharges.daysStayed} days</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Doctor Consultation</div>
                        <div className="font-medium text-gray-900">${patientData.billingSummary.doctorConsultation.total}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Medications</div>
                        <div className="font-medium text-gray-900">${patientData.billingSummary.medications.total}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">Lab Tests</div>
                        <div className="font-medium text-gray-900">${patientData.billingSummary.labTests.total}</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-600 mb-1">Total Charges</div>
                        <div className="font-bold text-blue-900 text-lg">${patientData.billingSummary.totalCharges}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Doctor Notes */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Doctor Notes</h3>
                    <div className="space-y-4">
                      {patientData.doctorsNotes.slice(-3).map((note, index) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{note.doctor}</p>
                              <p className="text-sm text-gray-600">{note.date} at {note.time}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Admission Details Tab */}
          {activeTab === "admission" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Admission Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Patient ID</label>
                  <p className="text-gray-900 font-semibold">{patientData.admissionDetails.patientId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Date</label>
                  <p className="text-gray-900 font-semibold">{patientData.admissionDetails.admissionDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-900 font-semibold">{patientData.admissionDetails.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Consulting Doctor</label>
                  <p className="text-gray-900 font-semibold">{patientData.admissionDetails.consultingDoctor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Room/Ward</label>
                  <p className="text-gray-900 font-semibold">{patientData.admissionDetails.roomNumber} - {patientData.admissionDetails.wardNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Type</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    patientData.admissionDetails.admissionType === 'Emergency' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {patientData.admissionDetails.admissionType}
                  </span>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium text-gray-600">Reason for Admission</label>
                  <p className="text-gray-900">{patientData.admissionDetails.reasonForAdmission}</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.bloodGroup}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Number</label>
                  <p className="text-gray-900 font-semibold">{patientData.personalInfo.contactNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                  <p className="text-gray-900">
                    {patientData.personalInfo.emergencyContact.name} ({patientData.personalInfo.emergencyContact.relationship}) - {patientData.personalInfo.emergencyContact.phone}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{patientData.personalInfo.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical History</h2>
              
              <div className="space-y-6">
                {/* Chronic Conditions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chronic Conditions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.medicalHistory.chronicConditions.map((condition, index) => (
                      <li key={index} className="text-gray-700">{condition}</li>
                    ))}
                  </ul>
                </div>

                {/* Surgical History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Surgical History</h3>
                  <div className="space-y-3">
                    {patientData.medicalHistory.surgicalHistory.map((surgery, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{surgery.procedure}</p>
                        <p className="text-sm text-gray-600">{surgery.date} - {surgery.hospital}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Allergies</h3>
                  <div className="space-y-3">
                    {patientData.medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-900">{allergy.allergen}</p>
                            <p className="text-sm text-red-700">{allergy.reaction}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Family Medical History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Medical History</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.medicalHistory.familyHistory.map((history, index) => (
                      <li key={index} className="text-gray-700">{history}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === "medications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Current Medications</h2>
                <button 
                  onClick={() => setShowAddMedication(!showAddMedication)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {showAddMedication ? "Cancel" : "Add New Medication"}
                </button>
              </div>

              {/* Add New Medication Form */}
              {showAddMedication && (
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Add New Medication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Medication Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Metformin"
                        value={medicationForm.name}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Dosage *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 500mg"
                        value={medicationForm.dosage}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, dosage: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Route</label>
                      <select 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={medicationForm.route}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, route: e.target.value }))}
                      >
                        <option value="Oral">Oral</option>
                        <option value="Intravenous">Intravenous</option>
                        <option value="Intramuscular">Intramuscular</option>
                        <option value="Subcutaneous">Subcutaneous</option>
                        <option value="Topical">Topical</option>
                        <option value="Inhalation">Inhalation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Frequency *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Twice daily"
                        value={medicationForm.frequency}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, frequency: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Prescribed By</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={medicationForm.prescribedBy}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, prescribedBy: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-900 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={medicationForm.startDate}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleAddMedication}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Add Medication
                    </button>
                    <button 
                      onClick={() => {
                        setShowAddMedication(false);
                        setMedicationForm({
                          name: "",
                          dosage: "",
                          route: "Oral",
                          frequency: "",
                          prescribedBy: "Dr. Sarah Wilson",
                          startDate: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Medication Modal */}
              {editingMedication && (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Edit Medication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Medication Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.name}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Dosage *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.dosage}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, dosage: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Route</label>
                      <select 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.route}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, route: e.target.value }))}
                      >
                        <option value="Oral">Oral</option>
                        <option value="Intravenous">Intravenous</option>
                        <option value="Intramuscular">Intramuscular</option>
                        <option value="Subcutaneous">Subcutaneous</option>
                        <option value="Topical">Topical</option>
                        <option value="Inhalation">Inhalation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Frequency *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.frequency}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, frequency: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Prescribed By</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.prescribedBy}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, prescribedBy: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={medicationForm.startDate}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleMedicationUpdate}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                    >
                      Update Medication
                    </button>
                    <button 
                      onClick={() => {
                        setEditingMedication(null);
                        setMedicationForm({
                          name: "",
                          dosage: "",
                          route: "Oral",
                          frequency: "",
                          prescribedBy: "Dr. Sarah Wilson",
                          startDate: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Medications Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescribed By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientData.currentMedications.map((medication, index) => (
                      <tr key={medication.id} className={editingMedication?.id === medication.id ? "bg-yellow-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medication.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.dosage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.route}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.prescribedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleMedicationEdit(medication)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleMedicationDiscontinue(medication.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Discontinue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === "vitals" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vitals Monitoring</h2>
              
              {/* Add New Vital Signs Section */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">
                  {editingVital ? "Edit Vital Signs" : "Add New Vital Signs"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={vitalsForm.date}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={vitalsForm.time}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Blood Pressure *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 120/80"
                      value={vitalsForm.bloodPressure}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Pulse *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 72"
                      value={vitalsForm.pulse}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, pulse: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Temperature</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 98.6°F"
                      value={vitalsForm.temperature}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">Respiration Rate</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 16"
                      value={vitalsForm.respirationRate}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, respirationRate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-1">O2 Saturation</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 98%"
                      value={vitalsForm.oxygenSaturation}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    <label className="block text-sm font-medium text-green-900 mb-1">Notes</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Additional observations or notes..."
                      value={vitalsForm.notes}
                      onChange={(e) => setVitalsForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  {editingVital ? (
                    <>
                      <button 
                        onClick={handleVitalsUpdate}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Update Vitals
                      </button>
                      <button 
                        onClick={() => {
                          setEditingVital(null);
                          setVitalsForm({
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toTimeString().slice(0, 5),
                            bloodPressure: "",
                            pulse: "",
                            temperature: "",
                            respirationRate: "",
                            oxygenSaturation: "",
                            notes: ""
                          });
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleVitalsSubmit}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Save Vitals
                      </button>
                      <button 
                        onClick={() => setVitalsForm({
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toTimeString().slice(0, 5),
                          bloodPressure: "",
                          pulse: "",
                          temperature: "",
                          respirationRate: "",
                          oxygenSaturation: "",
                          notes: ""
                        })}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Vitals Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pulse</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O2 Sat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientData.vitalsMonitoring.map((vital, index) => (
                      <tr key={vital.id} className={editingVital?.id === vital.id ? "bg-yellow-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.bloodPressure}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.pulse}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.temperature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.respirationRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.oxygenSaturation}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{vital.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleVitalsEdit(vital)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleVitalsDelete(vital.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lab Tests Tab */}
          {activeTab === "labs" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lab Investigations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patientData.labInvestigations.map((lab, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lab.testName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lab.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lab.status)}`}>
                            {lab.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{lab.remarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                          <button className="text-green-600 hover:text-green-900">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Treatment Plan Tab */}
          {activeTab === "treatment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Plan</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Treatment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Treatment</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.treatmentPlan.currentTreatment.map((treatment, index) => (
                      <li key={index} className="text-gray-700">{treatment}</li>
                    ))}
                  </ul>
                </div>

                {/* Diet Restrictions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Diet Restrictions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.treatmentPlan.dietRestrictions.map((restriction, index) => (
                      <li key={index} className="text-gray-700">{restriction}</li>
                    ))}
                  </ul>
                </div>

                {/* Monitoring Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Monitoring Instructions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.treatmentPlan.monitoringInstructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">{instruction}</li>
                    ))}
                  </ul>
                </div>

                {/* Activity Restrictions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Restrictions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {patientData.treatmentPlan.activityRestrictions.map((restriction, index) => (
                      <li key={index} className="text-gray-700">{restriction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interim Billing Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Room Charges</h3>
                  <p className="text-2xl font-bold text-blue-900">${patientData.billingSummary.roomCharges.total}</p>
                  <p className="text-sm text-blue-700">${patientData.billingSummary.roomCharges.dailyRate}/day × {patientData.billingSummary.roomCharges.daysStayed} days</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Doctor Consultation</h3>
                  <p className="text-2xl font-bold text-green-900">${patientData.billingSummary.doctorConsultation.total}</p>
                  <p className="text-sm text-green-700">Cardiologist + Emergency Physician</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Medications</h3>
                  <p className="text-2xl font-bold text-purple-900">${patientData.billingSummary.medications.total}</p>
                  <p className="text-sm text-purple-700">Emergency + Regular medications</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Lab Tests</h3>
                  <p className="text-2xl font-bold text-yellow-900">${patientData.billingSummary.labTests.total}</p>
                  <p className="text-sm text-yellow-700">CBC, Cardiac Enzymes, ECG, X-Ray</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Procedures</h3>
                  <p className="text-2xl font-bold text-red-900">${patientData.billingSummary.procedures.total}</p>
                  <p className="text-sm text-red-700">IV Insertion + Cardiac Monitoring</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Total Charges</h3>
                  <p className="text-2xl font-bold text-gray-900">${patientData.billingSummary.totalCharges}</p>
                  <p className="text-sm text-gray-700">Interim total as of today</p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor's Notes</h2>
              
              {/* Add New Note Section */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  {editingNote ? "Edit Clinical Note" : "Add New Clinical Note"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={notesForm.date}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={notesForm.time}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">Doctor</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={notesForm.doctor}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, doctor: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-900 mb-1">Clinical Note *</label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your clinical observations, treatment plan updates, or patient status notes..."
                    value={notesForm.note}
                    onChange={(e) => setNotesForm(prev => ({ ...prev, note: e.target.value }))}
                  ></textarea>
                </div>
                <div className="flex gap-3">
                  {editingNote ? (
                    <>
                      <button 
                        onClick={handleNotesUpdate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Update Note
                      </button>
                      <button 
                        onClick={() => {
                          setEditingNote(null);
                          setNotesForm({
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toTimeString().slice(0, 5),
                            doctor: "Dr. Sarah Wilson",
                            note: ""
                          });
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleNotesSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Note
                      </button>
                      <button 
                        onClick={() => setNotesForm({
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toTimeString().slice(0, 5),
                          doctor: "Dr. Sarah Wilson",
                          note: ""
                        })}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Existing Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Previous Notes</h3>
                {patientData.doctorsNotes.map((note, index) => (
                  <div key={note.id} className={`bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 ${editingNote?.id === note.id ? "ring-2 ring-blue-300" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{note.doctor}</p>
                        <p className="text-sm text-gray-600">{note.date} at {note.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleNotesEdit(note)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleNotesDelete(note.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{note.note}</p>
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
              <p className="text-sm text-gray-600">Get complete medical history</p>
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
              <h3 className="font-semibold text-gray-900">Add Note</h3>
              <p className="text-sm text-gray-600">Add clinical notes</p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions Modal */}
      {showQuickActionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeQuickAction === "addVitals" && "Add Vital Signs"}
                {activeQuickAction === "prescribe" && "Prescribe Medication"}
                {activeQuickAction === "addNote" && "Add Clinical Note"}
                {activeQuickAction === "orderTests" && "Order Laboratory Tests"}
                {activeQuickAction === "viewReports" && "View Reports"}
                {activeQuickAction === "billing" && "Billing Information"}
                {activeQuickAction === "downloadRecords" && "Download Medical Records"}
                {activeQuickAction === "shareRecords" && "Share Medical Records"}
                {activeQuickAction === "viewProfile" && "Patient Profile"}
              </h2>
              <button 
                onClick={() => setShowQuickActionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Add Vitals Modal */}
            {activeQuickAction === "addVitals" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={addVitalsForm.date}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={addVitalsForm.time}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 120/80"
                      value={addVitalsForm.bloodPressure}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pulse *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 72"
                      value={addVitalsForm.pulse}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, pulse: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 98.6°F"
                      value={addVitalsForm.temperature}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respiration Rate</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 16"
                      value={addVitalsForm.respirationRate}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, respirationRate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">O2 Saturation</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 98%"
                      value={addVitalsForm.oxygenSaturation}
                      onChange={(e) => setAddVitalsForm(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional observations..."
                    value={addVitalsForm.notes}
                    onChange={(e) => setAddVitalsForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleAddVitalsQuick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Vitals
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Prescribe Medication Modal */}
            {activeQuickAction === "prescribe" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Metformin"
                      value={prescribeForm.medicationName}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, medicationName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 500mg"
                      value={prescribeForm.dosage}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={prescribeForm.route}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, route: e.target.value }))}
                    >
                      <option value="Oral">Oral</option>
                      <option value="Intravenous">Intravenous</option>
                      <option value="Intramuscular">Intramuscular</option>
                      <option value="Subcutaneous">Subcutaneous</option>
                      <option value="Topical">Topical</option>
                      <option value="Inhalation">Inhalation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Twice daily"
                      value={prescribeForm.frequency}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, frequency: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 7 days"
                      value={prescribeForm.duration}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed By</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={prescribeForm.prescribedBy}
                      onChange={(e) => setPrescribeForm(prev => ({ ...prev, prescribedBy: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions for the patient..."
                    value={prescribeForm.instructions}
                    onChange={(e) => setPrescribeForm(prev => ({ ...prev, instructions: e.target.value }))}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handlePrescribe}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Prescribe
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add Note Modal */}
            {activeQuickAction === "addNote" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={addNoteForm.date}
                      onChange={(e) => setAddNoteForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={addNoteForm.time}
                      onChange={(e) => setAddNoteForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={addNoteForm.noteType}
                      onChange={(e) => setAddNoteForm(prev => ({ ...prev, noteType: e.target.value }))}
                    >
                      <option value="Clinical">Clinical</option>
                      <option value="Progress">Progress</option>
                      <option value="Discharge">Discharge</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Note *</label>
                  <textarea 
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your clinical observations, treatment plan updates, or patient status notes..."
                    value={addNoteForm.note}
                    onChange={(e) => setAddNoteForm(prev => ({ ...prev, note: e.target.value }))}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={addNoteForm.doctor}
                    onChange={(e) => setAddNoteForm(prev => ({ ...prev, doctor: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleAddNoteQuick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Note
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Order Tests Modal */}
            {activeQuickAction === "orderTests" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Complete Blood Count"
                      value={orderTestsForm.testName}
                      onChange={(e) => setOrderTestsForm(prev => ({ ...prev, testName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={orderTestsForm.testType}
                      onChange={(e) => setOrderTestsForm(prev => ({ ...prev, testType: e.target.value }))}
                    >
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Imaging">Imaging</option>
                      <option value="Cardiac">Cardiac</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={orderTestsForm.priority}
                      onChange={(e) => setOrderTestsForm(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      <option value="Routine">Routine</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordered By</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={orderTestsForm.orderedBy}
                      onChange={(e) => setOrderTestsForm(prev => ({ ...prev, orderedBy: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions for the lab..."
                    value={orderTestsForm.instructions}
                    onChange={(e) => setOrderTestsForm(prev => ({ ...prev, instructions: e.target.value }))}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleOrderTests}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Order Test
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Download Records Modal */}
            {activeQuickAction === "downloadRecords" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={downloadRecordsForm.recordType}
                      onChange={(e) => setDownloadRecordsForm(prev => ({ ...prev, recordType: e.target.value }))}
                    >
                      <option value="Complete">Complete Medical History</option>
                      <option value="Current">Current Admission</option>
                      <option value="Vitals">Vital Signs Only</option>
                      <option value="Medications">Medications Only</option>
                      <option value="LabResults">Lab Results Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={downloadRecordsForm.dateRange}
                      onChange={(e) => setDownloadRecordsForm(prev => ({ ...prev, dateRange: e.target.value }))}
                    >
                      <option value="All">All Records</option>
                      <option value="Last30Days">Last 30 Days</option>
                      <option value="Last3Months">Last 3 Months</option>
                      <option value="LastYear">Last Year</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={downloadRecordsForm.format}
                      onChange={(e) => setDownloadRecordsForm(prev => ({ ...prev, format: e.target.value }))}
                    >
                      <option value="PDF">PDF</option>
                      <option value="Word">Word Document</option>
                      <option value="Excel">Excel Spreadsheet</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Include Sections</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={downloadRecordsForm.includeNotes}
                        onChange={(e) => setDownloadRecordsForm(prev => ({ ...prev, includeNotes: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-700">Clinical Notes</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={downloadRecordsForm.includeLabs}
                        onChange={(e) => setDownloadRecordsForm(prev => ({ ...prev, includeLabs: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-700">Lab Results</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleDownloadRecords}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Download Records
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Share Records Modal */}
            {activeQuickAction === "shareRecords" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Dr. John Smith"
                      value={shareRecordsForm.recipientName}
                      onChange={(e) => setShareRecordsForm(prev => ({ ...prev, recipientName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email *</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., doctor@hospital.com"
                      value={shareRecordsForm.recipientEmail}
                      onChange={(e) => setShareRecordsForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shareRecordsForm.recipientType}
                      onChange={(e) => setShareRecordsForm(prev => ({ ...prev, recipientType: e.target.value }))}
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Specialist">Specialist</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Patient">Patient</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Duration</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shareRecordsForm.accessDuration}
                      onChange={(e) => setShareRecordsForm(prev => ({ ...prev, accessDuration: e.target.value }))}
                    >
                      <option value="7 days">7 days</option>
                      <option value="30 days">30 days</option>
                      <option value="90 days">90 days</option>
                      <option value="1 year">1 year</option>
                      <option value="Permanent">Permanent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={shareRecordsForm.recordType}
                    onChange={(e) => setShareRecordsForm(prev => ({ ...prev, recordType: e.target.value }))}
                  >
                    <option value="Complete">Complete Medical History</option>
                    <option value="Current">Current Admission</option>
                    <option value="Vitals">Vital Signs Only</option>
                    <option value="Medications">Medications Only</option>
                    <option value="LabResults">Lab Results Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a message to accompany the shared records..."
                    value={shareRecordsForm.message}
                    onChange={(e) => setShareRecordsForm(prev => ({ ...prev, message: e.target.value }))}
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleShareRecords}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Share Records
                  </button>
                  <button 
                    onClick={() => setShowQuickActionModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* View Reports Modal */}
            {activeQuickAction === "viewReports" && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
                  <p className="text-gray-600 mb-4">Navigate to the Reports section to view detailed patient reports and analytics.</p>
                  <button 
                    onClick={handleViewReports}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Go to Reports
                  </button>
                </div>
              </div>
            )}

            {/* Billing Modal */}
            {activeQuickAction === "billing" && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Information</h3>
                  <p className="text-gray-600 mb-4">Navigate to the Billing section to view and manage patient billing details.</p>
                  <button 
                    onClick={handleBilling}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Go to Billing
                  </button>
                </div>
              </div>
            )}

            {/* View Profile Modal */}
            {activeQuickAction === "viewProfile" && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👤</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Profile</h3>
                  <p className="text-gray-600 mb-4">Navigate to the Patient Profile section to view detailed patient information and demographics.</p>
                  <button 
                    onClick={handleViewProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 