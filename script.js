/**
 * ARGUS Sovereign OS — Next-Gen Marketing Portal Interactive Engine
 * Includes:
 * 1. Real-time British Voice Synthesis Tester
 * 2. Interactive Web Terminal Simulator
 * 3. Architecture Blueprint Tab Switcher
 * 4. Interactive ROI Calculator
 * 5. Founder Lead Telemetry Dispatches to contact.stevedaniel@gmail.com
 * 6. Dynamic GitHub Release Resolution & Direct Installers
 */

document.addEventListener('DOMContentLoaded', () => {
    const GITHUB_REPO = 'JanSteve/ARGUS';
    const FOUNDER_EMAIL_1 = 'stevedaniel2004@gmail.com';
    const FOUNDER_EMAIL_2 = 'contact.stevedaniel@gmail.com';
    const POSTHOG_TOKEN = 'phc_yqAcvHnuubp9kc57djzz5dRTpGzV7xprsbNfZh7LZFy3';
    const RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
    const RELEASES_FALLBACK_URL = `https://github.com/${GITHUB_REPO}/releases`;

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
    const toast = document.getElementById('download-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');

    // ─── 1. Real-Time Telemetry to Founder Gmail & PostHog ───
    async function sendFounderTelemetry(eventName, details = {}) {
        try {
            const payload = {
                _subject: `[ARGUS LIVE ALERT] ${eventName} - ${new Date().toLocaleTimeString()}`,
                event: eventName,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || "Direct / Viral Traffic",
                landingPage: window.location.href,
                device: navigator.userAgent,
                screenResolution: `${window.innerWidth}x${window.innerHeight}`,
                locale: navigator.language,
                ...details,
            };

            // 1. Dispatch to stevedaniel2004@gmail.com
            fetch(`https://formsubmit.co/ajax/${FOUNDER_EMAIL_1}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            }).catch(() => {});

            // 2. Dispatch to contact.stevedaniel@gmail.com
            fetch(`https://formsubmit.co/ajax/${FOUNDER_EMAIL_2}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            }).catch(() => {});

            // 3. Ingest into PostHog
            fetch('https://us.i.posthog.com/capture/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: POSTHOG_TOKEN,
                    event: eventName,
                    properties: { distinct_id: 'visitor_' + navigator.userAgent.slice(0, 20), ...payload }
                })
            }).catch(() => {});
        } catch (err) {
            // Silently continue
        }
    }

    sendFounderTelemetry("Website Page Visit");

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

    // ─── 3. Interactive British Voice Synthesizer ───
    let currentVoiceAudio = null;
    const btnTestVoice = document.getElementById('btn-test-voice');
    const btnStopVoice = document.getElementById('btn-stop-voice');
    const voiceSelect = document.getElementById('voice-phrase-select');
    const arcRing = document.querySelector('.arc-ring-pulse');

    function speakBritishVoice(text) {
        if (currentVoiceAudio) {
            currentVoiceAudio.pause();
            currentVoiceAudio.currentTime = 0;
            currentVoiceAudio = null;
        }

        if (arcRing) arcRing.style.borderStyle = 'solid';

        const clean = encodeURIComponent(text.slice(0, 300));
        const streamUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${clean}`;
        const audio = new Audio(streamUrl);
        currentVoiceAudio = audio;

        audio.onplay = () => {
            if (arcRing) arcRing.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.8)';
            if (btnTestVoice) btnTestVoice.textContent = '🔊 Synthesizing...';
        };

        audio.onended = () => {
            if (arcRing) {
                arcRing.style.borderStyle = 'dashed';
                arcRing.style.boxShadow = 'none';
            }
            if (btnTestVoice) btnTestVoice.textContent = '▶️ Play British Voice Sample';
            currentVoiceAudio = null;
        };

        audio.onerror = () => {
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.95;
                utterance.pitch = 0.95;
                window.speechSynthesis.speak(utterance);
            }
            if (btnTestVoice) btnTestVoice.textContent = '▶️ Play British Voice Sample';
        };

        audio.play().catch(() => {
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            }
            if (btnTestVoice) btnTestVoice.textContent = '▶️ Play British Voice Sample';
        });
    }

    if (btnTestVoice && voiceSelect) {
        btnTestVoice.addEventListener('click', () => {
            const phrase = voiceSelect.value;
            speakBritishVoice(phrase);
            sendFounderTelemetry("Homepage Voice Sample Played", { phrase });
        });
    }

    if (btnStopVoice) {
        btnStopVoice.addEventListener('click', () => {
            if (currentVoiceAudio) {
                currentVoiceAudio.pause();
                currentVoiceAudio = null;
            }
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (arcRing) {
                arcRing.style.borderStyle = 'dashed';
                arcRing.style.boxShadow = 'none';
            }
            if (btnTestVoice) btnTestVoice.textContent = '▶️ Play British Voice Sample';
        });
    }

    // ─── 4. Interactive Blueprint Gallery Tab Switcher ───
    const tabBtns = document.querySelectorAll('.tab-btn');
    const blueprintImg = document.getElementById('blueprint-main-img');
    const blueprintTitle = document.getElementById('blueprint-title');
    const blueprintDesc = document.getElementById('blueprint-desc');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const newSrc = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');

            if (blueprintImg) {
                blueprintImg.style.opacity = '0.3';
                setTimeout(() => {
                    blueprintImg.src = newSrc;
                    blueprintImg.style.opacity = '1';
                }, 150);
            }

            if (blueprintTitle) blueprintTitle.textContent = title;
            if (blueprintDesc) blueprintDesc.textContent = desc;

            sendFounderTelemetry("Blueprint Tab Viewed", { blueprint: title });
        });
    });

    // ─── 5. Interactive Web Terminal Simulator ───
    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');

    const TERMINAL_COMMANDS = {
        help: `Available commands:
  <span class="cyan">status</span>     - Check kernel, neural engine, & IPC latency
  <span class="cyan">neofetch</span>   - Display cybernetic system specifications
  <span class="cyan">margin</span>     - Display SaaS unit economics & $0 scale model
  <span class="cyan">specs</span>      - Hardware abstraction & memory consumption
  <span class="cyan">ai &lt;query&gt;</span>  - Stream AI response via local circuit breaker
  <span class="cyan">launch</span>     - Open full interactive Web OS session
  <span class="cyan">clear</span>      - Clear terminal screen`,
        status: `<span class="green">✓ KERNEL:</span> ARGUS Sovereign Core v0.2.4 (Active)
<span class="green">✓ PRIVACY:</span> 100% Offline Ollama Boundary (Zero Leak)
<span class="green">✓ VOICE:</span> Sub-50ms British Neural TTS (4-Tier Fallback)
<span class="cyan">⚡ IPC LATENCY:</span> 0.8ms (Rust Tauri Bridge)`,
        neofetch: `
      <span class="cyan">/\</span>          <span class="cyan">OS:</span> ARGUS Sovereign OS v0.2.4 x86_64 / arm64
     <span class="cyan">/  \</span>         <span class="cyan">Kernel:</span> Tauri 2 / Rust Core 1.85
    <span class="cyan">/ /\ \</span>        <span class="cyan">Uptime:</span> 99.99% Sovereign Edge
   <span class="cyan">/ ____ \</span>       <span class="cyan">Shell:</span> Argus-ZSH
  <span class="cyan">/_/    \_\</span>      <span class="cyan">Memory:</span> 48MB / 16384MB (85% lower than Electron)
                 <span class="cyan">AI Providers:</span> Ollama + Groq + Gemini + Pollinations`,
        margin: `<span class="yellow">ARGUS SAAS UNIT ECONOMICS:</span>
  • Serverless GPU Burn: $0.00 / user
  • Local Edge Compute (Ollama): 100% Owned by Client Hardware
  • Gross SaaS Profit Margin: <span class="green">97.4%</span>
  • Scalability: 100,000+ Concurrent Users at $0 Server Burn`,
        specs: `[ARGUS HAL ARCHITECTURE]
  • Language: Rust 2024 / TypeScript 5.8 / React 19
  • Packaging: macOS Universal DMG (26MB) / Windows MSI
  • Voice: British George Natural 96kHz 24-bit Stream`,
    };

    function appendTermLine(content) {
        if (!termOutput) return;
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = content;
        termOutput.appendChild(line);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCmd = termInput.value.trim();
                termInput.value = '';
                if (!rawCmd) return;

                appendTermLine(`<span class="cyan">argus@sovereign:~$</span> ${rawCmd}`);
                const lower = rawCmd.toLowerCase();

                if (lower === 'clear') {
                    termOutput.innerHTML = '';
                    return;
                }

                if (lower === 'launch') {
                    window.location.href = '/os/';
                    return;
                }

                if (lower.startsWith('ai ')) {
                    const prompt = rawCmd.slice(3).trim();
                    appendTermLine(`<span class="muted">🤖 Querying Sovereign Engine...</span>`);
                    setTimeout(() => {
                        appendTermLine(`<span class="green">ARGUS AI:</span> Sovereign intelligence confirms that "${prompt}" is processed with zero cloud leakage and sub-millisecond local routing.`);
                    }, 500);
                    return;
                }

                if (TERMINAL_COMMANDS[lower]) {
                    appendTermLine(TERMINAL_COMMANDS[lower]);
                } else {
                    appendTermLine(`<span class="yellow">Command not found: "${rawCmd}". Type <span class="cyan">help</span> for available commands.</span>`);
                }
            }
        });
    }

    // ─── 6. Interactive ROI Calculator ───
    const hoursSlider = document.getElementById('hours-slider');
    const sliderVal = document.getElementById('slider-val');
    const roiHoursSaved = document.getElementById('roi-hours-saved');
    const roiMoneySaved = document.getElementById('roi-money-saved');

    if (hoursSlider && sliderVal && roiHoursSaved && roiMoneySaved) {
        hoursSlider.addEventListener('input', (e) => {
            const hoursPerWeek = parseInt(e.target.value, 10);
            sliderVal.textContent = `${hoursPerWeek} hrs/week`;

            const monthlyHours = hoursPerWeek * 4;
            const monthlySavings = monthlyHours * 30;

            roiHoursSaved.textContent = `${monthlyHours} hrs`;
            roiMoneySaved.textContent = `$${monthlySavings.toLocaleString()}`;
        });
    }

    // ─── 7. Investor Contact Form ───
    const contactForm = document.getElementById('founder-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.textContent = '⚡ Dispatching to Founder...';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            sendFounderTelemetry("Direct Investor/Fellowship Inquiry Submitted", data);
            showToast("Inquiry Received!", "Thank you. Founder R Jan Steve Daniel will respond promptly to your email.");
            
            contactForm.reset();
            if (submitBtn) submitBtn.textContent = '✓ Sent to Founder';
            setTimeout(() => {
                if (submitBtn) submitBtn.textContent = 'Send Direct Inquiry to Founder ➔';
            }, 3000);
        });
    }

    // ─── 8. Download & Telemetry Handlers ───
    function handleDownloadClick(e, osType) {
        const targetUrl = osType === 'macos' ? releaseState.macosUrl : releaseState.windowsUrl;
        const osLabel = osType === 'macos' ? 'macOS' : 'Windows';

        showToast('Download Started', `Downloading ARGUS Sovereign OS for ${osLabel}...`);
        
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

    macosButtons.forEach(btn => btn.addEventListener('click', (e) => handleDownloadClick(e, 'macos')));
    windowsButtons.forEach(btn => btn.addEventListener('click', (e) => handleDownloadClick(e, 'windows')));

    const webOsLinks = document.querySelectorAll('a[href*="/os/"]');
    webOsLinks.forEach(link => {
        link.addEventListener('click', () => {
            sendFounderTelemetry("Web OS Interactive Link Clicked");
        });
    });

    // ─── 9. Intersection Observer Scroll Animations ───
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
