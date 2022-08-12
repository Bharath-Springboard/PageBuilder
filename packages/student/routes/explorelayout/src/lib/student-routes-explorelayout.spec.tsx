import { render } from '@testing-library/react';

import StudentRoutesExplorelayout from './student-routes-explorelayout';

describe('StudentRoutesExplorelayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentRoutesExplorelayout />);
    expect(baseElement).toBeTruthy();
  });
});
