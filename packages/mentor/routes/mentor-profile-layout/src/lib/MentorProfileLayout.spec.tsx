import { render } from '@testing-library/react';

import MentorLayoutsMentorProfileLayout from './MentorProfileLayout';

describe('MentorLayoutsMentorProfileLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorLayoutsMentorProfileLayout />);
    expect(baseElement).toBeTruthy();
  });
});
