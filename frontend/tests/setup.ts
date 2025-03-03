// src/tests/setup.ts

// Importer Jest DOM utvidelser for ekstra matchers/assertions
import '@testing-library/jest-dom';

// Importer Vitest hjelpefunksjoner
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock miljøvariabler som brukes i Next.js 15
process.env.NEXT_PUBLIC_STRAPI_API_URL = 'http://localhost:1337';

// Mock window.matchMedia for responsive testing (Next.js 15 bruker fortsatt dette for klient-side media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Rydde opp etter hver test
afterEach(() => {
  cleanup();
  vi.restoreAllMocks(); // Sørger for at mocks resettes mellom tester
});

