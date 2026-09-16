const CONVERTER_URL = "https://cnvmp3.com/v55";
const pendingByTab = new Map();

function isCnvmp3Url(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "cnvmp3.com";
  } catch {
    return false;
  }
}

function fillVideoUrl(videoUrl) {
  const apply = (input) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (setter) setter.call(input, videoUrl);
    else input.value = videoUrl;

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
    input.focus();
    try {
      input.setSelectionRange(videoUrl.length, videoUrl.length);
    } catch {
      // Some inputs ignore selection.
    }
    return input.value === videoUrl;
  };

  const find = () =>
    document.getElementById("video-url") || document.querySelector("input.input-field-url");

  const input = find();
  if (input) return apply(input);

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const next = find();
      if (!next) return;
      observer.disconnect();
      resolve(apply(next));
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      const late = find();
      resolve(late ? apply(late) : false);
    }, 10000);
  });
}

async function injectUrl(tabId, videoUrl) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: fillVideoUrl,
    args: [videoUrl],
  });
  return Boolean(results?.[0]?.result);
}

async function remember(tabId, videoUrl) {
  pendingByTab.set(tabId, videoUrl);
  await chrome.storage.session.set({ [`fill:${tabId}`]: videoUrl });
}

async function forget(tabId) {
  pendingByTab.delete(tabId);
  await chrome.storage.session.remove(`fill:${tabId}`);
}

async function videoUrlFor(tabId) {
  if (pendingByTab.has(tabId)) return pendingByTab.get(tabId);
  const key = `fill:${tabId}`;
  const stored = await chrome.storage.session.get(key);
  return stored[key] || null;
}

async function tryFill(tabId) {
  const videoUrl = await videoUrlFor(tabId);
  if (!videoUrl) return false;

  try {
    const filled = await injectUrl(tabId, videoUrl);
    if (filled) {
      await forget(tabId);
      return true;
    }
  } catch {
    // Page may not be ready yet.
  }
  return false;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "openConverter" || !message.videoUrl) return;

  (async () => {
    const tab = await chrome.tabs.create({ url: CONVERTER_URL });
    await remember(tab.id, message.videoUrl);
    await tryFill(tab.id);
    sendResponse({ ok: true });
  })().catch((error) => sendResponse({ ok: false, error: String(error) }));

  return true;
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status !== "complete" || !isCnvmp3Url(tab.url)) return;
  await tryFill(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  forget(tabId);
});
