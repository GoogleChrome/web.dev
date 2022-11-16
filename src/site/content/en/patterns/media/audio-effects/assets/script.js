const button = document.querySelector('button');

button.addEventListener('click', () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  // Value is in hertz.
  oscillator.frequency.setValueAtTime(420, audioCtx.currentTime);

  const biquadFilter = audioCtx.createBiquadFilter();
  biquadFilter.type = 'lowpass';
  biquadFilter.frequency.setValueAtTime(200, audioCtx.currentTime + 1);
  oscillator.connect(biquadFilter);

  biquadFilter.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(2);
});
