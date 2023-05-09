document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  const images = document.querySelectorAll('[data-src-light][data-src-dark]');

  const updateImageSrc = () => {
    const userColorScheme = localStorage.getItem('user-color-scheme') || (themeToggle.checked ? 'dark' : 'light');

    images.forEach(img => {
      img.src = img.getAttribute(`data-src-${userColorScheme}`);
    });
  };

  updateImageSrc();
  themeToggle.addEventListener('change', () => {
    const userColorScheme = themeToggle.checked ? 'dark' : 'light';
    localStorage.setItem('user-color-scheme', userColorScheme);
    updateImageSrc();
  });
});
