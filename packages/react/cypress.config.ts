import { defineConfig } from "cypress";
import webpackConfig from "./.webpack/webpack.config";
import getCompareSnapshotsPlugin from "cypress-image-diff-js/plugin";

// Make Chromium rendering deterministic so visual regression snapshots are
// reproducible between runs. Largely drawn from Chromium's own
// --deterministic-mode set, see:
// https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
const DETERMINISTIC_RENDERING_FLAGS = [
  "--window-size=1920,1080",
  "--force-device-scale-factor=1",
  "--force-color-profile=srgb",
  "--disable-lcd-text",
  "--font-render-hinting=none",
  "--hide-scrollbars",
  "--mute-audio",
  // Do not use runtime-detected CPU optimisations in Skia, so rasterisation
  // is identical across heterogeneous CI runner hardware
  "--disable-skia-runtime-opts",
  "--disable-partial-raster",
  "--disable-checker-imaging",
  "--disable-image-animation-resync",
  "--disable-new-content-rendering-timeout",
  "--disable-threaded-animation",
  "--disable-threaded-scrolling",
  // Ensure all rasterisation stages complete before a frame (and therefore
  // a screenshot) can be produced
  "--run-all-compositor-stages-before-draw",
];

// Chromium only honours the last --disable-features switch, so these must be
// merged into any existing one rather than pushed as a new argument
const DISABLED_FEATURES = ["PaintHolding"];

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
          launchOptions.args.push(...DETERMINISTIC_RENDERING_FLAGS);
          const disableFeatures = launchOptions.args.findIndex((arg) =>
            arg.startsWith("--disable-features=")
          );
          if (disableFeatures === -1) {
            launchOptions.args.push(
              `--disable-features=${DISABLED_FEATURES.join(",")}`
            );
          } else {
            launchOptions.args[disableFeatures] += `,${DISABLED_FEATURES.join(
              ","
            )}`;
          }
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
