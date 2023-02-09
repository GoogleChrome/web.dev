const startMicrophoneButton = document.querySelector('#startMicrophoneButton');
const stopMicrophoneButton = document.querySelector('#stopMicrophoneButton');

let stream;

startMicrophoneButton.addEventListener("click", async () => {
  // Prompt the user to use their microphone.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);

  // Load and execute the module script.
  await context.audioWorklet.addModule("processor.js");
  // Create an AudioWorkletNode. The name of the processor is the
  // one passed to registerProcessor() in the module script.
  const processor = new AudioWorkletNode(context, "processor");

  source.connect(processor).connect(context.destination);

  stopMicrophoneButton.disabled = false;
  log("Your microphone audio is being used.");
});

stopMicrophoneButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());

  log("Your microphone audio is not used anymore.");
});
