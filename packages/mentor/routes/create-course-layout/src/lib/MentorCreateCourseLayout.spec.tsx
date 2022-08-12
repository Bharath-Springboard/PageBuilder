import { render } from '@testing-library/react';

import MentorLayoutsCreateCourseLayout from './MentorCreateCourseLayout';

describe('MentorLayoutsCreateCourseLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorLayoutsCreateCourseLayout />);
    expect(baseElement).toBeTruthy();
  });
});
