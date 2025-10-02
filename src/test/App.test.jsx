import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
  });

  it('should render header component', () => {
    render(<App />);
    // Check if header is present (it should contain the title)
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render main content area', () => {
    render(<App />);
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('should render footer component', () => {
    render(<App />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should initialize with all providers', () => {
    // This test ensures the app renders without context errors
    expect(() => render(<App />)).not.toThrow();
  });
});
