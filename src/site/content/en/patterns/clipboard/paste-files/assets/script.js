document.addEventListener('paste', async (e) => {
  // Prevent the default behavior, so you can code your own logic.
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  // Iterate over all pasted files.
  Array.from(e.clipboardData.files).forEach(async (file) => {
    // Add more checks here for MIME types you're interested in,
    // such as `application/pdf`, `video/mp4`, etc.
    if (file.type.startsWith('image/')) {
      // For images, create an image and append it to the `body`.
      const img = document.createElement('img');
      const blob = URL.createObjectURL(file);
      img.src = blob;
      document.body.append(img);
    } else if (file.type.startsWith('text/')) {
      // For text files, read the contents and output it into a `textarea`.
      const textarea = document.createElement('textarea');
      textarea.value = await file.text();
      document.body.append(textarea);
    }
  });
});
