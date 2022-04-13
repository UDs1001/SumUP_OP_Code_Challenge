import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CreditCardFormContainer', () => {
  render(<App />);
  const linkElement = screen.getByText(/Card number/i);
  expect(linkElement).toBeInTheDocument();
});
