const startMicrophoneButton = document.querySelector('#startMicrophoneButton');
const stopMicrophoneButton = document.querySelector('#stopMicrophoneButton');
const startRecordButton = document.querySelector('#startRecordButton');
const stopRecordButton = document.querySelector('#stopRecordButton');

let stream;
let recorder;

startMicrophoneButton.addEventListener("click", async () => {
  // Prompt the user to use their microphone.
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);

  stopMicrophoneButton.disabled = false;
  startRecordButton.disabled = false;
  log("Your microphone audio is being used.");
});

stopMicrophoneButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());

  startRecordButton.disabled = true;
  stopRecordButton.disabled = true;
  log("Your microphone audio is not used anymore.");
});

startRecordButton.addEventListener("click", async () => {
  // Prompt the user to choose where to save the recording file.
  const suggestedName = "microphone-recording.webm";
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
  log("Your microphone audio is being recorded locally.");
});

stopRecordButton.addEventListener("click", () => {
  // Stop the recording.
  recorder.stop();

  stopRecordButton.disabled = true;
  log("Your microphone audio has been successfully recorded locally.");
});
