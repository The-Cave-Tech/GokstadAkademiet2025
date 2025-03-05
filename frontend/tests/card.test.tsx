import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

const TestContent = () => <span data-testid="test-content">Test content</span>;

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default styling', () => {
      render(<Card><TestContent /></Card>);
      const card = screen.getByTestId('test-content').parentElement;
      expect(card).toHaveClass('bg-white rounded-lg shadow-lg p-6');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'border-red-500 text-center';
      render(<Card className={customClass}><TestContent /></Card>);
      const card = screen.getByTestId('test-content').parentElement;
      expect(card).toHaveClass('bg-white rounded-lg shadow-lg p-6 border-red-500 text-center');
    });

    it('renders children correctly', () => {
      render(<Card><TestContent /></Card>);
      expect(screen.getByTestId('test-content')).toHaveTextContent('Test content');
    });

    it('handles CardProps type correctly', () => {
      const cardProps: CardProps = {
        children: <TestContent />,
        className: 'custom-card',
      };
      render(<Card {...cardProps} />);
      const card = screen.getByTestId('test-content').parentElement;
      expect(card).toHaveClass('bg-white rounded-lg shadow-lg p-6 custom-card');
    });
  });

  describe('CardHeader', () => {
    it('renders with default styling', () => {
      render(<CardHeader><TestContent /></CardHeader>);
      const header = screen.getByTestId('test-content').parentElement;
      expect(header).toHaveClass('mb-4');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'text-blue-500 font-bold';
      render(<CardHeader className={customClass}><TestContent /></CardHeader>);
      const header = screen.getByTestId('test-content').parentElement;
      expect(header).toHaveClass('mb-4 text-blue-500 font-bold');
    });

    it('renders children correctly', () => {
      render(<CardHeader><TestContent /></CardHeader>);
      expect(screen.getByTestId('test-content')).toHaveTextContent('Test content');
    });

    it('handles CardHeaderProps type correctly', () => {
      const headerProps: CardHeaderProps = {
        children: <TestContent />,
        className: 'header-style',
      };
      render(<CardHeader {...headerProps} />);
      const header = screen.getByTestId('test-content').parentElement;
      expect(header).toHaveClass('mb-4 header-style');
    });
  });

  describe('CardBody', () => {
    it('renders with default styling', () => {
      render(<CardBody><TestContent /></CardBody>);
      const body = screen.getByTestId('test-content').parentElement;
      expect(body).toHaveClass('mb-4');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'bg-gray-100 p-2';
      render(<CardBody className={customClass}><TestContent /></CardBody>);
      const body = screen.getByTestId('test-content').parentElement;
      expect(body).toHaveClass('mb-4 bg-gray-100 p-2');
    });

    it('renders children correctly', () => {
      render(<CardBody><TestContent /></CardBody>);
      expect(screen.getByTestId('test-content')).toHaveTextContent('Test content');
    });

    it('handles CardBodyProps type correctly', () => {
      const bodyProps: CardBodyProps = {
        children: <TestContent />,
        className: 'body-style',
      };
      render(<CardBody {...bodyProps} />);
      const body = screen.getByTestId('test-content').parentElement;
      expect(body).toHaveClass('mb-4 body-style');
    });
  });

  describe('CardFooter', () => {
    it('renders with default styling', () => {
      render(<CardFooter><TestContent /></CardFooter>);
      const footer = screen.getByTestId('test-content').parentElement;
      expect(footer).toHaveClass('mt-4');
    });

    it('accepts and applies custom className', () => {
      const customClass = 'border-t-2 pt-2';
      render(<CardFooter className={customClass}><TestContent /></CardFooter>);
      const footer = screen.getByTestId('test-content').parentElement;
      expect(footer).toHaveClass('mt-4 border-t-2 pt-2');
    });

    it('renders children correctly', () => {
      render(<CardFooter><TestContent /></CardFooter>);
      expect(screen.getByTestId('test-content')).toHaveTextContent('Test content');
    });

    it('handles CardFooterProps type correctly', () => {
      const footerProps: CardFooterProps = {
        children: <TestContent />,
        className: 'footer-style',
      };
      render(<CardFooter {...footerProps} />);
      const footer = screen.getByTestId('test-content').parentElement;
      expect(footer).toHaveClass('mt-4 footer-style');
    });
  });

  it('can be styled as a composite component for specific purposes', () => {
    render(
      <Card data-testid="card" className="project-card border-blue-500">
        <CardHeader data-testid="header" className="event-header bg-blue-100">Event Header</CardHeader>
        <CardBody data-testid="body" className="form-body text-gray-700">Form Body</CardBody>
        <CardFooter data-testid="footer" className="project-footer italic">Project Footer</CardFooter>
      </Card>
    );
    const card = screen.getByTestId('card');
    const header = screen.getByTestId('header');
    const body = screen.getByTestId('body');
    const footer = screen.getByTestId('footer');

    expect(card).toHaveClass('bg-white rounded-lg shadow-lg p-6 project-card border-blue-500');
    expect(header).toHaveClass('mb-4 event-header bg-blue-100');
    expect(body).toHaveClass('mb-4 form-body text-gray-700');
    expect(footer).toHaveClass('mt-4 project-footer italic');
  });
});
