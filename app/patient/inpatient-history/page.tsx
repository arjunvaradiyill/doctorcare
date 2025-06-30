"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';

export default function InPatientHistoryPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">In-Patient Medical History</h1>
              <p className="text-gray-600 mt-1">Patient ID: {patientData.admissionDetails.patientId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">NHO Standards Compliant</p>
            </div>
          </div>
        </div>

        {/* 1. Patient Admission Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            1. Patient Admission Details
          </h2>
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

        {/* 2. Patient Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            2. Patient Personal Information
          </h2>
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

        {/* 3. Medical History */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            3. Medical History
          </h2>
          
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

        {/* 4. Current Medications */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            4. Current Medications
          </h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patientData.currentMedications.map((medication, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medication.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.dosage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.prescribedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Vitals Monitoring */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            5. Vitals Monitoring
          </h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patientData.vitalsMonitoring.map((vital, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.bloodPressure}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.pulse}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.temperature}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.respirationRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.oxygenSaturation}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{vital.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Lab Investigations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            6. Lab Investigations
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patientData.labInvestigations.map((lab, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lab.testName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lab.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lab.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lab.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Treatment Plan */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            7. Treatment Plan
          </h2>
          
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

        {/* 8. Interim Billing Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            8. Interim Billing Summary
          </h2>
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

        {/* 9. Doctor's Notes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            9. Doctor's Notes
          </h2>
          <div className="space-y-4">
            {patientData.doctorsNotes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
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

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-sm text-gray-600">
            <p>This document is generated in accordance with National Health Organization (NHO) standards</p>
            <p className="mt-1">For official use only - Medical Records Department</p>
          </div>
        </div>
      </div>
    </div>
  );
} 