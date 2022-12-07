// DOM references
const button = document.querySelector('button');
const icon = button.querySelector('.icon');
const canonical = document.querySelector('link[rel="canonical"]');

// Find out if the user is on a device made by Apple.
const IS_MAC = /Mac|iPhone/.test(navigator.platform);
// Find out if the user is on a Windows device.
const IS_WINDOWS = /Win/.test(navigator.platform);
// For Apple devices or Windows, use the platform-specific share icon.
icon.classList.add(`share${IS_MAC? 'mac' : (IS_WINDOWS? 'windows' : '')}`);

button.addEventListener('click', async () => {
  // Title and text are identical, since the title may actually be ignored.
  const title = document.title;
  const text = document.title;
  // Use the canonical URL, if it exists, else, the current location.
  const url = canonical?.href || location.href;

  // Feature detection to see if the Web Share API is supported.
  if ('share' in navigator) {
    try {
      await navigator.share({
        url,
        text,
        title,
      });
      return;
    } catch (err) {
      // If the user cancels, an `AbortError` is thrown.
      if (err.name !== "AbortError") {
        console.error(err.name, err.message);
      }
    }
  }
  // Fallback to use Twitter's Web Intent URL.
  // (https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent)
  const shareURL = new URL('https://twitter.com/intent/tweet');
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('url', url);
  shareURL.search = params;
  window.open(shareURL, '_blank', 'popup,noreferrer,noopener');
});
