/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from "cypress";
import webpackConfig from "./.webpack/webpack.config";

export const config: Cypress.ConfigOptions = {
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    fixturesFolder: "./src/component-tests",
    setupNodeEvents(on, config) {
      const getCompareSnapshotsPlugin = require("cypress-image-diff-js/plugin");
      getCompareSnapshotsPlugin(on, config);
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--window-size=1920,1080");
          launchOptions.args.push("--force-device-scale-factor=1");
        } else if (browser.name === "electron") {
          launchOptions.preferences.width = 1920;
          launchOptions.preferences.height = 1080;
        }
        return launchOptions;
      });
      config.browsers = config.browsers.filter((b) => b.name === "chrome");
      return config;
    },
    supportFile: "./cypress/support/index.ts",
    retries: {
      runMode: 3,
      openMode: 0,
    },
  },
};

export default defineConfig(config);
