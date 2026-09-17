# ![Video CNV Logo](icons/icon48.png "Video CNV Logo") Video CNV

A lightweight browser extension **and** userscript that opens [CnvMP3](https://cnvmp3.com/) with the **current video URL already filled in**.

It does **not** change the layout on the video page itself.

---

## ✨ Features

### 🎬 One-click converter

- While watching a supported video, click the **Video CNV** toolbar icon (extension) or **🎬 Open in CnvMP3** in your userscript manager (userscript)
- Opens [cnvmp3.com](https://cnvmp3.com/v55) with the video URL already in the converter field
- You choose MP3 / MP4, quality, and click **Convert** on CnvMP3

### 🌐 Supported sites

Works on pages that [CnvMP3](https://cnvmp3.com/) can convert:

- **YouTube** videos & Shorts
- **TikTok** videos
- **Reddit** videos
- **Instagram** Reels / posts
- **Facebook** videos & Reels
- **Twitch** clips
- **X (Twitter)** videos

### 🪶 Lightweight

- Does not inject buttons, banners, or extra UI into the site you are watching
- The extension only needs access to the current tab and CnvMP3
- The userscript only runs on the supported sites listed above, plus CnvMP3. Commands appear in the Tampermonkey, Violentmonkey, or Greasemonkey menu

---

## 📥 Installation

Choose **one** of the two routes below. Both work the same way — you do not need both.

### Option 1 — Browser extension

For Chrome, Edge, Brave, and other Chromium browsers:

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this folder (the one that contains `manifest.json`).
5. Pin **Video CNV** if you want the toolbar icon always visible.

You can also unzip [`dist/Video-CNV.zip`](dist/Video-CNV.zip) and load that unpacked folder the same way.

---

### Option 2 — Userscript

This route needs a userscript manager (not the browser extension above):

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.tampermonkey.net/)   [![Greasemonkey](https://img.shields.io/badge/Greasemonkey-FBAC00?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)   [![Violentmonkey](https://img.shields.io/badge/Violentmonkey-c37731?style=for-the-badge&logo=vivaldi&logoColor=white)](https://violentmonkey.github.io/get-it/)

#### 🖱️ One-Click Install

Click below to install the script directly:

[![Install from GitHub](https://img.shields.io/badge/Install%20from-GitHub-24292E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MapperTaurus/Video-CNV/raw/refs/heads/master/VideoCNV.user.js)

> Make sure one of the userscript managers above is installed and enabled in your browser.

You can also open `VideoCNV.user.js` from this repository and your userscript manager will offer to install it.

---

## 🛠 How It Works

### Extension

1. Open a supported video (YouTube, TikTok, Reddit, Instagram, Facebook, Twitch clip, or X).
2. Click the **Video CNV** icon in the toolbar.
3. A CnvMP3 tab opens with that URL already in the input field.
4. Choose format / quality and click **Convert**.

### Userscript

1. Open a supported video (for example a YouTube watch page).
2. Click your **userscript manager** icon in the toolbar (Tampermonkey, Violentmonkey, or Greasemonkey) — not its dashboard.
3. Click **Video CNV**. The manager opens the script’s function list.
4. Click **🎬 Open in CnvMP3**.
5. A CnvMP3 tab opens with that URL already in the input field.
6. Choose format / quality and click **Convert**.

The function list only appears while you are on a matching site (YouTube, TikTok, Reddit, Instagram, Facebook, Twitch, X, or CnvMP3). On the manager’s own dashboard you will only see enable / disable.

Reinstall or refresh `VideoCNV.user.js` so version **1.2.2** is active. Neither version changes the original site.

---

## ❓ FAQ

**Q: Does this add a download button on YouTube (or TikTok, etc.)?**  
No. It never changes those sites. The extension uses its toolbar icon. The userscript uses your manager’s menu (`🎬 Open in CnvMP3`), like other scripts’ settings commands.

**Q: What if I'm not on a video page?**  
The extension popup says **No video found**. The userscript shows a short alert. Open a real video / reel / clip first.

**Q: Does it download the file itself?**  
No. It only opens [CnvMP3](https://cnvmp3.com/) and fills the URL field. Conversion still happens on their site.

**Q: Do I need both the extension and the userscript?**  
No. Pick one. They do the same job.

**Q: Is it safe to use?**  
The extension only reads the current tab URL and writes into CnvMP3's public input field. It does not send your data anywhere else. Use CnvMP3 only for content you have the right to convert.

---

## 📄 License

See [LICENSE](LICENSE).

This software is provided free of charge for personal and non-commercial use.

---

## 👤 Author

Made by [Ivan Todorov](https://github.com/MapperTaurus)  
📧 Contact: ivan.it.qa@gmail.com

---

## ⭐ Like this extension?

Please consider ⭐ starring the repo and supporting my work:

[![Revolut](https://img.shields.io/badge/Support%20via-Revolut-0075EB?style=for-the-badge&logo=revolut&logoColor=white)](https://Revolut.Me/ivan3ryuk)  
[![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://PayPal.me/mappertaurus)
