const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;

function hostOf(url) {
  return url.hostname.replace(/^www\./, "").toLowerCase();
}

function originPath(url) {
  return `${url.origin}${url.pathname}`;
}

function getYouTubeWatchUrl(pageUrl) {
  let parsed;
  try {
    parsed = new URL(pageUrl);
  } catch {
    return null;
  }

  const host = hostOf(parsed);
  const youtubeHost =
    host === "youtu.be" ||
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host.endsWith(".youtube.com");

  if (!youtubeHost) return null;

  let videoId = null;

  if (host === "youtu.be") {
    videoId = parsed.pathname.split("/").filter(Boolean)[0];
  } else if (parsed.pathname === "/watch" || parsed.pathname.startsWith("/watch/")) {
    videoId = parsed.searchParams.get("v");
  } else {
    const match = parsed.pathname.match(/^\/(shorts|embed|live)\/([^/?]+)/);
    if (match) videoId = match[2];
  }

  if (videoId) videoId = videoId.slice(0, 11);
  if (!videoId || !YOUTUBE_ID.test(videoId)) return null;

  return `https://www.youtube.com/watch?v=${videoId}`;
}

function getSupportedVideoUrl(pageUrl) {
  let parsed;
  try {
    parsed = new URL(pageUrl);
  } catch {
    return null;
  }

  const host = hostOf(parsed);
  const path = parsed.pathname;

  const youtubeUrl = getYouTubeWatchUrl(pageUrl);
  if (youtubeUrl) return youtubeUrl;

  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    if (/\/video\/\d+/.test(path) || /\/t\/[^/]+/.test(path) || host.startsWith("vm.") || host.startsWith("vt.")) {
      return originPath(parsed);
    }
    return null;
  }

  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    const match = path.match(/^\/(reel|reels|p|tv)\/([^/]+)/);
    if (match) return `https://www.instagram.com/${match[1]}/${match[2]}/`;
    return null;
  }

  if (host === "reddit.com" || host.endsWith(".reddit.com") || host === "redd.it" || host === "v.redd.it") {
    if (host === "v.redd.it" || host === "redd.it" || /\/comments\//.test(path) || /\/video\//.test(path)) {
      return originPath(parsed);
    }
    return null;
  }

  if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.watch" || host === "fb.com") {
    if (host === "fb.watch" || /\/(reel|reels|videos|watch|share)\b/.test(path) || parsed.searchParams.has("v")) {
      return `${parsed.origin}${parsed.pathname}${parsed.search}`;
    }
    return null;
  }

  if (host === "twitch.tv" || host.endsWith(".twitch.tv")) {
    if (host === "clips.twitch.tv" || /\/clip\//.test(path)) {
      return originPath(parsed);
    }
    return null;
  }

  if (host === "x.com" || host === "twitter.com" || host.endsWith(".x.com") || host.endsWith(".twitter.com")) {
    const match = path.match(/\/([^/]+)\/status\/(\d+)/);
    if (match) return `https://${host.endsWith("twitter.com") ? "twitter.com" : "x.com"}/${match[1]}/status/${match[2]}`;
    return null;
  }

  return null;
}
