// Helpers to make the DOM render-stable before a visual regression
// screenshot is captured.
//
// Finishes (or cancels, for infinite) any running animations so components
// are always captured in their settled state - the deterministic-render
// stylesheet zeroes out CSS animation durations, but Web Animations API
// animations started from JavaScript are unaffected by CSS overrides.
// Then waits for every font requested so far to finish loading, so text is
// never captured mid-swap in a fallback font.
export const settleRender = (doc: Document): Promise<FontFaceSet> => {
  doc.getAnimations().forEach((animation) => {
    const endTime = animation.effect?.getComputedTiming().endTime;
    if (endTime === Infinity) {
      animation.cancel();
    } else {
      animation.finish();
    }
  });
  return doc.fonts.ready;
};
