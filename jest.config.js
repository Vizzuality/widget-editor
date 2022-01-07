module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  setupFiles: [
    'dotenv/config',
  ],
  testMatch: [
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
    '**/__tests__/**/*test.+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  }
}
