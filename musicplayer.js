const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const vol = document.getElementById("vol"); // might be null
const cur = document.getElementById("cur");
const dur = document.getElementById("dur");

const eq = document.getElementById("eq");

const canvasElt = document.getElementById("visualizer");
let audioContext, analyserNode, sourceNode;
let rafId = null;

let smoothBars;

if (!audio || !playBtn || !seek || !cur || !dur) {
  console.error("Player missing elements:", { audio, playBtn, seek, cur, dur, vol });
}


function fmt(t){
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function setEqState(){
  if (!eq) return;
  eq.classList.toggle("idle", audio.paused);
  eq.classList.toggle("playing", !audio.paused);
}
function initVisualizer() {
  if (!canvasElt) return;

  // Create context + nodes once
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;
    analyserNode.smoothingTimeConstant = 0.85; // built-in smoothing

    // IMPORTANT: connect the <audio> element into WebAudio
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    smoothBars = new Float32Array(analyserNode.frequencyBinCount);

    // OPTIONAL but strongly recommended: match canvas CSS size to its internal buffer
    // If you add width/height attrs in HTML, you can delete this.
    if (!canvasElt.width || !canvasElt.height) {
      canvasElt.width = 600;
      canvasElt.height = 120;
    }
  }
}

function startVisualizer() {
  if (!canvasElt) return;
  initVisualizer();

  if (audioContext.state === "suspended") audioContext.resume();
  if (rafId) return; // already running

  const ctx = canvasElt.getContext("2d");
  const lerpFactor = 0.15; // smaller = smoother
  const barsToDraw = 8000;
  const gap = 0.5;

  function draw() {
    const data = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvasElt.width, canvasElt.height);

    // bar width computed to fit canvas neatly
    const totalGaps = (barsToDraw - 1) * gap;
    const barWidth = Math.max(1, Math.floor((canvasElt.width - totalGaps) / barsToDraw));
    const step = Math.max(1, Math.floor(data.length / barsToDraw));

    ctx.fillStyle = "hotpink";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "pink";

const centerX = canvasElt.width / 2;

for (let i = 0; i < barsToDraw / 2; i++) {
  const raw = data[i * step];
  smoothBars[i] += (raw - smoothBars[i]) * lerpFactor;

  const value = smoothBars[i] / 255;
  const h = Math.max(1, value * canvasElt.height);

  const offset = i * (barWidth + gap);

  // right side
  ctx.fillRect(
    centerX + offset,
    canvasElt.height - h,
    barWidth,
    h
  );

  // left side (mirrored)
  ctx.fillRect(
    centerX - offset - barWidth - 1,
    canvasElt.height - h,
    barWidth,
    h
  );
}


    if (!audio.paused && !audio.ended) {
      rafId = requestAnimationFrame(draw);
    } else {
      stopVisualizer();
    }
  }

  rafId = requestAnimationFrame(draw);
}

function stopVisualizer() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}


playBtn.addEventListener("click", async () => {
  if (audio.paused) { await audio.play(); }
  else { audio.pause(); }
});

audio.addEventListener("play", () => {
  playBtn.textContent = "pause";
  setEqState();
  startVisualizer();
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "play";
  setEqState();
  stopVisualizer();
});

audio.addEventListener("ended", () => {
  setEqState();
  stopVisualizer();
});


audio.addEventListener("loadedmetadata", () => {
  seek.max = audio.duration;
  dur.textContent = fmt(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!seek.matches(":active")) seek.value = audio.currentTime;
  cur.textContent = fmt(audio.currentTime);
});

seek.addEventListener("input", () => {
  audio.currentTime = Number(seek.value);
});

// Volume (only if you actually have the slider)
if (vol) {
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
  });
  audio.volume = Number(vol.value);
} else {
  audio.volume = 1;
}


// initial eq state
setEqState();