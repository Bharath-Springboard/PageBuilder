import { render } from '@testing-library/react';

import StudentComponentsExplore from './student-components-explore';

describe('StudentComponentsExplore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsExplore />);
    expect(baseElement).toBeTruthy();
  });
});
