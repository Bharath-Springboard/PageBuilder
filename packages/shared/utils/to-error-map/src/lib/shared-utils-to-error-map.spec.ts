import { sharedUtilsToErrorMap } from './shared-utils-to-error-map';

describe('sharedUtilsToErrorMap', () => {
  it('should work', () => {
    expect(sharedUtilsToErrorMap()).toEqual('shared-utils-to-error-map');
  });
});
