const textEl = document.getElementById("text");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const voiceSelect = document.getElementById("voiceSelect");
const rateEl = document.getElementById("rate");
const pitchEl = document.getElementById("pitch");
const volumeEl = document.getElementById("volume");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const volValue = document.getElementById("volValue");
const voiceMeta = document.getElementById("voiceMeta");
const statusEl = document.getElementById("status");

let synth = window.speechSynthesis;
let voices = [];
let utterance = null;

// Load available voices
function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — Default" : ""}`;
    voiceSelect.appendChild(option);
  });

  voiceMeta.textContent = `${voices.length} voice(s) available.`;
}

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoices;
}

// Update slider values
rateEl.addEventListener("input", () => (rateValue.textContent = rateEl.value));
pitchEl.addEventListener("input", () => (pitchValue.textContent = pitchEl.value));
volumeEl.addEventListener("input", () => (volValue.textContent = volumeEl.value));

// Speak text
function speakText() {
  const text = textEl.value.trim();
  if (!text) return alert("Please enter some text!");

  if (synth.speaking) synth.cancel();

  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceSelect.value];
  utterance.rate = rateEl.value;
  utterance.pitch = pitchEl.value;
  utterance.volume = volumeEl.value;

  utterance.onstart = () => (statusEl.textContent = "Speaking...");
  utterance.onend = () => (statusEl.textContent = "Finished");
  utterance.onerror = () => (statusEl.textContent = "Error");

  synth.speak(utterance);
}

// Control buttons
playBtn.addEventListener("click", speakText);
pauseBtn.addEventListener("click", () => {
  if (synth.speaking && !synth.paused) synth.pause();
});
resumeBtn.addEventListener("click", () => {
  if (synth.paused) synth.resume();
});
stopBtn.addEventListener("click", () => {
  synth.cancel();
  statusEl.textContent = "Stopped";
});

// Initial load
populateVoices();
