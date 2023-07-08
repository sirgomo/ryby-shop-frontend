module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: [ '<rootDir>/setup-jest.ts' ],
};
