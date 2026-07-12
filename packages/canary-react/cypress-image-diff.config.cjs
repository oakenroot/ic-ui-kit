/* canary-react shares the react package's cypress-image-diff configuration
 * (the plugin resolves this file relative to the Cypress working directory,
 * which is this package when canary tests run). */
module.exports = require("../react/cypress-image-diff.config.cjs");
