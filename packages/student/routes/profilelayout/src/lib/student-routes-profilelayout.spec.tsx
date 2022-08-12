import { render } from '@testing-library/react';

import StudentRoutesProfilelayout from './student-routes-profilelayout';

describe('StudentRoutesProfilelayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentRoutesProfilelayout />);
    expect(baseElement).toBeTruthy();
  });
});
