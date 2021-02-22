module.exports = {
  roots: ["<rootDir>/src"],
  setupFiles: ["dotenv/config"],
  testMatch: [
    "**/__tests__/**/*test.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
