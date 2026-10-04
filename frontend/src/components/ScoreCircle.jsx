import React from 'react';

const ScoreCircle = ({ score, label, color }) => {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score * circumference);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {percentage}
          </span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};

export default ScoreCircle;
