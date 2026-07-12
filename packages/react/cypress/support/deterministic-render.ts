// Visual regression snapshots are compared with a zero threshold on CI, so
// rendering must be pixel-identical between runs. Remove the main sources of
// non-deterministic rendering:
// - animations/transitions captured mid-flight (0s durations mean components
//   settle into their final states instantly, while animationend and
//   transitionend events still fire)
// - infinite animations, e.g. loading spinners, captured at a random phase
//   (a single 0s iteration completes instantly and deterministically)
// - the text input caret, which blinks in and out of screenshots
// - smooth scrolling captured mid-scroll
const DETERMINISTIC_RENDER_CSS = `
*, *::before, *::after {
  animation-delay: 0s !important;
  animation-duration: 0s !important;
  animation-iteration-count: 1 !important;
  transition-delay: 0s !important;
  transition-duration: 0s !important;
  caret-color: transparent !important;
  scroll-behavior: auto !important;
}`;

const deterministicStyles = new CSSStyleSheet();
deterministicStyles.replaceSync(DETERMINISTIC_RENDER_CSS);

document.adoptedStyleSheets = [
  ...document.adoptedStyleSheets,
  deterministicStyles,
];

// Document-level styles cannot cross shadow boundaries, so the above would
// not affect the components, which render in shadow DOM. Patch attachShadow
// so every shadow root adopts the stylesheet too. (Stencil spreads any
// existing adopted stylesheets when adding its own, so the sheet survives
// component style injection, and the !important rules win the cascade.)
const originalAttachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (
  this: Element,
  init: ShadowRootInit
): ShadowRoot {
  const shadowRoot = originalAttachShadow.call(this, init);
  shadowRoot.adoptedStyleSheets = [
    ...shadowRoot.adoptedStyleSheets,
    deterministicStyles,
  ];
  return shadowRoot;
};
