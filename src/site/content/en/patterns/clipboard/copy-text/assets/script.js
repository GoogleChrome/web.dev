const textarea = document.querySelector('textarea');
const button = document.querySelector('button');

button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(textarea.value);
  } catch (err) {
    console.error(err.name, err.message);
  }
});
