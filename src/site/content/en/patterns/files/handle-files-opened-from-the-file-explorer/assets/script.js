if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      document.body.innerHTML += `<p>${fileHandle.name}</p>`;
    }
  });
}