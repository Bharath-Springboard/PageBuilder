import { render } from '@testing-library/react';

import StudentComponentsStudentprogress from './StudentProgress';

describe('StudentComponentsStudentprogress', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsStudentprogress />);
    expect(baseElement).toBeTruthy();
  });
});
