"use client";
import React, { useState, useEffect } from "react";
import TopBar from '@/components/TopBar';
import DoctorSidebar from '@/app/doctor/components/DoctorSidebar';

interface Notification {
  id: string;
  type: 'appointment' | 'system' | 'reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Alice Johnson at 10:00 AM today.',
    date: '2024-06-20T08:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Follow-up Reminder',
    message: 'Follow up with John Doe regarding his test results.',
    date: '2024-06-19T15:00:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'The CareBot system will undergo maintenance on June 25th, 2024.',
    date: '2024-06-18T12:00:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Appointment Cancelled',
    message: 'Patient Sarah Williams has cancelled her appointment.',
    date: '2024-06-17T09:00:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Prescription Renewal',
    message: 'Renew prescription for Mike Johnson.',
    date: '2024-06-16T11:00:00Z',
    read: false,
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'appointment' | 'system' | 'reminder'>('all');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
        <DoctorSidebar />
        <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b6ffb]"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans">
      <DoctorSidebar />
      <main className="flex-1 pt-0 pr-8 pb-8 pl-8">
        <div className="mb-6">
          <TopBar onSearch={() => {}} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-base text-gray-600">Stay up to date with your latest notifications</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-[#7b6ffb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'unread' ? 'bg-[#7b6ffb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Unread</button>
            <button onClick={() => setFilter('appointment')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'appointment' ? 'bg-[#7b6ffb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Appointments</button>
            <button onClick={() => setFilter('reminder')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'reminder' ? 'bg-[#7b6ffb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Reminders</button>
            <button onClick={() => setFilter('system')} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'system' ? 'bg-[#7b6ffb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>System</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 && (
              <li className="text-center py-12 text-gray-500">No notifications found.</li>
            )}
            {filteredNotifications.map(n => (
              <li key={n.id} className={`flex items-start gap-4 px-6 py-5 ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
                <div className="flex-shrink-0 mt-1">
                  {n.type === 'appointment' && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                  )}
                  {n.type === 'reminder' && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20h.01" /></svg>
                    </span>
                  )}
                  {n.type === 'system' && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{n.title}</h3>
                    <span className="text-xs text-gray-400">{new Date(n.date).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 mt-1 mb-2">{n.message}</p>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-xs text-blue-600 hover:underline font-medium">Mark as read</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
} 