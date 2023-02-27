const detectButton = document.querySelector('#detectScreen');
const createButton = document.querySelector('#create');
const permissionLabel = document.querySelector('#permissionStatus');
const screensAvailLabel = document.querySelector('#screensAvail');
const popupUrl = 'supporting-popup.html';
let screenDetails = undefined;
let permission = undefined;
let currentScreenLength = undefined;

detectButton.addEventListener('click', async () => {
  if ('getScreenDetails' in window) {
    screenDetails = await window.getScreenDetails();
    screenDetails.addEventListener('screenschange', (event) => {
      if (screenDetails.screens.length !== currentScreenLength) {
        currentScreenLength = screenDetails.screens.length;
        updateScreenInfo();
      }
    });
    try {
      permission =
        (await navigator.permissions.query({ name: 'window-placement' }))
          .state === 'granted'
          ? 'Granted'
          : 'No Permission';
    } catch (err) {
      console.error(err);
    }
    currentScreenLength = screenDetails.screens.length;
    updateScreenInfo();
  } else {
    screenDetails = window.screen;
    permission = 'Multi-Screen Window Placement API - NOT SUPPORTED';
    currentScreenLength = 1;
    updateScreenInfo();
  }
});

createButton.addEventListener('click', () => {
  const screen =
    screenDetails.screens[Math.floor(Math.random() * currentScreenLength)];
  const options = {
    x: screen.availLeft,
    y: screen.availTop,
    width: screen.availWidth,
    height: screen.availHeight,
  };
  window.open(popupUrl, '_blank', getFeaturesFromOptions(options));
});

const getFeaturesFromOptions = (options) => {
  return (
    'left=' +
    options.x +
    ',top=' +
    options.y +
    ',width=' +
    options.width +
    ',height=' +
    options.height
  );
};

const updateScreenInfo = () => {
  screensAvailLabel.innerHTML = currentScreenLength;
  permissionLabel.innerHTML = permission;
  if ('getScreenDetails' in window && screenDetails.screens.length > 1) {
    createButton.disabled = false;
  } else {
    createButton.disabled = true;
  }
};
