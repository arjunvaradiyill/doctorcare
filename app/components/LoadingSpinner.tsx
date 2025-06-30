import React from 'react';

const LoadingSpinner = ({ size = 'h-12 w-12', text }: { size?: string; text?: string; }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`relative ${size}`}>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5B7CFA]">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <div className={`absolute inset-0 border-4 border-gray-200 rounded-full`}></div>
        <div className={`absolute inset-0 border-4 border-[#5B7CFA] rounded-full animate-spin-slow border-t-transparent`}></div>
      </div>
      <p className="text-xl font-bold text-gray-800 animate-pulse">CareBot</p>
      {text && <p className="text-md text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 