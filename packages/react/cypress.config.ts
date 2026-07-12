import { defineConfig } from "cypress";
import webpackConfig from "./.webpack/webpack.config";
import getCompareSnapshotsPlugin from "cypress-image-diff-js/plugin";

export const config: Cypress.ConfigOptions = {
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    fixturesFolder: "./src/component-tests",
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--window-size=1920,1080");
          launchOptions.args.push("--force-device-scale-factor=1");
          // Make rendering deterministic so visual regression snapshots are
          // reproducible between runs
          launchOptions.args.push("--force-color-profile=srgb");
          launchOptions.args.push("--disable-lcd-text");
          launchOptions.args.push("--font-render-hinting=none");
          launchOptions.args.push("--disable-checker-imaging");
        }
        return launchOptions;
      });
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
