import { render } from '@testing-library/react';
import App from './App';

it('Renders App with correct class', () => {
  const { container } = render(<App />)
  expect(container.classList.contains('App'))
})