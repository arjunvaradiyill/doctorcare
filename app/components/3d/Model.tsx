"use client";

import React from 'react';

const Model: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-dashed border-blue-200">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="text-blue-500"
          >
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">3D Body Model</h3>
        <p className="text-sm text-gray-500">Interactive 3D visualization</p>
        <p className="text-xs text-gray-400 mt-1">Coming soon...</p>
      </div>
    </div>
  );
};

export default Model; 