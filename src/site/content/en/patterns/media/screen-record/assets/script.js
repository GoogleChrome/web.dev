const video = document.querySelector('video');
const startShareScreenButton = document.querySelector('#startShareScreenButton');
const stopShareScreenButton = document.querySelector('#stopShareScreenButton');
const startRecordButton = document.querySelector('#startRecordButton');
const stopRecordButton = document.querySelector('#stopRecordButton');

let stream;
let recorder;

startShareScreenButton.addEventListener("click", async () => {
  // Prompt the user to share their screen.
  stream = await navigator.mediaDevices.getDisplayMedia();
  recorder = new MediaRecorder(stream);
  // Preview the screen locally.
  video.srcObject = stream;

  startRecordButton.disabled = false;
  stopShareScreenButton.disabled = false;
  log("Your screen is being shared.");
});

stopShareScreenButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;

  stopShareScreenButton.disabled = true;
  startRecordButton.disabled = true;
  stopRecordButton.disabled = true;
  log("Your screen is not shared anymore.");
});

startRecordButton.addEventListener("click", async () => {
  // Prompt the user to choose where to save the recording file.
  const suggestedName = "screen-recording.webm";
  const handle = await window.showSaveFilePicker({ suggestedName });
  const writable = await handle.createWritable();

  // Start recording.
  recorder.start();
  recorder.addEventListener("dataavailable", async (event) => {
    // Write chunks to the file.
    await writable.write(event.data);
    if (recorder.state === "inactive") {
      // Close the file when the recording stops.
      await writable.close();
    }
  });

  stopRecordButton.disabled = false;
  log("Your screen is being recorded locally.");
});

stopRecordButton.addEventListener("click", () => {
  // Stop the recording.
  recorder.stop();

  stopRecordButton.disabled = true;
  log("Your screen has been successfully recorded locally.");
});
