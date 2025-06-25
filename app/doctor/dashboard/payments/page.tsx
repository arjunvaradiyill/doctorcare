"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authAPI } from '@/app/services/api';
import TopBar from '@/components/TopBar';
import DoctorSidebar from '@/app/doctor/components/DoctorSidebar';

interface Payment {
  id: string;
  patientName: string;
  patientEmail: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  appointmentId: string;
  paymentMethod: string;
  description: string;
}

interface PaymentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedPayments: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock payment data
  const mockPayments: Payment[] = [
    {
      id: '1',
      patientName: 'Alice Johnson',
      patientEmail: 'alice.johnson@email.com',
      amount: 150.00,
      status: 'completed',
      date: '2024-01-25',
      appointmentId: 'APT-001',
      paymentMethod: 'Credit Card',
      description: 'Cardiology Consultation'
    },
    {
      id: '2',
      patientName: 'John Doe',
      patientEmail: 'john.doe@email.com',
      amount: 200.00,
      status: 'pending',
      date: '2024-01-24',
      appointmentId: 'APT-002',
      paymentMethod: 'Insurance',
      description: 'Neurology Consultation'
    },
    {
      id: '3',
      patientName: 'Sarah Williams',
      patientEmail: 'sarah.williams@email.com',
      amount: 175.00,
      status: 'completed',
      date: '2024-01-23',
      appointmentId: 'APT-003',
      paymentMethod: 'Debit Card',
      description: 'Pediatrics Consultation'
    },
    {
      id: '4',
      patientName: 'Mike Johnson',
      patientEmail: 'mike.johnson@email.com',
      amount: 300.00,
      status: 'failed',
      date: '2024-01-22',
      appointmentId: 'APT-004',
      paymentMethod: 'Credit Card',
      description: 'Surgery Consultation'
    },
    {
      id: '5',
      patientName: 'Lisa Garcia',
      patientEmail: 'lisa.garcia@email.com',
      amount: 125.00,
      status: 'completed',
      date: '2024-01-21',
      appointmentId: 'APT-005',
      paymentMethod: 'Cash',
      description: 'General Checkup'
    },
    {
      id: '6',
      patientName: 'David Brown',
      patientEmail: 'david.brown@email.com',
      amount: 250.00,
      status: 'pending',
      date: '2024-01-20',
      appointmentId: 'APT-006',
      paymentMethod: 'Insurance',
      description: 'Dermatology Consultation'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = authAPI.getCurrentUser();
        setCurrentUser(user);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setPayments(mockPayments);
        
        // Calculate stats
        const totalEarnings = mockPayments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        
        const monthlyEarnings = mockPayments
          .filter(p => p.status === 'completed' && new Date(p.date).getMonth() === new Date().getMonth())
          .reduce((sum, p) => sum + p.amount, 0);
        
        const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
        const completedPayments = mockPayments.filter(p => p.status === 'completed').length;
        
        setStats({
          totalEarnings,
          monthlyEarnings,
          pendingPayments,
          completedPayments
        });
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = !searchTerm || 
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
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
          <TopBar onSearch={handleSearch} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Payments & Earnings
            </h1>
            <p className="text-base text-gray-600">Manage your payments and track your earnings</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-[#7b6ffb] font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 border border-gray-200 transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </div>
            </button>
            <button className="bg-[#7b6ffb] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-[#6a5de8] transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Request Payment
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
                <p className="text-xs opacity-75 mt-1">All time earnings</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Monthly Earnings</p>
                <p className="text-3xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
                <p className="text-xs opacity-75 mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Pending Payments</p>
                <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                <p className="text-xs opacity-75 mt-1">Awaiting payment</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Completed Payments</p>
                <p className="text-3xl font-bold">{stats.completedPayments}</p>
                <p className="text-xs opacity-75 mt-1">Successfully processed</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-[#7b6ffb] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Payments
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'completed' 
                  ? 'bg-[#7b6ffb] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'pending' 
                  ? 'bg-[#7b6ffb] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'failed' 
                  ? 'bg-[#7b6ffb] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Failed
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.patientName}</div>
                        <div className="text-sm text-gray-500">{payment.patientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.appointmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-[#7b6ffb] hover:text-[#6a5de8]">
                          View Details
                        </button>
                        {payment.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-800">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">No payments match your current filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 