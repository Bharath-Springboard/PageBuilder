import { render } from '@testing-library/react';

import StudentComponentsSubscribedcourses from './SubscribedCourses';

describe('StudentComponentsSubscribedcourses', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsSubscribedcourses />);
    expect(baseElement).toBeTruthy();
  });
});
