import { render } from '@testing-library/react';

import MentorDashboardLayout from './MentorDashboardLayout';

describe('MentorLayoutsMentorDashboardLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorDashboardLayout />);
    expect(baseElement).toBeTruthy();
  });
});
