"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function MedicalRecordsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const handleLogout = () => {
    authAPI.logout();
  };
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
        name: "Metformin",
        dosage: "500mg",
        route: "Oral",
        frequency: "Twice daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
        name: "Amlodipine",
        dosage: "5mg",
        route: "Oral",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
        name: "Aspirin",
        dosage: "81mg",
        route: "Oral",
        frequency: "Once daily",
        prescribedBy: "Dr. Sarah Wilson",
        startDate: "2024-01-15"
      },
      {
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
        date: "2024-01-15",
        time: "08:30",
        doctor: "Dr. Sarah Wilson",
        note: "Patient admitted with acute chest pain radiating to left arm. ECG shows ST-segment elevation consistent with inferior wall MI. Started on aspirin, nitroglycerin, and morphine for pain. Cardiac catheterization recommended."
      },
      {
        date: "2024-01-15",
        time: "14:00",
        doctor: "Dr. Sarah Wilson",
        note: "Patient's pain has improved with medication. Troponin levels elevated confirming myocardial infarction. Patient stable on cardiac monitoring. Family informed of condition."
      },
      {
        date: "2024-01-16",
        time: "09:00",
        doctor: "Dr. Sarah Wilson",
        note: "Patient had uneventful night. Vital signs stable. Pain controlled. Planning for cardiac catheterization today. Patient and family education provided regarding heart disease and lifestyle modifications."
      }
    ]
  });

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'vitals', name: 'Vitals', icon: '❤️' },
    { id: 'medications', name: 'Medications', icon: '💊' },
    { id: 'labs', name: 'Lab Results', icon: '🔬' },
    { id: 'treatment', name: 'Treatment', icon: '🏥' },
    { id: 'billing', name: 'Billing', icon: '💰' },
    { id: 'notes', name: 'Notes', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">MR</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Medical Records</h1>
                <p className="text-sm text-black">Patient ID: {patientData.admissionDetails.patientId}</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-black">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-xs text-black">NHO Standards Compliant</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Export PDF
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {patientData.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{patientData.personalInfo.fullName}</h2>
                  <p className="text-black">{patientData.personalInfo.age} years • {patientData.personalInfo.gender} • {patientData.personalInfo.bloodGroup}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-black uppercase tracking-wide">Department</p>
                  <p className="font-semibold text-black">{patientData.admissionDetails.department}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-black uppercase tracking-wide">Room</p>
                  <p className="font-semibold text-black">{patientData.admissionDetails.roomNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-black uppercase tracking-wide">Doctor</p>
                  <p className="font-semibold text-black">{patientData.admissionDetails.consultingDoctor}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-black uppercase tracking-wide">Admitted</p>
                  <p className="font-semibold text-black">{patientData.admissionDetails.admissionDate}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Admission Type</span>
                  <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full font-semibold">
                    {patientData.admissionDetails.admissionType}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🚨</span>
                  <span className="text-lg font-bold">{patientData.admissionDetails.admissionType.toUpperCase()}</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">{patientData.admissionDetails.reasonForAdmission}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-black hover:text-black hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Medical History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    📋
                  </span>
                  Medical History
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-black mb-2">Chronic Conditions</h4>
                    <div className="space-y-2">
                      {patientData.medicalHistory.chronicConditions.map((condition, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-black">{condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-2">Allergies</h4>
                    <div className="space-y-2">
                      {patientData.medicalHistory.allergies.map((allergy, index) => (
                        <div key={index} className={`rounded-lg p-3 border ${
                          allergy.severity === 'Severe' 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{allergy.allergen}</p>
                              <p className="text-sm opacity-80">{allergy.reaction}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                              {allergy.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    📞
                  </span>
                  Emergency Contact
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="font-semibold text-green-900">{patientData.personalInfo.emergencyContact.name}</p>
                  <p className="text-sm text-green-700">{patientData.personalInfo.emergencyContact.relationship}</p>
                  <p className="text-sm text-green-700">{patientData.personalInfo.emergencyContact.phone}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-black mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-black">📱</span>
                      <span className="text-sm text-black">{patientData.personalInfo.contactNumber}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-black mt-1">📍</span>
                      <span className="text-sm text-black">{patientData.personalInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  ❤️
                </span>
                Vital Signs Monitoring
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">Date/Time</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">BP</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">Pulse</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">Temp</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">O2 Sat</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-black uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {patientData.vitalsMonitoring.map((vital, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-medium text-black">{vital.date}</p>
                            <p className="text-xs text-black">{vital.time}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {vital.bloodPressure}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-black">{vital.pulse}</td>
                        <td className="py-4 px-4 text-sm text-black">{vital.temperature}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {vital.oxygenSaturation}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-black max-w-xs">{vital.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  💊
                </span>
                Current Medications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientData.currentMedications.map((medication, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-black">{medication.name}</h4>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {medication.route}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Dosage:</span>
                        <span className="font-medium text-black">{medication.dosage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Frequency:</span>
                        <span className="font-medium text-black">{medication.frequency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Prescribed:</span>
                        <span className="font-medium text-black">{medication.prescribedBy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Started:</span>
                        <span className="font-medium text-black">{medication.startDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Results Tab */}
          {activeTab === 'labs' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
                <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  🔬
                </span>
                Laboratory Investigations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientData.labInvestigations.map((lab, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-black">{lab.testName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        lab.status === 'Done' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Date:</span>
                        <span className="font-medium text-black">{lab.date}</span>
                      </div>
                      <div>
                        <span className="text-sm text-black">Remarks:</span>
                        <p className="text-sm text-black mt-1">{lab.remarks}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Tab */}
          {activeTab === 'treatment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      🏥
                    </span>
                    Current Treatment
                  </h3>
                  <div className="space-y-3">
                    {patientData.treatmentPlan.currentTreatment.map((treatment, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-black">{treatment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      🍽️
                    </span>
                    Diet Restrictions
                  </h3>
                  <div className="space-y-3">
                    {patientData.treatmentPlan.dietRestrictions.map((restriction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-black">{restriction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      📊
                    </span>
                    Monitoring Instructions
                  </h3>
                  <div className="space-y-3">
                    {patientData.treatmentPlan.monitoringInstructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-black">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      ⚠️
                    </span>
                    Activity Restrictions
                  </h3>
                  <div className="space-y-3">
                    {patientData.treatmentPlan.activityRestrictions.map((restriction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-black">{restriction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  💰
                </span>
                Billing Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">Room</p>
                  <p className="text-xl font-bold text-blue-900">${patientData.billingSummary.roomCharges.total}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 uppercase tracking-wide mb-1">Doctor</p>
                  <p className="text-xl font-bold text-green-900">${patientData.billingSummary.doctorConsultation.total}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">Medications</p>
                  <p className="text-xl font-bold text-purple-900">${patientData.billingSummary.medications.total}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-yellow-600 uppercase tracking-wide mb-1">Lab Tests</p>
                  <p className="text-xl font-bold text-yellow-900">${patientData.billingSummary.labTests.total}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-red-600 uppercase tracking-wide mb-1">Procedures</p>
                  <p className="text-xl font-bold text-red-900">${patientData.billingSummary.procedures.total}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-black uppercase tracking-wide mb-1">Total</p>
                  <p className="text-xl font-bold text-black">${patientData.billingSummary.totalCharges}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  📝
                </span>
                Doctor's Notes
              </h3>
              <div className="space-y-4">
                {patientData.doctorsNotes.map((note, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-l-4 border-indigo-500">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-black">{note.doctor}</p>
                        <p className="text-sm text-black">{note.date} at {note.time}</p>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        Note #{index + 1}
                      </span>
                    </div>
                    <p className="text-black leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-sm text-black mb-2">This document is generated in accordance with National Health Organization (NHO) standards</p>
            <p className="text-xs text-black">For official use only - Medical Records Department</p>
          </div>
        </div>
      </div>
    </div>
  );
} 