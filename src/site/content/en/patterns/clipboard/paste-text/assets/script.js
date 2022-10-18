const pasteButton = document.querySelector('button');

pasteButton.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText()
    document.querySelector('textarea').value += text;
    console.log('Text pasted.');
  } catch (error) {
    console.log('Failed to read clipboard. Using execCommand instead.');
    document.querySelector('textarea').focus();
    const result = document.execCommand('paste')
    console.log('document.execCommand result: ', result);
  }
});