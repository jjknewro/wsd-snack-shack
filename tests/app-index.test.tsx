import { render } from '@testing-library/react-native';

import Index from '../app/index';

describe('app/index', () => {
  it('renders the WSD Snack Shack startup screen', async () => {
    const { getByText } = await render(<Index />);

    expect(getByText('WSD Snack Shack')).toBeVisible();
  });
});
