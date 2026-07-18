import { render, screen } from '@testing-library/react-native';

import { ScreenHeader } from '@/components/ScreenHeader';

describe('ScreenHeader', () => {
  it('renders the title', () => {
    render(<ScreenHeader title="Today" />);

    expect(screen.getByText('Today')).toBeVisible();
  });

  it('renders a subtitle when provided', () => {
    render(<ScreenHeader title="Today" subtitle="July 18, 2026" />);

    expect(screen.getByText('July 18, 2026')).toBeVisible();
  });

  it('omits the subtitle when not provided', () => {
    render(<ScreenHeader title="Today" />);

    expect(screen.queryByText('July 18, 2026')).toBeNull();
  });
});
