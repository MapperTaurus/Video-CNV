const statusEl = document.getElementById("status");
const urlEl = document.getElementById("url");
const openBtn = document.getElementById("open");

function setStatus(text) {
  statusEl.textContent = text;
}

async function openConverter(videoUrl) {
  await chrome.runtime.sendMessage({ type: "openConverter", videoUrl });
  window.close();
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const videoUrl = tab?.url ? getSupportedVideoUrl(tab.url) : null;

  if (!videoUrl) {
    setStatus("Open a supported video, then click the extension.");
    openBtn.hidden = false;
    openBtn.disabled = true;
    openBtn.textContent = "No video found";
    return;
  }

  setStatus("Opening CnvMP3 with this video:");
  urlEl.hidden = false;
  urlEl.textContent = videoUrl;
  openBtn.hidden = false;
  openBtn.textContent = "Open in CnvMP3";
  openBtn.addEventListener("click", () => openConverter(videoUrl), { once: true });
  await openConverter(videoUrl);
}

init().catch(() => {
  setStatus("Could not read the current tab.");
  openBtn.hidden = false;
  openBtn.disabled = true;
  openBtn.textContent = "Unavailable";
});
