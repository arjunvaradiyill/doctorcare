import React from 'react';

const donutData = [
  { label: 'Excellent', value: 65, color: '#3b82f6' },
  { label: 'Good', value: 25, color: '#10b981' },
  { label: 'Poor', value: 10, color: '#f59e0b' },
];

const total = 45251;
const satisfaction = 85;
const averageRating = 4.8;
const reviews = 2847;
const recommend = 98;

function getCircumference(radius: number) {
    return 2 * Math.PI * radius;
}

function getOffset(index: number, totalValue: number) {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += donutData[i].value;
  }
  return (offset / totalValue) * 100;
}

export default function PatientSatisfaction() {
  const radius = 40;
  const circumference = getCircumference(radius);
  const totalValue = donutData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <h4 className="text-base font-bold text-gray-900 mb-3">Patient Satisfaction</h4>
      <div className="flex items-center gap-4">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg width="128" height="128" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle 
              r={radius}
              cx="50" 
              cy="50" 
              fill="transparent" 
              stroke="#e5e7eb" 
              strokeWidth="12" 
            />
            {donutData.map((d, i) => {
              const percentage = (d.value / totalValue) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const initialOffset = getOffset(i, totalValue);
              const rotation = (initialOffset / 100) * 360 - 90;
              
              return (
                <circle
                  key={d.label}
                  r={radius}
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={0}
                  transform={`rotate(${rotation} 50 50)`}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-base font-bold text-gray-800 leading-none">{total.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500">Total</div>
            <div className="mt-0.5 text-sm font-bold text-gray-800">{satisfaction}%</div>
            <div className="text-[10px] text-gray-500">Satisfaction</div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-2">
          {donutData.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
              <span className="text-sm font-semibold text-gray-700">{d.label}</span>
              <span className="text-xs text-gray-500">({d.value}%)</span>
            </div>
          ))}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <span className="text-xl font-bold text-blue-600">{averageRating}</span>
          <p className="text-xs text-gray-500 font-medium">Average Rating</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <span className="text-xl font-bold text-green-600">{reviews.toLocaleString()}</span>
          <p className="text-xs text-gray-500 font-medium">Reviews</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <span className="text-xl font-bold text-orange-500">{recommend}%</span>
          <p className="text-xs text-gray-500 font-medium">Would Recommend</p>
        </div>
      </div>
    </div>
  );
} 