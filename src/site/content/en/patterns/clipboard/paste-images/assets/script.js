document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const clipboardItems = typeof navigator?.clipboard?.read === 'function' ? await navigator.clipboard.read() : e.clipboardData.files;

  for (const clipboardItem of clipboardItems) {
    let blob;
    if (clipboardItem.type?.startsWith('image/')) {
      // For files from `e.clipboardData.files`.
      blob = clipboardItem
      // Do something with the blob.
      appendImage(blob);
    } else {
      // For files from `navigator.clipboard.read()`.
      const imageTypes = clipboardItem.types?.filter(type => type.startsWith('image/'))
      for (const imageType of imageTypes) {
        blob = await clipboardItem.getType(imageType);
        // Do something with the blob.
        appendImage(blob);
      }
    }
  }
});

const appendImage = (blob) => {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(blob);
  document.body.append(img);
};