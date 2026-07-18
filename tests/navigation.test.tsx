import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';

describe('navigation shell', () => {
  it('redirects the initial route to sign-in', () => {
    renderRouter('app', { initialUrl: '/' });

    expect(screen.getByText('Sign In')).toBeVisible();
  });

  it('navigates from sign-in to the staff Today screen', () => {
    renderRouter('app', { initialUrl: '/sign-in' });

    fireEvent.press(screen.getByText('Continue as Staff (temporary)'));

    expect(screen.getByText('Today')).toBeVisible();
  });

  it('navigates from sign-in to the Administration screen', () => {
    renderRouter('app', { initialUrl: '/sign-in' });

    fireEvent.press(screen.getByText('Continue as Administrator (temporary)'));

    expect(screen.getByText('Administration')).toBeVisible();
  });

  it('navigates from Today back to sign-in', () => {
    renderRouter('app', { initialUrl: '/(staff)/today' });

    fireEvent.press(screen.getByText('Sign Out (temporary)'));

    expect(screen.getByText('Sign In')).toBeVisible();
  });
});
