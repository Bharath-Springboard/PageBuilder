/* eslint-disable */
export default {
  displayName: 'shared-components-authlayout',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/packages/shared/components/authlayout',
};
