import { render } from '@testing-library/react';

import MentorComponentsCourseDetailsComponent from './MentorCourseDetails';

describe('MentorComponentsCourseDetailsComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorComponentsCourseDetailsComponent />);
    expect(baseElement).toBeTruthy();
  });
});
