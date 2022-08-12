import { render } from '@testing-library/react';

import SharedComponentsAuthlayout from './AuthLayout';

describe('SharedComponentsAuthlayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedComponentsAuthlayout />);
    expect(baseElement).toBeTruthy();
  });
});
