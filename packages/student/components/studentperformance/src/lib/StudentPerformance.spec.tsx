import { render } from '@testing-library/react';

import StudentComponentsStudentperformance from './StudentPerformance';

describe('StudentComponentsStudentperformance', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsStudentperformance />);
    expect(baseElement).toBeTruthy();
  });
});
