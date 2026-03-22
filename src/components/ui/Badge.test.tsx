import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should render children', () => {
    render(<Badge>Test Content</Badge>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Badge className="custom-class">Content</Badge>)
    const badge = container.firstChild
    expect(badge).toHaveClass('custom-class')
  })

  it('should have default styles', () => {
    const { container } = render(<Badge>Content</Badge>)
    const badge = container.firstChild
    expect(badge).toHaveClass('inline-flex')
    expect(badge).toHaveClass('items-center')
    expect(badge).toHaveClass('rounded-md')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('font-medium')
    expect(badge).toHaveClass('px-2')
    expect(badge).toHaveClass('py-0.5')
  })
})