document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_REPO = 'JanSteve/ARGUS';
    const RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
    const RELEASES_FALLBACK_URL = `https://github.com/${GITHUB_REPO}/releases`;

    // State for resolved assets
    const releaseState = {
        loaded: false,
        tagName: 'v0.2.4',
        macosUrl: '/downloads/ARGUS_macOS.dmg',
        macosName: 'ARGUS_macOS.dmg',
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

    // ─── 1. Detect User OS ───
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

    // ─── 2. Toast Notification Helper ───
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

    // ─── 3. Fetch Latest Release Assets from GitHub API ───
    async function resolveReleaseAssets() {
        try {
            const response = await fetch(RELEASES_API);
            if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
            
            const releases = await response.json();
            if (!Array.isArray(releases) || releases.length === 0) {
                fallbackToReleasesHub();
                return;
            }

            // Find latest release or first release with assets
            const latest = releases[0];
            releaseState.tagName = latest.tag_name || 'v0.2.3';
            if (heroVersionText) {
                heroVersionText.textContent = `ARGUS Sovereign OS ${releaseState.tagName}`;
            }

            // Search through releases for DMG, EXE, MSI assets
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

            // Update macOS buttons
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

            // Update Windows buttons
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
            console.warn('Could not fetch releases dynamically from GitHub API:', err);
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

    // ─── 4. Download Button Click Interceptor ───
    function handleDownloadClick(e, osType) {
        const targetUrl = osType === 'macos' ? releaseState.macosUrl : releaseState.windowsUrl;
        const osLabel = osType === 'macos' ? 'macOS' : 'Windows';

        showToast('Download Started', `Downloading ARGUS Sovereign OS for ${osLabel}...`);
        if (!targetUrl) {
            // Fallback direct link
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

    // ─── 5. Mobile Menu Toggle ───
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isVisible = navLinks.classList.contains('mobile-open');
            if (isVisible) {
                navLinks.classList.remove('mobile-open');
            } else {
                navLinks.classList.add('mobile-open');
            }
        });
    }

    // ─── 6. Intersection Observer for Scroll Animations ───
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // ─── 7. Active Navigation Link Highlighting ───
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

    // ─── 8. Interactive ROI Calculator Logic ───
    const hoursSlider = document.getElementById('hours-slider');
    const sliderVal = document.getElementById('slider-val');
    const roiHoursSaved = document.getElementById('roi-hours-saved');
    const roiMoneySaved = document.getElementById('roi-money-saved');

    if (hoursSlider && sliderVal && roiHoursSaved && roiMoneySaved) {
        hoursSlider.addEventListener('input', (e) => {
            const hoursPerWeek = parseInt(e.target.value, 10);
            sliderVal.textContent = `${hoursPerWeek} hrs/week`;

            const monthlyHours = hoursPerWeek * 4;
            const monthlySavings = monthlyHours * 30; // $30/hr engineer value baseline

            roiHoursSaved.textContent = `${monthlyHours} hrs`;
            roiMoneySaved.textContent = `$${monthlySavings.toLocaleString()}`;
        });
    }

    // Initialize
    detectUserOS();
    resolveReleaseAssets();
});
