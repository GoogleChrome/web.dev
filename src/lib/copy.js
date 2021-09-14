if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
  document.addEventListener('click', async (event) => {
    if (
      !(event.target instanceof Element) ||
      !event.target.classList.contains('w-headline-link')
    ) {
      return;
    }
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(event.target.href);
      const snackbar = document.querySelector('web-snackbar');
      snackbar.setAttribute('type', 'copied');
      snackbar.setAttribute('open', 'open');
    } catch (err) {
      console.warn('Failed to copy: ', err);
    }
  });
}
