const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const vol = document.getElementById("vol"); // might be null
const cur = document.getElementById("cur");
const dur = document.getElementById("dur");

const eq = document.getElementById("eq");

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

playBtn.addEventListener("click", async () => {
  if (audio.paused) { await audio.play(); }
  else { audio.pause(); }
});

audio.addEventListener("play", () => {
  playBtn.textContent = "pause";
  setEqState();
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "play";
  setEqState();
});

audio.addEventListener("ended", setEqState);

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
