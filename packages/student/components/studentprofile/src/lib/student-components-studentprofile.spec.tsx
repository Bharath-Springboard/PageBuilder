import { render } from '@testing-library/react';

import StudentComponentsStudentprofile from './student-components-studentprofile';

describe('StudentComponentsStudentprofile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsStudentprofile />);
    expect(baseElement).toBeTruthy();
  });
});
