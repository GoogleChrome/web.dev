const button = document.querySelector('button');
const img =  document.querySelector('img');

const webShareSupported = 'canShare' in navigator;
button.textContent = webShareSupported ? 'Share' : 'Download';

const shareOrDownload = async (blob, fileName, title, text) => {
  if (webShareSupported) {
    const data = {
      files: [
        new File([blob], fileName, {
          type: blob.type,
        }),
      ],
      title,
      text,
    };
    if (navigator.canShare(data)) {
      try {
        await navigator.share(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      } finally {
        return;
      }
    }
  }
  // Fallback
  const a = document.createElement('a');
  a.download = fileName;
  a.style.display = 'none';
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000)
  });
  document.body.append(a);
  a.click();
};

button.addEventListener('click', async () => {
  const blob = await fetch(img.src).then(res => res.blob());
  await shareOrDownload(blob, 'cat.png', 'Cat in the snow', 'Getting cold feet…');
});
