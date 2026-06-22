module.exports = {
    testEnvironment: "node",

    verbose: true,

    setupFiles: [
        "<rootDir>/jest.setup.js",
    ],

    globalSetup:
        "<rootDir>/tests/globalSetup.js",

    globalTeardown:
        "<rootDir>/tests/globalTeardown.js",

    testTimeout: 30000,
};