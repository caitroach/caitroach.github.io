const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const vol = document.getElementById("vol");
const cur = document.getElementById("cur");
const dur = document.getElementById("dur");

const eq = document.getElementById("eq");

const canvasElt = document.getElementById("visualizer");
let audioContext, analyserNode, sourceNode;
let rafId = null;

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

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;
    analyserNode.smoothingTimeConstant = 0.85; 

    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    }
  }

function startVisualizer() {
  if (!canvasElt) return;
  initVisualizer();

  if (audioContext.state === "suspended") audioContext.resume();
  if (rafId) return;

  const canvasContext = canvasElt.getContext("2d");
  console.log("canvas context get");
  const width = canvasElt.width;
  const height = canvasElt.height;

  function draw() { 
    const freq = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(freq);

    rafId = requestAnimationFrame(draw);

    canvasContext.clearRect(0,0, width, height);

    console.log("canvas cleared");

    const arrlen = freq.length;

    console.log("drawing");

    for (let i = 0; i < arrlen; i++) {
      const value = Math.min(1, Math.max(0, freq[i] / 255));
      const y = height - (height*value);
      const x = (i/(arrlen - 1))*(width - 1);
      if (i%2==0) {canvasContext.fillStyle="red"}
      else {canvasContext.fillStyle = "blue";}
      canvasContext.fillRect(x, y, 5, 6);
    }
  }
  draw();
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

if (vol) {
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
  });
  audio.volume = Number(vol.value);
} else {
  audio.volume = 1;
}

setEqState();