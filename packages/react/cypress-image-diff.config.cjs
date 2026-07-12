/* Configuration for cypress-image-diff-js, resolved from the package
 * directory the Cypress run is launched from. Shared with canary-react. */

// CYPRESS_CI is set by the cypress:ci npm scripts (all CI cypress runs).
// UPDATE_BASELINES is set only by the baseline (re)generation workflows.
const isCI = process.env.CYPRESS_CI === "true";
const updatingBaselines = process.env.UPDATE_BASELINES === "true";

module.exports = {
  // On CI test runs a missing baseline is a hard failure - without this a
  // deleted or never-committed baseline is silently re-seeded from the
  // comparison screenshot and the test always passes. Baseline generation
  // workflows and local runs still auto-seed.
  FAIL_ON_MISSING_BASELINE: isCI && !updatingBaselines,
  // If the first comparison does not match, take a fresh screenshot and
  // compare again after a short delay. This self-heals captures taken
  // before the page fully settled without slowing down passing tests.
  RETRY_OPTIONS: {
    limit: 2,
    delay: 500,
  },
};
