import { render } from '@testing-library/react';

import StudentRoutesRegisterlayout from './student-routes-registerlayout';

describe('StudentRoutesRegisterlayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentRoutesRegisterlayout />);
    expect(baseElement).toBeTruthy();
  });
});
