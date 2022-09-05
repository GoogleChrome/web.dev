const button = document.querySelector('button');
const img = document.querySelector('img');

button.addEventListener('click', async () => {
  const responsePromise = fetch(img.src);
  try {
    if ('write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/svg+xml': new Promise(async (resolve) => {
            const blob = await responsePromise.then(response => response.blob());
            resolve(blob);
          }),
        }),
      ]);
      // Image copied as image.
    } else {
      const text = await responsePromise.then(response => response.text());
      await navigator.clipboard.writeText(text);
      // Image copied as source code.
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
});
