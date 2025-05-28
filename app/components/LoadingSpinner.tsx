import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  'data-testid'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...',
  'data-testid': testId = 'loading-spinner'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div 
      className="flex flex-col items-center justify-center"
      data-testid={testId}
    >
      <div 
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      ></div>
      {text && (
        <p 
          className="mt-2 text-sm text-gray-600"
          data-testid={`${testId}-text`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 