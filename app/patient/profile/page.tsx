"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';

export default function PatientProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543"
    },
    medicalInfo: {
      bloodType: "O+",
      allergies: ["Penicillin", "Peanuts"],
      conditions: ["Hypertension"],
      medications: ["Lisinopril 10mg daily"],
      pastSurgeries: "",
      covidVaccine: "",
      tetanusVaccine: "",
      otherVaccines: "",
      insuranceCompany: "",
      insurancePolicy: "",
      insuranceContact: "",
      otherNotes: ""
    },
    preferences: {
      preferredLanguage: "English",
      communicationMethod: "Email",
      appointmentReminders: true,
      newsletter: false
    }
  });

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Patient Profile</h1>
            <p className="text-gray-700 text-lg">Comprehensive Medical Information Management (IMA Standards)</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-8 py-3 border-2 border-gray-300 text-black rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 text-lg font-medium">Patient</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-300"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({...profile, gender: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-300"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="text-black font-medium">{profile.gender}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address.street}
                      onChange={(e) => setProfile({
                        ...profile, 
                        address: {...profile.address, street: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.address.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address.city}
                      onChange={(e) => setProfile({
                        ...profile, 
                        address: {...profile.address, city: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter city"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.address.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address.state}
                      onChange={(e) => setProfile({
                        ...profile, 
                        address: {...profile.address, state: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter state"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.address.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.address.zipCode}
                      onChange={(e) => setProfile({
                        ...profile, 
                        address: {...profile.address, zipCode: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter ZIP code"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.address.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.emergencyContact.name}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {...profile.emergencyContact, name: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter contact name"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.emergencyContact.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {...profile.emergencyContact, relationship: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter relationship"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.emergencyContact.relationship}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile({
                        ...profile, 
                        emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.emergencyContact.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Medical Information (IMA Standards)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Blood Type</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.bloodType}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, bloodType: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter your blood type (A+, A-, B+, B-, AB+, AB-, O+, O-). This is important for emergency situations and blood transfusions."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.bloodType || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Allergies</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.allergies.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, allergies: e.target.value.split(", ")}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="List all known allergies including food, medication, environmental, and other allergies. Examples: Penicillin, Peanuts, Shellfish, Latex, Dust, Pollen, Bee stings, Sulfa drugs. Separate multiple allergies with commas. Include severity if known (mild, moderate, severe)."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.allergies.join(", ") || "None"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.conditions.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, conditions: e.target.value.split(", ")}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="List all current and past medical conditions, chronic diseases, and health issues. Examples: Diabetes Type 2, Hypertension, Asthma, Heart Disease, Depression, Anxiety, Arthritis, Thyroid Disorder, Cancer (with type and year), Kidney Disease. Include diagnosis date if known. Separate multiple conditions with commas."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.conditions.join(", ") || "None"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Current Medications</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.medications.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, medications: e.target.value.split(", ")}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="List all current medications including prescription drugs, over-the-counter medications, supplements, and vitamins. Include dosage, frequency, and reason for taking. Examples: Metformin 500mg twice daily for diabetes, Lisinopril 10mg once daily for blood pressure, Aspirin 81mg once daily for heart health, Vitamin D3 1000IU once daily. Separate multiple medications with commas."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.medications.join(", ") || "None"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Past Surgeries / Hospitalizations</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.pastSurgeries || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, pastSurgeries: e.target.value}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="List all past surgeries, procedures, and hospitalizations with dates, reasons, and outcomes. Examples: Appendectomy in 2018 due to appendicitis, Heart bypass surgery in 2020 for coronary artery disease, C-section in 2019 for childbirth, Knee replacement in 2021 for arthritis. Include any complications or ongoing issues."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.pastSurgeries || "None"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">COVID-19 Vaccination</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.covidVaccine || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, covidVaccine: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="COVID-19 vaccination status and details. Examples: Fully vaccinated with 2 doses of Pfizer in 2021, Partially vaccinated with 1 dose of Moderna in 2021, Not vaccinated due to medical reasons, Fully vaccinated with booster in 2022. Include vaccine type and dates if known."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.covidVaccine || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Tetanus Vaccination</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.tetanusVaccine || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, tetanusVaccine: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Tetanus vaccination status and last booster date. Examples: Up to date with booster in 2022, Last tetanus shot in 2019, Not vaccinated, Tdap booster in 2021. Tetanus boosters are typically needed every 10 years."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.tetanusVaccine || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Other Vaccinations</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.otherVaccines || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, otherVaccines: e.target.value}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="List all other vaccinations with dates and types. Examples: Hepatitis B series completed in 2020, Annual flu shot 2023, MMR (Measles, Mumps, Rubella) in childhood, Pneumonia vaccine in 2021, Shingles vaccine in 2022, HPV vaccine series in 2019. Include any vaccine reactions or allergies."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.otherVaccines || "None"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Insurance Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.insuranceCompany || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, insuranceCompany: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Primary health insurance company name and plan type. Examples: Star Health Insurance - Family Floater Plan, Max Bupa Health Insurance - Individual Plan, ICICI Lombard - Comprehensive Health Insurance, Government Health Scheme, Employer-provided insurance. Include secondary insurance if applicable."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.insuranceCompany || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Insurance Policy Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.insurancePolicy || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, insurancePolicy: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Insurance policy number and group number if applicable. Examples: STH123456789, MB001234567, ICICI-LOM-2023-001, Group: EMP123, Policy: FAM456. Keep this information secure and only share with healthcare providers."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.insurancePolicy || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Insurance Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.insuranceContact || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, insuranceContact: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Insurance company contact information for claims and support. Examples: 1800-123-456 (24/7 helpline), +91-9876543210 (customer service), claims@starhealth.com, www.starhealth.com/claims. Include both phone and email if available."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.insuranceContact || "Not specified"}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-black mb-2">Other Medical Notes</label>
                  {isEditing ? (
                    <textarea
                      value={profile.medicalInfo.otherNotes || ""}
                      onChange={(e) => setProfile({
                        ...profile, 
                        medicalInfo: {...profile.medicalInfo, otherNotes: e.target.value}
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Any other important medical information, special instructions, or notes for healthcare providers. Examples: Carry Epipen for severe peanut allergy, Wear medical alert bracelet for diabetes, Do not resuscitate (DNR) order on file, Religious or cultural health preferences, Language preferences for medical communication, Mobility assistance needed, Hearing or vision impairments, Emergency contact procedures."
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.otherNotes || "None"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Communication Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Preferred Language</label>
                  {isEditing ? (
                    <select
                      value={profile.preferences.preferredLanguage}
                      onChange={(e) => setProfile({
                        ...profile, 
                        preferences: {...profile.preferences, preferredLanguage: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-300"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  ) : (
                    <p className="text-black font-medium">{profile.preferences.preferredLanguage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Communication Method</label>
                  {isEditing ? (
                    <select
                      value={profile.preferences.communicationMethod}
                      onChange={(e) => setProfile({
                        ...profile, 
                        preferences: {...profile.preferences, communicationMethod: e.target.value}
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-300"
                    >
                      <option>Email</option>
                      <option>SMS</option>
                      <option>Phone</option>
                    </select>
                  ) : (
                    <p className="text-black font-medium">{profile.preferences.communicationMethod}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="appointmentReminders"
                    checked={profile.preferences.appointmentReminders}
                    onChange={(e) => setProfile({
                      ...profile, 
                      preferences: {...profile.preferences, appointmentReminders: e.target.checked}
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="appointmentReminders" className="ml-3 text-sm font-bold text-black">
                    Receive appointment reminders
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={profile.preferences.newsletter}
                    onChange={(e) => setProfile({
                      ...profile, 
                      preferences: {...profile.preferences, newsletter: e.target.checked}
                    })}
                    disabled={!isEditing}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="newsletter" className="ml-3 text-sm font-bold text-black">
                    Receive newsletter and updates
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 