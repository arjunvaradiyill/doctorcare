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
    <div className="p-8">
      <div className="w-full">
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
                        address: { ...profile.address, street: e.target.value }
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
                        address: { ...profile.address, city: e.target.value }
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
                        address: { ...profile.address, state: e.target.value }
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
                        address: { ...profile.address, zipCode: e.target.value }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.emergencyContact.name}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, name: e.target.value }
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
                        emergencyContact: { ...profile.emergencyContact, relationship: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter relationship"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.emergencyContact.relationship}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Contact Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter contact phone"
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
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Blood Type</label>
                  {isEditing ? (
                    <select
                      value={profile.medicalInfo.bloodType}
                      onChange={(e) => setProfile({
                        ...profile,
                        medicalInfo: { ...profile.medicalInfo, bloodType: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-300"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.bloodType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Allergies</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.allergies.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile,
                        medicalInfo: { ...profile.medicalInfo, allergies: e.target.value.split(", ") }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter allergies (comma separated)"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.allergies.join(", ")}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Medical Conditions</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.conditions.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile,
                        medicalInfo: { ...profile.medicalInfo, conditions: e.target.value.split(", ") }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter medical conditions (comma separated)"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.conditions.join(", ")}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Current Medications</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.medicalInfo.medications.join(", ")}
                      onChange={(e) => setProfile({
                        ...profile,
                        medicalInfo: { ...profile.medicalInfo, medications: e.target.value.split(", ") }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-500 transition-all duration-300"
                      placeholder="Enter current medications (comma separated)"
                    />
                  ) : (
                    <p className="text-black font-medium">{profile.medicalInfo.medications.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 