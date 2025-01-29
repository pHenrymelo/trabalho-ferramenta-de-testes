import type { Config } from "jest"

const config: Config = {
    testEnvironment: 'node',
    preset: "ts-jest",
    testMatch: ["**/__tests__/**/*.[jt]s", "**/?(*.)+(spec|test).[jt]s"],
    verbose: true,
}

export default config


