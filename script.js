/**
 * ARGUS Sovereign OS Marketing Portal Script
 * Includes dynamic release resolution, instant download handlers, ROI calculator,
 * and real-time lead & download telemetry alerting contact.stevedaniel@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_REPO = 'JanSteve/ARGUS';
    const FOUNDER_EMAIL = 'contact.stevedaniel@gmail.com';
    const RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
    const RELEASES_FALLBACK_URL = `https://github.com/${GITHUB_REPO}/releases`;

    // State for resolved assets
    const releaseState = {
        loaded: false,
        tagName: 'v0.2.4',
        macosUrl: 'https://github.com/JanSteve/ARGUS/releases/download/v0.2.4/ARGUS_0.1.0_aarch64.dmg',
        macosName: 'ARGUS_0.1.0_aarch64.dmg',
        windowsUrl: 'https://github.com/JanSteve/ARGUS/releases/download/v0.2.4/ARGUS_0.1.0_x64_en-US.msi',
        windowsName: 'ARGUS_Setup.msi',
    };

    // DOM Elements
    const macosButtons = document.querySelectorAll('[data-os="macos"]');
    const windowsButtons = document.querySelectorAll('[data-os="windows"]');
    const macosInfo = document.getElementById('macos-asset-info');
    const windowsInfo = document.getElementById('windows-asset-info');
    const heroVersionText = document.getElementById('hero-version-text');
    const toast = document.getElementById('download-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');

    // ─── 1. Real-Time Telemetry to Founder Gmail ───
    async function sendFounderTelemetry(eventName, details = {}) {
        try {
            const payload = {
                _subject: `[ARGUS LEAD ALERT] ${eventName} - ${new Date().toLocaleTimeString()}`,
                event: eventName,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || "Direct / Viral Traffic",
                landingPage: window.location.href,
                device: navigator.userAgent,
                screenResolution: `${window.innerWidth}x${window.innerHeight}`,
                locale: navigator.language,
                ...details,
            };

            fetch(`https://formsubmit.co/ajax/${FOUNDER_EMAIL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            }).catch(() => {});
        } catch (err) {
            // Silently continue without blocking user
        }
    }

    // Send initial page visit beacon
    sendFounderTelemetry("Website Page Visit");

    // ─── 2. Detect User OS ───
    function detectUserOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const platform = (window.navigator.platform || '').toLowerCase();
        
        let isMac = /mac|iphone|ipad|ipod/.test(userAgent) || /mac/.test(platform);
        let isWindows = /win/.test(userAgent) || /win/.test(platform);

        if (isMac) {
            document.getElementById('card-macos')?.classList.add('recommended');
            macosButtons.forEach(btn => btn.classList.add('btn-glow'));
        } else if (isWindows) {
            document.getElementById('card-windows')?.classList.add('recommended');
            windowsButtons.forEach(btn => btn.classList.add('btn-glow'));
        }
    }

    // ─── 3. Toast Notification Helper ───
    let toastTimeout;
    function showToast(title, desc) {
        if (!toast) return;
        toastTitle.textContent = title;
        toastDesc.textContent = desc;
        toast.classList.remove('hidden');
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 4000);
    }

    // ─── 4. Fetch Latest Release Assets from GitHub API ───
    async function resolveReleaseAssets() {
        try {
            const response = await fetch(RELEASES_API);
            if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
            
            const releases = await response.json();
            if (!Array.isArray(releases) || releases.length === 0) {
                fallbackToReleasesHub();
                return;
            }

            const latest = releases[0];
            releaseState.tagName = latest.tag_name || 'v0.2.4';
            if (heroVersionText) {
                heroVersionText.textContent = `ARGUS Sovereign OS ${releaseState.tagName}`;
            }

            for (const rel of releases) {
                if (rel.assets && rel.assets.length > 0) {
                    for (const asset of rel.assets) {
                        const name = asset.name.toLowerCase();
                        if (name.endsWith('.dmg') && !releaseState.macosUrl) {
                            releaseState.macosUrl = asset.browser_download_url;
                            releaseState.macosName = asset.name;
                        }
                        if ((name.endsWith('.exe') || name.endsWith('.msi')) && !releaseState.windowsUrl) {
                            releaseState.windowsUrl = asset.browser_download_url;
                            releaseState.windowsName = asset.name;
                        }
                    }
                }
            }

            if (releaseState.macosUrl) {
                macosButtons.forEach(btn => {
                    btn.href = releaseState.macosUrl;
                    btn.setAttribute('download', releaseState.macosName || 'ARGUS.dmg');
                });
                if (macosInfo) macosInfo.textContent = `Latest build: ${releaseState.macosName || releaseState.tagName}`;
            } else {
                macosButtons.forEach(btn => btn.href = RELEASES_FALLBACK_URL);
                if (macosInfo) macosInfo.textContent = `Release hub • ${releaseState.tagName}`;
            }

            if (releaseState.windowsUrl) {
                windowsButtons.forEach(btn => {
                    btn.href = releaseState.windowsUrl;
                    btn.setAttribute('download', releaseState.windowsName || 'ARGUS_Setup.exe');
                });
                if (windowsInfo) windowsInfo.textContent = `Latest build: ${releaseState.windowsName || releaseState.tagName}`;
            } else {
                windowsButtons.forEach(btn => btn.href = RELEASES_FALLBACK_URL);
                if (windowsInfo) windowsInfo.textContent = `Release hub • ${releaseState.tagName}`;
            }

            releaseState.loaded = true;
        } catch (err) {
            fallbackToReleasesHub();
        }
    }

    function fallbackToReleasesHub() {
        const macDirect = `https://github.com/${GITHUB_REPO}/releases/latest/download/ARGUS_0.1.0_aarch64.dmg`;
        const winDirect = `https://github.com/${GITHUB_REPO}/releases/latest/download/ARGUS_0.1.0_x64_en-US.msi`;
        macosButtons.forEach(btn => {
            btn.href = releaseState.macosUrl || macDirect;
        });
        windowsButtons.forEach(btn => {
            btn.href = releaseState.windowsUrl || winDirect;
        });
        if (macosInfo) macosInfo.textContent = 'Direct Installer (.dmg)';
        if (windowsInfo) windowsInfo.textContent = 'Direct Installer (.exe / .msi)';
    }

    // ─── 5. Download & Web OS Click Handlers ───
    function handleDownloadClick(e, osType) {
        const targetUrl = osType === 'macos' ? releaseState.macosUrl : releaseState.windowsUrl;
        const osLabel = osType === 'macos' ? 'macOS' : 'Windows';

        showToast('Download Started', `Downloading ARGUS Sovereign OS for ${osLabel}...`);
        
        // Notify founder
        sendFounderTelemetry(`Download Clicked: ${osLabel}`, {
            operatingSystem: osLabel,
            downloadUrl: targetUrl,
        });

        if (!targetUrl) {
            const direct = osType === 'macos'
                ? `https://github.com/${GITHUB_REPO}/releases/latest/download/ARGUS_0.1.0_aarch64.dmg`
                : `https://github.com/${GITHUB_REPO}/releases/latest/download/ARGUS_0.1.0_x64_en-US.msi`;
            window.location.href = direct;
            e.preventDefault();
        }
    }

    macosButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleDownloadClick(e, 'macos'));
    });

    windowsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleDownloadClick(e, 'windows'));
    });

    // Web OS Interactive Preview Click
    const webOsButtons = document.querySelectorAll('a[href*="/os/"]');
    webOsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sendFounderTelemetry("Web OS Interactive Session Launched");
        });
    });

    // SaaS Pro Upgrade Click
    const proButtons = document.querySelectorAll('.btn-buy-plan, a[href*="#pricing"]');
    proButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sendFounderTelemetry("Pro Upgrade Plan Clicked