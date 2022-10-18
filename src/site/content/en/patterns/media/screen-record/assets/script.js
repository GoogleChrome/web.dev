const video = document.querySelector('video');
const shareScreenButton = document.querySelector('#shareScreenButton');
const startRecordButton = document.querySelector('#startRecordButton');
const stopRecordButton = document.querySelector('#stopRecordButton');

let recorder;

shareScreenButton.addEventListener("click", async () => {
  // Prompt user to share their screen.
  const stream = await navigator.mediaDevices.getDisplayMedia();
  recorder = new MediaRecorder(stream);
  // Preview screen locally.
  video.srcObject = stream;

  startRecordButton.disabled = false;
  log("Your screen is being shared.");
});

startRecordButton.addEventListener("click", async () => {
  // Prompt user to choose where to save the recording file.
  const suggestedName = "screen-record.webm";
  const handle = await window.showSaveFilePicker({ suggestedName });
  const writable = await handle.createWritable();

  // Start recording.
  recorder.start();
  recorder.addEventListener("dataavailable", async (event) => {
    // Write chunks to the file.
    await writable.write(event.data);
    if (recorder.state == "inactive") {
      // Close file when recording stops.
      await writable.close();
    }
  });

  stopRecordButton.disabled = false;
  log("Your screen is being recorded locally.");
});

stopRecordButton.addEventListener("click", () => {
  // Stop recording.
  recorder.stop();

  stopRecordButton.disabled = true;
  log("Your screen has been successfully recorded locally.");
});
