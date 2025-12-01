const sharedConfig = require("@repo/config/tailwind.config.js");

module.exports = {
    ...sharedConfig,
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
