module.exports = {
    testEnvironment: "node",
    verbose: true,
    setupFiles: [
        "<rootDir>/jest.setup.js",
    ],
    setupFilesAfterEnv: [
        "<rootDir>/tests/setup.js",
    ],
};