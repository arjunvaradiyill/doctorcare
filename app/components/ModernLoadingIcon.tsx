import React from 'react';

interface ModernLoadingIconProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showDots?: boolean;
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

const ModernLoadingIcon: React.FC<ModernLoadingIconProps> = ({ 
  size = 'md', 
  text = '', 
  showDots = true,
  color = 'blue',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-16 h-16'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  const colorClasses = {
    blue: {
      border: 'border-blue-600',
      bg: 'bg-blue-600',
      text: 'text-blue-600'
    },
    white: {
      border: 'border-white',
      bg: 'bg-white',
      text: 'text-white'
    },
    gray: {
      border: 'border-gray-600',
      bg: 'bg-gray-600',
      text: 'text-gray-600'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Outer ring */}
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
          {/* Animated ring */}
          <div className={`absolute inset-0 border-2 border-transparent ${currentColor.border} rounded-full animate-spin`}></div>
          {/* Inner pulse */}
          <div className={`absolute inset-1 ${currentColor.bg} rounded-full animate-pulse opacity-20`}></div>
          {/* Center dot */}
          <div className={`absolute inset-2 ${currentColor.bg} rounded-full animate-ping opacity-75`}></div>
        </div>
      </div>
      {text && (
        <div className="mt-3 text-center">
          <p className={`text-gray-600 font-medium text-sm ${color === 'white' ? 'text-white' : ''}`}>{text}</p>
          {showDots && (
            <div className="flex justify-center mt-2 space-x-1">
              <div className={`${dotSizes[size]} ${currentColor.bg} rounded-full animate-bounce`}></div>
              <div className={`${dotSizes[size]} ${currentColor.bg} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`${dotSizes[size]} ${currentColor.bg} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernLoadingIcon; 