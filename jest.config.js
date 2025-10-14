export default {
  preset: null,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
  ],
};