import { render } from '@testing-library/react';

import SharedComponentsSignupComponent from './SignupComponent';

describe('SharedComponentsSignupComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedComponentsSignupComponent />);
    expect(baseElement).toBeTruthy();
  });
});
