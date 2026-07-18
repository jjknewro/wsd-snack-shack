import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppButton } from '@/components/AppButton';

describe('AppButton', () => {
  it('renders its label and calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<AppButton label="Mark Picked Up" onPress={onPress} />);

    fireEvent.press(screen.getByText('Mark Picked Up'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<AppButton label="Mark Picked Up" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Mark Picked Up'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState.disabled).toBe(true);
  });

  it('shows a busy state and does not call onPress while loading', () => {
    const onPress = jest.fn();
    render(<AppButton label="Mark Picked Up" onPress={onPress} loading />);

    expect(screen.queryByText('Mark Picked Up')).toBeNull();
    expect(screen.getByRole('button').props.accessibilityState.busy).toBe(true);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('defaults its accessibility label to the visible label', () => {
    render(<AppButton label="Sign In" onPress={() => {}} />);

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
  });
});
