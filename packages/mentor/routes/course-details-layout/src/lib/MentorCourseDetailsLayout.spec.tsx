import { render } from '@testing-library/react';

import MentorLayoutsCourseDetailsLayout from './MentorCourseDetailsLayout';

describe('MentorLayoutsCourseDetailsLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorLayoutsCourseDetailsLayout />);
    expect(baseElement).toBeTruthy();
  });
});
