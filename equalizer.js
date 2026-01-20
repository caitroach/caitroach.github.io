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
  if (ctx) return;

  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;

    // Important: only ONE MediaElementSource per <audio> for the whole page
    src = ctx.createMediaElementSource(audio);

    src.connect(analyser);
    analyser.connect(ctx.destination);

    freqData = new Uint8Array(analyser.frequencyBinCount);
  } catch (e) {
    showEqError("Equalizer init failed: " + (e?.message || e));
    throw e; // stop here so we don't pretend it worked
  }
}


function render() {
  if (!analyser || !freqData || bars.length === 0) return;

  analyser.getByteFrequencyData(freqData);

  // DEBUG: compute max so we know if we're getting real signal
  let max = 0;
  for (const x of freqData) if (x > max) max = x;

  const step = Math.floor(freqData.length / bars.length);

  for (let i = 0; i < bars.length; i++) {
    const v = freqData[i * step] / 255;     // 0..1
    const h = 4 + Math.round(v * 26);       // 4px..30px (very visible)
    bars[i].style.height = `${h}px`;
    bars[i].style.opacity = `${0.25 + v * 0.75}`;
  }

  // If max is always 0, you're getting silence into the analyser.
  // Temporarily log it:
  // console.log("EQ max:", max, "ctx:", ctx?.state);

  rafId = requestAnimationFrame(render);
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
    b.style.transform = "scaleY(0.25)";
    b.style.opacity = "0.4";
  }
}

// IMPORTANT: kick everything from the PLAY BUTTON click (user gesture)
document.getElementById("play")?.addEventListener("click", async () => {
  ensureAudioGraph();

  if (ctx.state === "suspended") await ctx.resume();

  // If we're about to play, start rendering immediately
  // (even if the play event is slightly delayed)
  startRendering();

  // If audio ends up paused, stop will handle it on pause/end
});

audio.addEventListener("pause", stopRendering);
audio.addEventListener("ended", stopRendering);
audio.addEventListener("play", () => {
  // make sure ctx is running even if play came from something else
  if (ctx && ctx.state === "suspended") ctx.resume();
  startRendering();
});

// init
stopRendering();