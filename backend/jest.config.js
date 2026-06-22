// jest.config.js
module.exports = {
    testEnvironment: "node",
    verbose: true,

    setupFiles: [
        "<rootDir>/jest.setup.js",
    ],

    setupFilesAfterEnv: [
        "<rootDir>/tests/setup.js",
    ],

    testTimeout: 30000,
};