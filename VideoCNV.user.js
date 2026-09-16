// ==UserScript==
// @name         Video CNV
// @namespace    https://github.com/MapperTaurus/Video-CNV
// @version      1.2.1
// @description  Opens CnvMP3 with the current video URL already filled in. Does not change the site you are watching.
// @author       Taurus#
// @homepage     https://github.com/MapperTaurus/Video-CNV
// @downloadURL  https://github.com/MapperTaurus/Video-CNV/raw/main/VideoCNV.user.js
// @updateURL    https://github.com/MapperTaurus/Video-CNV/raw/main/VideoCNV.user.js
// @license      https://github.com/MapperTaurus/Video-CNV/blob/main/LICENSE
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB70lEQVR42u2asWrCQBjHncTFzcXFRSJO3foEbvoCxVcQHO0TuBRcOwmuLuYR3DspCF3qEKFgoQVTKdgW8av/gNK0Sc5czsud3ME3Jffd/5dc/hfuu0wmpF3lcte3hcKdXSo9TMpl98mydvNKhc4dGAfjYVyMDx2ZOK2czVbvi0VbhthTA3qgiym+kc/fPFrWp0riDwFd0BcpXkXhfyMQAq9H1Scf9Cb+TSfV5vwp34TPbXQSf4ijO8GqdASAbg8AfqsjAHR7AFg0dASAbg9A9Ar70unQa7cbGLgmcsX2AEQ/ma/5nMIarhkAA2AADIABMAAGIAnAotGIDBYAq//ZAda2TZvZLDRYAFF9kVvKFNpMp7R1XRLVkAs5pX4D2/VaHMA+l/yPuFqlVb+fWDxyIFcqLrSo1+l9NOIWj77IkaqNLlst+hiPY4tHH/RVYh146/VoM5mcLB73oo9SCxks8NtxmOJxTxy7lLoSs+yVxy6l/0pE2SuPXUoHCLNXXruUDxBgr0nsMhWA3/aa1C5TAzjYa1K7ZALIqn2dDUD7vVGe3ellu71zh0MSGfucfLvTPPWB1WBAohtyctUHeCo0KgD46sdxa2RpA/hqZDxVSqdWo+dmU2ggJ3eVUvs68UVU6i/irATrtIqsSHRaRbf2A5DRJovls/d/AAAAAElFTkSuQmCC
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://youtu.be/*
// @match        https://www.tiktok.com/*
// @match        https://tiktok.com/*
// @match        https://vm.tiktok.com/*
// @match        https://vt.tiktok.com/*
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://fb.watch/*
// @match        https://www.twitch.tv/*
// @match        https://twitch.tv/*
// @match        https://clips.twitch.tv/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://cnvmp3.com/*
// @match        https://www.cnvmp3.com/*
// @noframes
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    const CONVERTER_URL = 'https://cnvmp3.com/v55';
    const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;

    function hostOf(url) {
        return url.hostname.replace(/^www\./, '').toLowerCase();
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
            host === 'youtu.be' ||
            host === 'youtube.com' ||
            host === 'm.youtube.com' ||
            host === 'music.youtube.com' ||
            host.endsWith('.youtube.com');

        if (!youtubeHost) return null;

        let videoId = null;

        if (host === 'youtu.be') {
            videoId = parsed.pathname.split('/').filter(Boolean)[0];
        } else if (parsed.pathname === '/watch' || parsed.pathname.startsWith('/watch/')) {
            videoId = parsed.searchParams.get('v');
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

        if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
            if (/\/video\/\d+/.test(path) || /\/t\/[^/]+/.test(path) || host.startsWith('vm.') || host.startsWith('vt.')) {
                return originPath(parsed);
            }
            return null;
        }

        if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
            const match = path.match(/^\/(reel|reels|p|tv)\/([^/]+)/);
            if (match) return `https://www.instagram.com/${match[1]}/${match[2]}/`;
            return null;
        }

        if (host === 'reddit.com' || host.endsWith('.reddit.com') || host === 'redd.it' || host === 'v.redd.it') {
            if (host === 'v.redd.it' || host === 'redd.it' || /\/comments\//.test(path) || /\/video\//.test(path)) {
                return originPath(parsed);
            }
            return null;
        }

        if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.watch' || host === 'fb.com') {
            if (host === 'fb.watch' || /\/(reel|reels|videos|watch|share)\b/.test(path) || parsed.searchParams.has('v')) {
                return `${parsed.origin}${parsed.pathname}${parsed.search}`;
            }
            return null;
        }

        if (host === 'twitch.tv' || host.endsWith('.twitch.tv')) {
            if (host === 'clips.twitch.tv' || /\/clip\//.test(path)) {
                return originPath(parsed);
            }
            return null;
        }

        if (host === 'x.com' || host === 'twitter.com' || host.endsWith('.x.com') || host.endsWith('.twitter.com')) {
            const match = path.match(/\/([^/]+)\/status\/(\d+)/);
            if (match) return `https://${host.endsWith('twitter.com') ? 'twitter.com' : 'x.com'}/${match[1]}/status/${match[2]}`;
            return null;
        }

        return null;
    }

    function youtubeUrlFromHash() {
        const hash = window.location.hash.slice(1);
        if (!hash.startsWith('cnvyt=')) return null;
        try {
            return decodeURIComponent(hash.slice('cnvyt='.length));
        } catch {
            return null;
        }
    }

    function isConverterPage() {
        return hostOf(location) === 'cnvmp3.com';
    }

    function setInputValue(input, value) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (setter) setter.call(input, value);
        else input.value = value;

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        input.focus();
        try {
            input.setSelectionRange(value.length, value.length);
        } catch {
            // Some inputs ignore selection.
        }
        return input.value === value;
    }

    function fillConverter(videoUrl) {
        const find = () =>
            document.getElementById('video-url') || document.querySelector('input.input-field-url');

        const apply = () => {
            const input = find();
            if (!input) return false;
            setInputValue(input, videoUrl);
            if (window.location.hash.startsWith('#cnvyt=')) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            return true;
        };

        if (apply()) return;

        const observer = new MutationObserver(() => {
            if (apply()) observer.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }

    function openConverter() {
        const videoUrl = getSupportedVideoUrl(location.href);
        if (!videoUrl) {
            alert('Video CNV: open a supported video page first.');
            return;
        }

        GM_setValue('pendingVideoUrl', videoUrl);
        const target = new URL(CONVERTER_URL);
        target.hash = `cnvyt=${encodeURIComponent(videoUrl)}`;
        GM_openInTab(target.href, { active: true });
    }

    // Register menu commands (shown when you click Tampermonkey on a matching page)
    GM_registerMenuCommand('🎬 Open in CnvMP3', openConverter);
    GM_registerMenuCommand('❤️ Like This Script?', () => {
        window.open('https://github.com/MapperTaurus/Video-CNV?tab=readme-ov-file#-like-this-extension', '_blank');
    });

    if (!isConverterPage()) return;

    function initConverterPage() {
        const videoUrl = youtubeUrlFromHash() || GM_getValue('pendingVideoUrl', '');
        if (!videoUrl) return;
        GM_deleteValue('pendingVideoUrl');
        fillConverter(videoUrl);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConverterPage);
    } else {
        initConverterPage();
    }
})();
