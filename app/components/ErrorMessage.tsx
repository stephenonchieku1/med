import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  icon?: string;
  'data-testid'?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message = 'An error occurred',
  icon = '❌',
  'data-testid': testId = 'error-message'
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg"
      role="alert"
      data-testid={testId}
    >
      <div className="text-2xl mb-2" data-testid={`${testId}-icon`}>
        {icon}
      </div>
      <h3 
        className="text-lg font-semibold text-red-700 mb-1"
        data-testid={`${testId}-title`}
      >
        {title}
      </h3>
      <p 
        className="text-sm text-red-600 text-center"
        data-testid={`${testId}-message`}
      >
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage; 