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
