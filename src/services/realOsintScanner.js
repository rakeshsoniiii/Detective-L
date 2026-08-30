// Real Open-Source Intelligence (OSINT) Scanner & Device Fingerprinter
// Programmatic Live API lookups across GitHub, Reddit, Gravatar, Dev.to, HackerNews, and Hardware Fingerprinting
// Created for Detective-L by Rakesh Soni

import md5 from 'md5';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Live programmatic Username Scanner across public CORS-friendly APIs
 */
export async function scanLiveUsername(username) {
  const cleanUsername = username.trim().toLowerCase();
  const results = [];

  // 1. GitHub Public API
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
    if (res.status === 200) {
      const data = await res.json();
      results.push({
        platform: 'GitHub',
        status: 'FOUND',
        url: data.html_url,
        displayName: data.name || data.login,
        avatar: data.avatar_url,
        bio: data.bio || 'Public GitHub Developer Account',
        location: data.location,
        company: data.company,
        publicRepos: data.public_repos,
        followers: data.followers,
        createdYear: data.created_at ? new Date(data.created_at).getFullYear() : null
      });
    } else if (res.status === 404) {
      results.push({ platform: 'GitHub', status: 'NOT_FOUND', url: `https://github.com/${cleanUsername}` });
    }
  } catch (e) {
    results.push({ platform: 'GitHub', status: 'UNCHECKED', url: `https://github.com/${cleanUsername}` });
  }

  // 2. Reddit Public API
  try {
    const res = await fetch(`https://www.reddit.com/user/${encodeURIComponent(cleanUsername)}/about.json`);
    if (res.status === 200) {
      const json = await res.json();
      if (json.data && json.data.name) {
        const d = json.data;
        results.push({
          platform: 'Reddit',
          status: 'FOUND',
          url: `https://reddit.com/user/${cleanUsername}`,
          displayName: `u/${d.name}`,
          avatar: d.icon_img ? d.icon_img.split('?')[0] : null,
          bio: d.subreddit?.public_description || `Reddit Karma: ${d.total_karma || 0}`,
          createdYear: d.created_utc ? new Date(d.created_utc * 1000).getFullYear() : null
        });
      }
    } else if (res.status === 404) {
      results.push({ platform: 'Reddit', status: 'NOT_FOUND', url: `https://reddit.com/user/${cleanUsername}` });
    }
  } catch (e) {
    results.push({ platform: 'Reddit', status: 'UNCHECKED', url: `https://reddit.com/user/${cleanUsername}` });
  }

  // 3. Dev.to Public API
  try {
    const res = await fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(cleanUsername)}`);
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.username) {
        results.push({
          platform: 'Dev.to Community',
          status: 'FOUND',
          url: `https://dev.to/${data.username}`,
          displayName: data.name,
          avatar: data.profile_image,
          bio: data.summary || 'Technical Author / Developer on Dev.to',
          location: data.location
        });
      }
    } else if (res.status === 404) {
      results.push({ platform: 'Dev.to Community', status: 'NOT_FOUND', url: `https://dev.to/${cleanUsername}` });
    }
  } catch (e) {
    results.push({ platform: 'Dev.to Community', status: 'UNCHECKED', url: `https://dev.to/${cleanUsername}` });
  }

  // 4. HackerNews Public Firebase API
  try {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${encodeURIComponent(cleanUsername)}.json`);
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.id) {
        results.push({
          platform: 'HackerNews',
          status: 'FOUND',
          url: `https://news.ycombinator.com/user?id=${data.id}`,
          displayName: data.id,
          bio: data.about || `HackerNews Karma: ${data.karma || 0}`,
          createdYear: data.created ? new Date(data.created * 1000).getFullYear() : null
        });
      } else {
        results.push({ platform: 'HackerNews', status: 'NOT_FOUND', url: `https://news.ycombinator.com/user?id=${cleanUsername}` });
      }
    }
  } catch (e) {
    results.push({ platform: 'HackerNews', status: 'UNCHECKED', url: `https://news.ycombinator.com/user?id=${cleanUsername}` });
  }

  // 5. Gravatar Hash Check for Username
  try {
    const hash = md5(cleanUsername);
    const avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;
    const checkRes = await fetch(avatarUrl, { method: 'HEAD' });
    if (checkRes.ok) {
      results.push({
        platform: 'Gravatar / Automattic Identity',
        status: 'FOUND',
        url: `https://gravatar.com/${cleanUsername}`,
        avatar: avatarUrl,
        displayName: cleanUsername,
        bio: 'Gravatar global public profile avatar detected.'
      });
    }
  } catch (e) {
    // Gravatar check silently completes
  }

  // Additional Major Platform Deep Search Targets
  const additionalPlatforms = [
    { name: 'Twitter / X', url: `https://x.com/${cleanUsername}` },
    { name: 'Instagram', url: `https://instagram.com/${cleanUsername}` },
    { name: 'Telegram', url: `https://t.me/${cleanUsername}` },
    { name: 'LinkedIn', url: `https://www.google.com/search?q=site:linkedin.com/in/${cleanUsername}` },
    { name: 'YouTube', url: `https://youtube.com/@${cleanUsername}` },
    { name: 'TikTok', url: `https://www.tiktok.com/@${cleanUsername}` },
    { name: 'Pinterest', url: `https://pinterest.com/${cleanUsername}` },
    { name: 'Keybase', url: `https://keybase.io/${cleanUsername}` },
    { name: 'Steam', url: `https://steamcommunity.com/id/${cleanUsername}` },
    { name: 'Twitch', url: `https://twitch.tv/${cleanUsername}` },
    { name: 'Spotify', url: `https://open.spotify.com/user/${cleanUsername}` },
    { name: 'Linktree', url: `https://linktr.ee/${cleanUsername}` },
    { name: 'GitLab', url: `https://gitlab.com/${cleanUsername}` },
    { name: 'Substack', url: `https://${cleanUsername}.substack.com` }
  ];

  additionalPlatforms.forEach(p => {
    results.push({
      platform: p.name,
      status: 'LINK_READY',
      url: p.url,
      displayName: `@${cleanUsername}`
    });
  });

  return results;
}

/**
 * Live programmatic Email Address Intelligence & Gravatar / Domain Profiler
 */
export async function scanLiveEmail(rawEmail) {
  if (!rawEmail || !rawEmail.includes('@')) return null;

  const email = rawEmail.trim().toLowerCase();
  const [usernamePart, domainPart] = email.split('@');
  const emailHash = md5(email);

  let gravatarFound = false;
  let gravatarAvatar = null;
  let gravatarName = null;

  // 1. Check Gravatar Profile Hash for Live Avatar / Name
  try {
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=404&s=200`;
    const checkRes = await fetch(avatarUrl, { method: 'HEAD' });
    if (checkRes.ok) {
      gravatarFound = true;
      gravatarAvatar = avatarUrl;
    }
  } catch (e) {
    // Gravatar check
  }

  // 2. Check GitHub Users by Email / Commits
  let githubCommitMatch = null;
  try {
    const ghRes = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(email)}+in:email`);
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      if (ghData.items && ghData.items.length > 0) {
        githubCommitMatch = ghData.items[0];
      }
    }
  } catch (e) {
    // GitHub search
  }

  const freeProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'protonmail.com', 'zoho.com', 'rediffmail.com'];
  const isFree = freeProviders.includes(domainPart);
  const isDisposable = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com', 'trashmail.com', 'getairmail.com'].includes(domainPart);

  return {
    email: email,
    username: usernamePart,
    domain: domainPart,
    md5Hash: emailHash,
    isFreeProvider: isFree,
    isDisposable: isDisposable,
    providerType: isDisposable ? 'Disposable / Burner Email' : isFree ? 'Major Webmail Provider' : 'Custom / Corporate Domain',
    gravatarFound: gravatarFound,
    gravatarAvatar: gravatarAvatar,
    githubUser: githubCommitMatch ? {
      login: githubCommitMatch.login,
      url: githubCommitMatch.html_url,
      avatar: githubCommitMatch.avatar_url
    } : null,
    directIntelLinks: [
      {
        name: "Epieos (Google ID & Maps Review Profile)",
        url: `https://epieos.com/?q=${encodeURIComponent(email)}`,
        desc: "Reveals connected Google Calendar IDs, Google Maps review history, and avatars without triggering security alerts."
      },
      {
        name: "HaveIBeenPwned Breach Registry",
        url: `https://haveibeenpwned.com/unifiedsearch/${encodeURIComponent(email)}`,
        desc: "Checks exposure in historical global database breaches."
      },
      {
        name: "IntelX (DarkNet Pastes & Torrent Records)",
        url: `https://intelx.io/?s=${encodeURIComponent(email)}`,
        desc: "Searches raw pastebin dumps and document repositories."
      },
      {
        name: "DeHashed / BreachDirectory Search",
        url: `https://www.google.com/search?q=site:dehashed.com OR site:leakcheck.io "${encodeURIComponent(email)}"`,
        desc: "Finds database leak mentions."
      }
    ],
    googleDorks: [
      `"${email}" filetype:pdf OR filetype:doc OR filetype:docx`,
      `"${email}" site:pastebin.com OR site:gist.github.com`,
      `"${email}" "password" OR "leak" OR "database" OR "dump"`,
      `"${email}" site:linkedin.com OR site:twitter.com OR site:github.com`,
      `site:${domainPart} "contact" OR "about"`
    ]
  };
}

/**
 * Real Device & Forensic Browser Hardware Fingerprinting (like fingerprint.com / fingerprint.to)
 */
export async function getDeviceFingerprint() {
  let fpId = 'UNKNOWN-HASH';
  let fpComponents = {};

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fpId = result.visitorId;
    fpComponents = result.components;
  } catch (e) {
    fpId = md5(navigator.userAgent + screen.width + screen.height + navigator.language);
  }

  // Extract WebGL Hardware Renderer & Vendor
  let webglRenderer = 'Unknown GPU';
  let webglVendor = 'Unknown Vendor';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {}

  // Extract Canvas 2D Hash
  let canvasHash = 'N/A';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Detective-L OSINT Forensic", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Detective-L OSINT Forensic", 4, 17);
    canvasHash = md5(canvas.toDataURL());
  } catch (e) {}

  // Extract AudioContext Hash
  let audioHash = 'N/A';
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const actx = new AudioCtx();
      audioHash = md5(actx.sampleRate + '_' + actx.state);
    }
  } catch (e) {}

  return {
    visitorId: fpId,
    confidenceScore: 0.99,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages ? navigator.languages.join(', ') : navigator.language,
    hardwareConcurrency: navigator.hardwareConcurrency || 'N/A Cores',
    deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : 'N/A',
    screenResolution: `${window.screen.width}x${window.screen.height} (Color Depth: ${window.screen.colorDepth}-bit)`,
    pixelRatio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    touchSupport: ('ontouchstart' in window) || navigator.maxTouchPoints > 0 ? 'Touch Enabled' : 'No Touch',
    webglVendor: webglVendor,
    webglRenderer: webglRenderer,
    canvasHash: canvasHash,
    audioHash: audioHash,
    cookiesEnabled: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
    doNotTrack: navigator.doNotTrack || 'Unspecified'
  };
}
