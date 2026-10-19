import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

test('renders the news home page and navigation', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '아무리 바빠도 뉴스는 봐야죠.' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '커뮤니티' })).toHaveAttribute('href', '/community');
});

test('opens the login route and lets a visitor return home', async () => {
  window.history.replaceState({}, '', '/user/login');
  render(<App />);
  expect(screen.getByPlaceholderText('아이디/이메일')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: '홈' }));
  expect(await screen.findByRole('heading', { name: '아무리 바빠도 뉴스는 봐야죠.' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});
