import { fireEvent, render, screen } from '@testing-library/react-native';

import { ErrorState } from '@/components/ErrorState';

describe('ErrorState', () => {
  it('renders the error message', () => {
    render(<ErrorState message="Pickup was not recorded. Check your connection and try again." />);

    expect(
      screen.getByText('Pickup was not recorded. Check your connection and try again.'),
    ).toBeVisible();
  });

  it('does not render a retry action when onRetry is not provided', () => {
    render(<ErrorState message="Something failed." />);

    expect(screen.queryByText('Try Again')).toBeNull();
  });

  it('renders and invokes the retry action when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Something failed." onRetry={onRetry} />);

    fireEvent.press(screen.getByText('Try Again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
