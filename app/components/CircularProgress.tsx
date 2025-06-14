import React from 'react';

interface CircularProgressProps {
  size?: number;
  color?: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 24,
  color = 'text-blue-600',
  className = ''
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <svg
        className={`animate-spin ${color}`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default CircularProgress; 