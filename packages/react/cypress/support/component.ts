import "./deterministic-render";
import "./commands";
import "cypress-axe";

// ICDS style assets
import "../../dist/core/normalize.css";
import "../../../fonts/src/fonts";
import "../../dist/core/core.css";

// Media emulation set via CDP (forced-colors / prefers-color-scheme)
// persists in the browser session across spec files. Reset it before each
// spec so a high contrast run in one spec can never leak into the
// screenshots of whichever spec happens to run next.
before(() => {
  cy.disableForcedColors();
});

// "ResizeObserver loop completed with undelivered notifications" is a benign
// browser warning (the skipped observations are re-delivered on the next
// frame) but Chrome reports it as an error event, which Cypress treats as an
// application crash. Never fail a test on it.
Cypress.on("uncaught:exception", (err) => {
  if (/ResizeObserver loop/.test(err.message)) {
    return false;
  }
  return undefined;
});
