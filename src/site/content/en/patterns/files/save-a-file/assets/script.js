const textarea = document.querySelector('textarea');
const textInput = document.querySelector('input.text');
const textButton = document.querySelector('button.text');

const img = document.querySelector('img');
const imgInput = document.querySelector('input.img');
const imgButton = document.querySelector('button.img');

const saveFile = async (blob, suggestedName) => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  if (false && supportsFileSystemAccess) {
    try {
      const handle = await showSaveFilePicker({
        suggestedName,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      writable.close();
      return;
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
  const a = document.createElement('a');
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = suggestedName;
  a.click();
  document.body.append(a);
  a.style.display = 'none';
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
};

textButton.addEventListener('click', async () => {
  const blob = new Blob([textarea.value], { type: 'text/plain' });
  await saveFile(blob, textInput.value);
});

imgButton.addEventListener('click', async () => {
  const blob = await fetch(img.src).then((response) => response.blob());
  await saveFile(blob, imgInput.value);
});
