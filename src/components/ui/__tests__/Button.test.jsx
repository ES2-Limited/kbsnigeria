// Smoke tests for Button rendering modes.

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Button from '../Button'

describe('Button', () => {
  it('renders a react-router Link when as="link"', () => {
    render(
      <MemoryRouter>
        <Button as="link" to="/about">
          About KBS
        </Button>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'About KBS' })
    expect(link).toHaveAttribute('href', '/about')
  })

  it('marks a disabled link as inert for assistive tech and clicks', () => {
    render(
      <MemoryRouter>
        <Button as="link" disabled to="/admissions">
          Enquire Now
        </Button>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Enquire Now' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
  })

  it('renders a native button with type button by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('swaps label text and sets aria-busy while loading', () => {
    render(
      <Button loading loadingText="Sending…">
        Send
      </Button>,
    )

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Sending…')).toBeInTheDocument()
  })
})
