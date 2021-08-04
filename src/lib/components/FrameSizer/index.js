/**
 * Finds all preview iframes and observes their dimension changes.
 * If there’s changes, they are applied to all other iframes.
 * Changes are stored in localStorage and applied on load if present.
 */
(function () {
  const frameContext = location.pathname.replace(/\//g, '-');

  // Generates unique keys for each page
  const frameKeys = {
    width: `${frameContext}:frame-width`,
    height: `${frameContext}:frame-height`,
  };

  // Load and apply dimensions if present by updating root properties
  const frameWidth = localStorage.getItem(frameKeys.width);
  const frameHeight = localStorage.getItem(frameKeys.height);

  if (frameWidth) {
    document.documentElement.style.setProperty('--frame-width', frameWidth);
  }

  if (frameHeight) {
    document.documentElement.style.setProperty('--frame-height', frameHeight);
  }

  // Apply an event listener to observe changes to each iframe
  document.querySelectorAll('[data-preview-frame]').forEach((item) =>
    item.contentWindow.addEventListener('resize', () => {
      const rects = item.getClientRects()[0];
      const itemWidth = rects.width;
      const itemHeight = rects.height;

      document.documentElement.style.setProperty(
        '--frame-width',
        `${itemWidth}px`,
      );
      document.documentElement.style.setProperty(
        '--frame-height',
        `${itemHeight}px`,
      );
      localStorage.setItem(frameKeys.width, `${itemWidth}px`);
      localStorage.setItem(frameKeys.height, `${itemHeight}px`);
    }),
  );
})();
