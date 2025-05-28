import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders with default message', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Custom error message';
    render(<ErrorMessage message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Error Title';
    render(<ErrorMessage title={customTitle} />);
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const customIcon = '🚨';
    render(<ErrorMessage icon={customIcon} />);
    expect(screen.getByText(customIcon)).toBeInTheDocument();
  });

  it('renders with all custom props', () => {
    const props = {
      title: 'Custom Title',
      message: 'Custom Message',
      icon: '⚠️'
    };
    render(<ErrorMessage {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.message)).toBeInTheDocument();
    expect(screen.getByText(props.icon)).toBeInTheDocument();
  });
}); 