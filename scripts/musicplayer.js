const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const vol = document.getElementById("vol");
const cur = document.getElementById("cur");
const dur = document.getElementById("dur");

function fmt(t){
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

playBtn.addEventListener("click", async () => {
  if (audio.paused) { await audio.play(); }
  else { audio.pause(); }
});

audio.addEventListener("play", () => playBtn.textContent = "pause");
audio.addEventListener("pause", () => playBtn.textContent = "play");

audio.addEventListener("loadedmetadata", () => {
  seek.max = audio.duration;
  dur.textContent = fmt(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  // don’t fight the user while dragging
  if (!seek.matches(":active")) seek.value = audio.currentTime;
  cur.textContent = fmt(audio.currentTime);
});

seek.addEventListener("input", () => {
  audio.currentTime = Number(seek.value);
});

vol.addEventListener("input", () => {
  audio.volume = Number(vol.value);
});

// initial volume
audio.volume = Number(vol.value);
