"use client";
import React, { useState, useEffect } from "react";
import { authAPI } from '@/app/services/api';

export default function PatientPayments() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [payments, setPayments] = useState([
    {
      id: 1,
      date: "2024-01-08",
      description: "General Checkup - Dr. Sarah Wilson",
      amount: 150.00,
      status: "paid",
      paymentMethod: "Credit Card",
      invoiceNumber: "INV-2024-001"
    },
    {
      id: 2,
      date: "2024-01-15",
      description: "Neurology Consultation - Dr. Michael Chen",
      amount: 200.00,
      status: "pending",
      paymentMethod: null,
      invoiceNumber: "INV-2024-002"
    },
    {
      id: 3,
      date: "2023-12-20",
      description: "Blood Test - Lab Services",
      amount: 75.00,
      status: "paid",
      paymentMethod: "Insurance",
      invoiceNumber: "INV-2023-045"
    }
  ]);

  const [outstandingBills, setOutstandingBills] = useState([
    {
      id: 2,
      date: "2024-01-15",
      description: "Neurology Consultation - Dr. Michael Chen",
      amount: 200.00,
      dueDate: "2024-02-15",
      invoiceNumber: "INV-2024-002"
    }
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalOutstanding = outstandingBills.reduce((sum, bill) => sum + bill.amount, 0);

  const handlePayment = (bill: any) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Here you would typically process the payment
    setShowPaymentModal(false);
    setSelectedBill(null);
    // Show success message
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Manage your bills and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">$225.00</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Methods</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Bills */}
      {outstandingBills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Outstanding Bills</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {outstandingBills.map((bill) => (
              <div key={bill.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{bill.description}</h3>
                    <p className="text-sm text-gray-600">Invoice: {bill.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                    <button
                      onClick={() => handlePayment(bill)}
                      className="mt-2 px-4 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <div key={payment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{payment.description}</h3>
                  <p className="text-sm text-gray-600">Invoice: {payment.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">Date: {payment.date}</p>
                  {payment.paymentMethod && (
                    <p className="text-sm text-gray-600">Method: {payment.paymentMethod}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Make Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedBill.description}</h3>
              <p className="text-sm text-gray-600 mb-4">Invoice: {selectedBill.invoiceNumber}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount Due:</span>
                  <span className="text-2xl font-bold text-gray-900">${selectedBill.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              
              {paymentMethod === "credit_card" || paymentMethod === "debit_card" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              ) : paymentMethod === "bank_transfer" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your account number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    placeholder="Enter insurance provider"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b6ffb] focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={processPayment}
                  className="flex-1 px-4 py-2 bg-[#7b6ffb] text-white rounded-lg hover:bg-[#6a5de8] transition-colors"
                >
                  Pay ${selectedBill.amount.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 