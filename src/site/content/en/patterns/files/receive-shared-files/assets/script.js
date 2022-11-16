window.addEventListener('load', async () => {
  if (location.search.includes('share-target')) {
    const keys = await caches.keys();
    const mediaCache = await caches.open(
      keys.filter((key) => key.startsWith('media'))[0],
    );
    const image = await mediaCache.match('shared-image');
    if (image) {
      const blob = await image.blob();
      await mediaCache.delete('shared-image');
      // Handle the shared file somehow.
    }
  }
});
