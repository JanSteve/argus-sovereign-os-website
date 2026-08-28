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
    const FOUNDER_EMAIL = 'contact.stevedaniel@gmail.com';
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
  • Local Edge Compute (Ollama): 100% Owned by 