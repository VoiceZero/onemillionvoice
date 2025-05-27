const textRadio = document.querySelector('input[value="text"]');
const videoRadio = document.querySelector('input[value="video"]');
const textEntry = document.getElementById("text-entry");
const videoEntry = document.getElementById("video-entry");

textRadio.addEventListener("change", () => {
  textEntry.style.display = "block";
  videoEntry.style.display = "none";
});
videoRadio.addEventListener("change", () => {
  textEntry.style.display = "none";
  videoEntry.style.display = "block";
});
