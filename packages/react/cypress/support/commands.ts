/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { CYPRESS_AXE_OPTIONS, CYPRESS_AXE_REPORTING } from "../utils/a11y";

import {
  BE_VISIBLE,
  HAVE_CLASS,
} from "../../src/component-tests/utils/constants";

import "cypress-file-upload";

import compareSnapshotCommand from "cypress-image-diff-js";
import { settleRender } from "./settle-render";

compareSnapshotCommand();

// Wait for rendering to settle (animations finished, fonts loaded) before
// every visual regression screenshot, so snapshots are deterministic
Cypress.Commands.overwrite(
  "compareSnapshot",
  (originalFn, ...args: unknown[]) => {
    cy.document({ log: false }).then({ timeout: 10000 }, settleRender);
    return (
      originalFn as unknown as (...fnArgs: unknown[]) => Cypress.Chainable
    )(...args);
  }
);

// Create the typing for the getCall command
declare global {
  interface JQuery {
    getCall(arg: number): any;
  }
}

// Create the typing for the custom commands (compareSnapshot is typed by
// cypress-image-diff-js itself)
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Check that the provided element has the hydrated class applied
       * @param {string} element identifier of the element to check
       */
      checkHydrated: typeof Commands.checkHydrated;
      /**
       * Click the selector inside an element's shadow root
       * @param {string} element identifier of the parent element
       * @param {string} selector identifier of the selector to be clicked
       */
      clickOnShadowEl: typeof Commands.clickOnShadowEl;
      /**
       * Check the selector inside the shadow root of an element is visible
       * @param {string} element identifier of the parent element
       * @param {string} selector identifier of the selector to be clicked
       */
      checkShadowElVisible: typeof Commands.checkShadowElVisible;
      /**
       * Disable forced colours
       */
      disableForcedColors: typeof Commands.disableForcedColors;
      /**
       * Enable forced colours
       */
      enableForcedColors: typeof Commands.enableForcedColors;
      /**
       * Check the selector inside the shadow root of an element is visible
       * @param {string} element identifier of the parent element
       * @param {string} selector identifier of the selector to be clicked
       * @returns the selector
       */
      findShadowEl: typeof Commands.findShadowEl;
      /**
       * Force-click the provided element
       * @param {string} element identifier of the element to check
       */
      clickOnButton: typeof Commands.clickOnButton;
      /**
       * Run a11y test after buffer wait time
       * @param {string} element identifier of the element to check, optional with undefined as default
       * @param {number} wait time to wait before a11y check, optional with 200 as default
       * @param {any} optionObject object to replace the default axe ruleset, optional with CYPRESS_AXE_OPTIONS as default
       */
      checkA11yWithWait: typeof Commands.checkA11yWithWait;
      /**
       * Mock ResizeObserver
       * @param {number} width width of the viewport
       * @param {number} height height of the viewport
       */
      mockResizeObserver: typeof Commands.mockResizeObserver;
    }
  }
}

const checkHydrated = (element: string): void => {
  cy.get(`${element}`).should(HAVE_CLASS, "hydrated");
};

const clickOnShadowEl = (element: string, selector: string): void => {
  cy.get(element).shadow().find(selector).click();
};

const checkShadowElVisible = (
  element: string,
  selector: string
): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`${element}`).shadow().find(`${selector}`).should(BE_VISIBLE);

const cdpCommand = "Emulation.setEmulatedMedia";
const media = "forced-colors";

const enableForcedColors = () => {
  const darkMode = "dark";
  return cy
    .then(() => {
      return Cypress.automation("remote:debugger:protocol", {
        command: cdpCommand,
        params: {
          media,
          features: [
            { name: media, value: "active" },
            { name: "prefers-color-scheme", value: darkMode },
          ],
        },
      });
    })
    .then(() => {
      Cypress.log({
        name: "Enable forced colors",
        message: `${darkMode} theme`,
      });
    })
    .window();
};

const disableForcedColors = () => {
  return cy
    .then(() => {
      return Cypress.automation("remote:debugger:protocol", {
        command: cdpCommand,
        params: {
          media,
          features: [{ name: media, value: "none" }],
        },
      });
    })
    .then(() => {
      Cypress.log({
        name: "Disable forced colors",
      });
    })
    .window();
};

const findShadowEl = (
  element: string,
  selector: string
): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`${element}`).shadow().find(`${selector}`);

const clickOnButton = (element: string): void => {
  cy.get(`${element}`).click({ force: true });
};

const checkA11yWithWait = (
  element: string | undefined = undefined,
  wait = 200,
  optionObject = CYPRESS_AXE_OPTIONS
): void => {
  cy.wait(wait);
  cy.checkA11y(element, optionObject, CYPRESS_AXE_REPORTING);
};

const mockResizeObserver = (width: number, height: number) => {
  cy.window().then((win) => {
    cy.stub(win, "ResizeObserver").callsFake((callback) => {
      const observer = {
        observe: (): void => {
          callback([{ contentRect: { width, height } }], observer);
        },
        unobserve: (): void => undefined,
        disconnect: (): void => undefined,
      };
      return observer;
    });
  });
};

const Commands = {
  checkHydrated,
  clickOnShadowEl,
  checkShadowElVisible,
  disableForcedColors,
  enableForcedColors,
  findShadowEl,
  clickOnButton,
  checkA11yWithWait,
  mockResizeObserver,
};

export default Commands;
