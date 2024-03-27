module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  rootDir: '.',
  testMatch: ['**/*-spec.ts'],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'node',
  clearMocks: true,
}
