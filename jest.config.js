module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  coverageReporters: ['lcov', 'text', 'clover', 'html'],
  setupFilesAfterEnv: ['<rootDir>/setupEnzyme.ts'],
};
