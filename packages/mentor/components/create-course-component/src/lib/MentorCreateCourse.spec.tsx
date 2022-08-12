import { render } from '@testing-library/react';

import MentorComponentsCreateCourseComponent from './MentorCreateCourse';

describe('MentorComponentsCreateCourseComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MentorComponentsCreateCourseComponent />);
    expect(baseElement).toBeTruthy();
  });
});
