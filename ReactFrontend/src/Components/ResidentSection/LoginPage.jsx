import React from 'react';
import { Building2 } from 'lucide-react';

const LoginPage = ({ handleLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">HomeHive</h1>
        <p className="text-gray-600">Society Management System</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Demo Login</h2>
        <button
          onClick={() => handleLogin('resident')}
          className="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors"
        >
          <div className="font-semibold text-green-700">Login as Resident</div>
          <div className="text-sm text-green-600">View payments, raise complaints, book facilities</div>
        </button>
        <button
          onClick={() => handleLogin('accountant')}
          className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors"
        >
          <div className="font-semibold text-blue-700">Login as Accountant</div>
          <div className="text-sm text-blue-600">Manage bills, track payments, generate reports</div>
        </button>
        <button
          onClick={() => handleLogin('admin')}
          className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors"
        >
          <div className="font-semibold text-purple-700">Login as Admin</div>
          <div className="text-sm text-purple-600">Manage users, facilities, and system settings</div>
        </button>
      </div>
    </div>
  </div>
);

export default LoginPage;