import { render } from '@testing-library/react';

import SharedComponentsLoginComponent from './LoginComponent';

describe('SharedComponentsLoginComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedComponentsLoginComponent />);
    expect(baseElement).toBeTruthy();
  });
});
