import { render } from '@testing-library/react';

import StudentComponentsRegisterComponent from './RegisterComponent';

describe('StudentComponentsRegisterComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StudentComponentsRegisterComponent />);
    expect(baseElement).toBeTruthy();
  });
});
