import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignInRoute from '@/app/(public)/(auth)/signin/page';
import SignUpRoute from '@/app/(public)/(auth)/signup/page';

vi.mock('@/components/authform/SignInForm', () => ({
  SignInForm: () => <div data-testid="mock-signin-form">Sign In Form</div>,
}));

vi.mock('@/components/authform/SignUpForm', () => ({
  SignUpForm: () => <div data-testid="mock-signup-form">Sign Up Form</div>,
}));

vi.mock('@/components/ui/AuthBackgroundImage', () => ({
  AuthBackgroundImage: ({ className }: { className: string }) => (
    <div data-testid="mock-background" className={className}>
      Background
    </div>
  ),
}));

describe('Auth Pages', () => {
  describe('SignInRoute', () => {
    it('renders the SignInForm component', () => {
      render(<SignInRoute />);
      const signInForm = screen.getByTestId('mock-signin-form');
      expect(signInForm).toBeInTheDocument();
      expect(signInForm).toHaveTextContent('Sign In Form');
    });

    it('renders both AuthBackgroundImage components with correct class names', () => {
      render(<SignInRoute />);
      const backgrounds = screen.getAllByTestId('mock-background');
      expect(backgrounds).toHaveLength(2);
      expect(backgrounds[0]).toHaveClass('absolute inset-0 w-full h-full custom-lg:hidden');
      expect(backgrounds[1]).toHaveClass('hidden custom-lg:block custom-lg:w-1/2 relative h-[500px] custom-lg:h-full');
    });

    it('has the correct layout structure for the section element', () => {
      render(<SignInRoute />);
      const section = screen.getByRole('region', { name: 'Sign in section' });
      expect(section).toHaveClass('relative flex flex-col custom-lg:flex-row items-center justify-center w-full h-full');
    });

    it('renders the SignInForm wrapper with correct class names', () => {
      render(<SignInRoute />);
      const formWrapper = screen.getByTestId('mock-signin-form').parentElement;
      expect(formWrapper).toHaveClass('relative z-10 w-full custom-lg:w-1/2 flex items-center justify-center p-4 custom-lg:p-0');
    });
  });

  describe('SignUpRoute', () => {
    it('renders the SignUpForm component', () => {
      render(<SignUpRoute />);
      const signUpForm = screen.getByTestId('mock-signup-form');
      expect(signUpForm).toBeInTheDocument();
      expect(signUpForm).toHaveTextContent('Sign Up Form');
    });

    it('renders both AuthBackgroundImage components with correct class names', () => {
      render(<SignUpRoute />);
      const backgrounds = screen.getAllByTestId('mock-background');
      expect(backgrounds).toHaveLength(2);
      expect(backgrounds[0]).toHaveClass('absolute inset-0 w-full h-full custom-lg:hidden');
      expect(backgrounds[1]).toHaveClass('hidden custom-lg:block custom-lg:w-1/2 relative h-[500px] custom-lg:h-full');
    });

    it('has the correct layout structure for the section element', () => {
      render(<SignUpRoute />);
      const section = screen.getByRole('region', { name: 'Sign up section' });
      expect(section).toHaveClass('relative flex flex-col custom-lg:flex-row items-center justify-center w-full h-full');
    });

    it('renders the SignUpForm wrapper with correct class names', () => {
      render(<SignUpRoute />);
      const formWrapper = screen.getByTestId('mock-signup-form').parentElement;
      expect(formWrapper).toHaveClass('relative z-10 w-full custom-lg:w-1/2 flex items-center justify-center p-4 custom-lg:p-0');
    });
  });
});