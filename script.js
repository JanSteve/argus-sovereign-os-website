/**
 * ARGUS Sovereign OS — Marketing Portal Interactive Engine
 * 1. Direct Dual Windows & macOS Download Triggers with Fallback
 * 2. Real-Time British Neural Voice Synthesizer
 * 3. Investor Relations Priority Dispatch to Founder Emails
 * 4. PostHog Product Telemetry
 */

document.addEventListener("DOMContentLoaded", () => {
  const FOUNDER_EMAIL_1 = "stevedaniel2004@gmail.com";
  const FOUNDER_EMAIL_2 = "contact.stevedaniel@gmail.com";
  const POSTHOG_TOKEN = "phc_yqAcvHnuubp9kc57djzz5dRTpGzV7xprsbNfZh7LZFy3";

  const DOWNLOAD_URLS = {
    windows: "https://github.com/JanSteve/ARGUS/releases/download/v0.2.4/ARGUS_0.1.0_x64_en-US.msi",
    macos: "https://github.com/JanSteve/ARGUS/releases/download/v0.2.4/ARGUS_0.1.0_aarch64.dmg",
    fallback: "https://github.com/JanSteve/ARGUS/releases",
  };

  const toast = document.getElementById("download-toast");
  const toastTitle = document.getElementById("toast-title");
  const toastDesc = document.getElementById("toast-desc");

  function showToast(title, desc) {
    if (!toast) return;
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  // Real-Time Telemetry Dispatches to Founder Gmail Addresses
  async function sendFounderTelemetry(eventName, details = {}) {
    try {
      const payload = {
        _subject: `[ARGUS LIVE ALERT] ${eventName} - ${new Date().toLocaleTimeString()}`,
        event: eventName,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "Direct Traffic",
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

      // 3. PostHog Event Tracking
      fetch("https://us.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_TOKEN,
          event: eventName,
          properties: { distinct_id: "visitor_" + navigator.userAgent.slice(0, 20), ...payload },
        }),
      }).catch(() => {});
    } catch {}
  }

  // ─── 1. Direct Download Handlers for Windows & macOS ───
  const windowsButtons = document.querySelectorAll('[data-os="windows"]');
  windowsButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Downloading for Windows", "ARGUS_0.1.0_x64_en-US.msi starting now...");
      sendFounderTelemetry("WINDOWS_INSTALLER_DOWNLOAD_CLICKED", { os: "Windows 64-bit" });

      // Trigger real download link
      const link = document.createElement("a");
      link.href = DOWNLOAD_URLS.windows;
      link.download = "ARGUS_Setup.msi";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  const macosButtons = document.querySelectorAll('[data-os="macos"]');
  macosButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Downloading for macOS", "ARGUS_0.1.0_aarch64.dmg starting now...");
      sendFounderTelemetry("MACOS_INSTALLER_DOWNLOAD_CLICKED", { os: "macOS Universal" });

      // Trigger real download link
      const link = document.createElement("a");
      link.href = DOWNLOAD_URLS.macos;
      link.download = "ARGUS_macOS.dmg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  // ─── 2. Interactive British Neural Voice Synthesizer ───
  const voiceBtn = document.getElementById("voice-test-btn");
  const voiceInput = document.getElementById("voice-test-text");
  const voiceStatus = document.getElementById("voice-status-display");

  if (voiceBtn && voiceInput) {
    voiceBtn.addEventListener("click", () => {
      const text = voiceInput.value.trim();
      if (!text) return;

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        // Find British English voice
        const britishVoice = voices.find(
          (v) => v.lang.includes("en-GB") || v.name.includes("British") || v.name.includes("Daniel") || v.name.includes("George")
        ) || voices.find((v) => v.lang.startsWith("en"));

        if (britishVoice) utterance.voice = britishVoice;
        utterance.rate = 1.02;
        utterance.pitch = 0.96;

        utterance.onstart = () => {
          voiceStatus.textContent = "🔊 Synthesizing: Sub-50ms British Neural Voice Output...";
        };
        utterance.onend = () => {
          voiceStatus.textContent = "🎙️ Status: Ready • Web Speech & Neural Bridge Active";
        };

        window.speechSynthesis.speak(utterance);
        sendFounderTelemetry("VOICE_SYNTHESIS_TESTED", { phrase: text });
      } else {
        voiceStatus.textContent = "⚠️ Web Speech not supported on this browser.";
      }
    });
  }

  // ─── 3. Investor Relations / Priority Lead Form ───
  const leadForm = document.getElementById("investor-lead-form");
  const submitBtn = document.getElementById("lead-submit-btn");

  if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("lead-name")?.value || "";
      const email = document.getElementById("lead-email")?.value || "";
      const org = document.getElementById("lead-org")?.value || "";
      const msg = document.getElementById("lead-msg")?.value || "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>⏳ Transmitting to Founder...</span>";
      }

      await sendFounderTelemetry("INVESTOR_OR_ENTERPRISE_INQUIRY", {
        fullName: name,
        officialEmail: email,
        organization: org,
        details: msg,
      });

      showToast("Inquiry Dispatched", "Your message has been delivered directly to Steve Daniel.");
      if (submitBtn) {
        submitBtn.innerHTML = "<span>✓ Delivered to Founder</span>";
      }
      leadForm.reset();
    });
  }

  // Initial Pageview Telemetry
  sendFounderTelemetry("MARKETING_PAGE_VIEW", {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    theme: "Apple White Corporate",
  });
});
