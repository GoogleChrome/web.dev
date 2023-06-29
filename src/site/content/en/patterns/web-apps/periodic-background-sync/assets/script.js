const available = document.querySelector('.available');
const notAvailable = document.querySelector('.not-available');
const ul = document.querySelector('ul');
const lastUpdated = document.querySelector('.last-updated');

const updateContent = async () => {
  const data = await fetch(
    'https://worldtimeapi.org/api/timezone/Europe/London.json'
  ).then((response) => response.json());
  return new Date(data.unixtime * 1000);
};

const registerPeriodicBackgroundSync = async (registration) => {
  const status = await navigator.permissions.query({
    name: 'periodic-background-sync',
  });
  if (status.state === 'granted' && 'periodicSync' in registration) {
    try {
      // Register the periodic background sync.
      await registration.periodicSync.register('content-sync', {
        // An interval of one day.
        minInterval: 24 * 60 * 60 * 1000,
      });
      available.hidden = false;
      notAvailable.hidden = true;

      // List registered periodic background sync tags.
      const tags = await registration.periodicSync.getTags();
      if (tags.length) {
        ul.innerHTML = '';
      }
      tags.forEach((tag) => {
        const li = document.createElement('li');
        li.textContent = tag;
        ul.append(li);
      });

      // Update the user interface with the last periodic background sync data.
      const backgroundSyncCache = await caches.open('periodic-background-sync');
      if (backgroundSyncCache) {
        const backgroundSyncResponse =
          backgroundSyncCache.match('/last-updated');
        if (backgroundSyncResponse) {
          lastUpdated.textContent = `${await fetch('/last-updated').then(
            (response) => response.text()
          )} (periodic background-sync)`;
        }
      }

      // Listen for incoming periodic background sync messages.
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data.tag === 'content-sync') {
          lastUpdated.textContent = `${await updateContent()} (periodic background sync)`;
        }
      });
    } catch (err) {
      console.error(err.name, err.message);
      available.hidden = true;
      notAvailable.hidden = false;
      lastUpdated.textContent = 'Never';
    }
  } else {
    available.hidden = true;
    notAvailable.hidden = false;
    lastUpdated.textContent = `${await updateContent()} (manual)`;
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('Service worker registered for scope', registration.scope);

    await registerPeriodicBackgroundSync(registration);
  });
}
