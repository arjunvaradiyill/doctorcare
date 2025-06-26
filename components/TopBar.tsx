"use client";
import React, { useState, useEffect } from "react";
import { authAPI, User, ProfileData, UpdateProfileData } from "@/app/services/api";

export default function TopBar({ user, onSidebarToggle, onSearch }: { user?: User | null, onSidebarToggle?: () => void, onSearch?: (value: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Use passed user prop or get current user
    if (user) {
      setCurrentUser(user);
    } else {
      const loggedInUser = authAPI.getCurrentUser();
      setCurrentUser(loggedInUser);
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const profile = await authAPI.getProfile();
      setProfileData(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to default data if API fails
      setProfileData({
        _id: '1',
        fullName: 'Sarah Elizabeth Johnson',
        email: 'sarah.johnson@doctorcare.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        dateOfBirth: '1985-03-15',
        department: 'Administration',
        position: 'Senior Administrator',
        employeeId: 'EMP001',
        joinDate: '2020-01-15',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        permissions: ['dashboard', 'patients', 'doctors', 'appointments', 'reports'],
        stats: {
          patients: 1250,
          appointments: 3420,
          rating: 4.8
        },
        gender: 'female',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      setIsLoading(true);
      const updateData: UpdateProfileData = {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        dateOfBirth: profileData.dateOfBirth,
        department: profileData.department,
        position: profileData.position
      };
      
      await authAPI.updateProfile(updateData);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    loadProfileData(); // Reload original data
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileData) return;

    try {
      setIsLoading(true);
      const result = await authAPI.uploadProfileImage(file);
      setProfileData({
        ...profileData,
        profileImage: result.imageUrl
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowProfile = () => {
    setShowProfileModal(true);
    setShowProfileMenu(false);
    loadProfileData();
  };

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

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="p-4 bg-[#f7f8fa]">
      <div className="w-full flex items-center bg-white rounded-full shadow-lg px-4 py-2 gap-4">
        {/* Sidebar Toggle */}
        <button
          className="w-10 h-10 flex items-center justify-center"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {/* Search Bar */}
        <div className="flex-1 flex items-center">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
          />
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative">
            <button
              className="focus:outline-none"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Show notifications"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">{notifications.length}</span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                <div className="p-4 font-semibold border-b border-gray-100">Notifications</div>
                <ul>
                  {notifications.map(n => (
                    <li key={n.id} className="px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">{n.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              aria-label="Select language"
            >
              <img src={languages.find(l => l.label === selectedLanguage)?.flag} alt="Flag" className="w-6 h-4 rounded-sm object-cover" />
              <span className="text-gray-700 font-medium text-sm">{selectedLanguage}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedLanguage === lang.label ? 'font-bold' : ''}`}
                    onClick={() => { setSelectedLanguage(lang.label); setShowLanguageMenu(false); }}
                  >
                    <img src={lang.flag} alt={lang.label} className="w-6 h-4 rounded-sm object-cover" />
                    <span className="text-sm">{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Show profile menu"
            >
              <img 
                src={profileData?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"} 
                alt={currentUser?.username || "User"} 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <div className="flex flex-col items-start">
                <span className="text-gray-800 font-semibold text-sm">{currentUser?.username || "User"}</span>
                <span className="text-gray-400 text-xs">{currentUser?.role || "Admin"}</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm" onClick={handleShowProfile}>View Profile</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm" onClick={handleLogout}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentUser?.role === 'admin'
                  ? 'Admin Profile'
                  : currentUser?.role === 'doctor'
                  ? 'Doctor Profile'
                  : 'Patient Profile'}
              </h2>
              <button
                onClick={() => {
                  if (isEditMode) {
                    handleCancel();
                  } else {
                    setShowProfileModal(false);
                  }
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              ) : profileData ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column - Profile Image and Stats */}
                  <div className="xl:col-span-1">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center sticky top-0">
                      {/* Profile Image */}
                      <div className="relative inline-block mb-6">
                        <img
                          src={profileData.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"}
                          alt={profileData.fullName}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {isEditMode && (
                          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfileImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Name and Position/Role */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{profileData.fullName}</h3>
                      <p className="text-gray-600 mb-6">
                        {currentUser?.role === 'admin'
                          ? 'System Administrator'
                          : currentUser?.role === 'doctor'
                          ? 'Doctor'
                          : 'Patient'}
                      </p>

                      {/* Stats (show rating only for doctor, hide for admin/patient) */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{profileData.stats.patients?.toLocaleString?.() ?? '-'}</div>
                          <div className="text-sm text-gray-600">Patients</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{profileData.stats.appointments?.toLocaleString?.() ?? '-'}</div>
                          <div className="text-sm text-gray-600">Appointments</div>
                        </div>
                        {currentUser?.role === 'doctor' && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{profileData.stats.rating ?? '-'}</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {!isEditMode ? (
                        <button
                          onClick={() => setIsEditMode(true)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Profile Details */}
                  <div className="xl:col-span-2">
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                          <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={profileData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.fullName}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            {isEditMode ? (
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.email}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            {isEditMode ? (
                              <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.phone}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.location}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            {isEditMode ? (
                              <input
                                type="date"
                                value={profileData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Professional Information (only for admin/doctor) */}
                      {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                            Professional Information
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Department</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  value={profileData.department}
                                  onChange={(e) => handleInputChange('department', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              ) : (
                                <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.department}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Position</label>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  value={profileData.position}
                                  onChange={(e) => handleInputChange('position', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              ) : (
                                <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.position}</p>
                              )}
                            </div>
                            {/* Only show Employee ID and Join Date for admin/doctor */}
                            {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                              <>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                  <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{profileData.employeeId}</p>
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                  <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Permissions (only for admin/doctor) */}
                      {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Permissions
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {profileData.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                              >
                                {permission.charAt(0).toUpperCase() + permission.slice(1)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Failed to load profile data
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 