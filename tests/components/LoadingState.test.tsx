import { render, screen } from '@testing-library/react-native';

import { LoadingState } from '@/components/LoadingState';

describe('LoadingState', () => {
  it('renders a default label', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading…')).toBeVisible();
  });

  it('renders a custom label', () => {
    render(<LoadingState label="Opening today's snack day…" />);

    expect(screen.getByText("Opening today's snack day…")).toBeVisible();
  });
});
