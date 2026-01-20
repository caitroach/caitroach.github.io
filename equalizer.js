(() => {
console.log("equalizer.js wrapped version loaded");

const audio = document.getElementById("audio");
const eq = document.getElementById("eq");
const bars = eq ? [...eq.querySelectorAll("span")] : [];

let ctx = null;
let analyser = null;
let src = null;
let freqData = null;
let rafId = null;

function showEqError(msg) {
  console.error(msg);
  if (!eq) return;
  eq.style.borderColor = "red";
  eq.title = msg;
}

function ensureAudioGraph() {
  if (ctx) return true;

  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;

    // IMPORTANT: only ONE MediaElementSource per <audio> on the page
    src = ctx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(ctx.destination);

    freqData = new Uint8Array(analyser.frequencyBinCount);
    return true;
  } catch (e) {
    showEqError("Equalizer init failed: " + (e?.message || e));
    return false;
  }
}

function render() {
  // 🔑 Self-healing loop: always schedule the next frame once started
  rafId = requestAnimationFrame(render);

  if (!analyser || !freqData || bars.length === 0) return;

  analyser.getByteFrequencyData(freqData);

  const step = Math.floor(freqData.length / bars.length);

  for (let i = 0; i < bars.length; i++) {
    const v = freqData[i * step] / 255;  // 0..1
    const h = 4 + Math.round(v * 26);    // 4..30px
    bars[i].style.height = `${h}px`;
    bars[i].style.opacity = `${0.25 + v * 0.75}`;
  }
}

function startRendering() {
  if (rafId == null) render();
}

function stopRendering() {
  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  for (const b of bars) {
    b.style.height = "6px";   // ✅ reset HEIGHT, not transform
    b.style.opacity = "0.4";
  }
}

document.getElementById("play")?.addEventListener("click", async () => {
  if (!ensureAudioGraph()) return;

  // resume needs user gesture
  if (ctx.state === "suspended") await ctx.resume();

  startRendering();
});

audio.addEventListener("play", async () => {
  if (!ensureAudioGraph()) return;
  if (ctx.state === "suspended") await ctx.resume();
  startRendering();
});

audio.addEventListener("pause", stopRendering);
audio.addEventListener("ended", stopRendering);

// init
stopRendering();


})();