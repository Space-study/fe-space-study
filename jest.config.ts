import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Use .ts file for setup
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|ts|jsx|tsx)$': 'ts-jest', // Ensure ts-jest handles TypeScript files
  },
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(customJestConfig)
