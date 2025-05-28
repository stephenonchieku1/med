import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text" />)
    expect(screen.getByText('Custom loading text')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />)
    expect(screen.getByRole('status')).toHaveClass('h-4 w-4')

    rerender(<LoadingSpinner size="medium" />)
    expect(screen.getByRole('status')).toHaveClass('h-8 w-8')

    rerender(<LoadingSpinner size="large" />)
    expect(screen.getByRole('status')).toHaveClass('h-12 w-12')
  })

  it('renders without text', () => {
    render(<LoadingSpinner text="" />)
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
}) 