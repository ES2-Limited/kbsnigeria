// Vitest setup — DOM matchers and test cleanup for React Testing Library.

import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
