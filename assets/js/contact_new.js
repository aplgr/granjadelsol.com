// Sprachabhängige FormGuard-Version mit Feldspezifischer Validierung
document.addEventListener('alpine:init', () => {
    // Mehrsprachige Meldungen
    const messages = {
        de: {
            missingName: "Bitte geben Sie Ihren Namen ein.",
            missingEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
            missingMsg: "Bitte schreiben Sie eine Nachricht.",
            tooFast: "Bitte nehmen Sie sich einen Moment Zeit, das Formular auszufüllen.",
            duplicate: "Diese Nachricht wurde bereits gesendet.",
            cooldown: "Bitte warten Sie einen Moment, bevor Sie erneut senden.",
            success: "Vielen Dank! Ihre Nachricht wurde gesendet.",
            error: "Senden fehlgeschlagen. Bitte versuchen Sie es später erneut.",
            honeypot: "Danke! Ihre Nachricht wurde gesendet.",
        },
        en: {
            missingName: "Please enter your name.",
            missingEmail: "Please enter a valid email address.",
            missingMsg: "Please write a message.",
            tooFast: "Please take a moment to complete the form.",
            duplicate: "Looks like you already sent this message.",
            cooldown: "Please wait a moment before sending again.",
            success: "Thanks! Your message has been sent.",
            error: "Sending failed. Please try again later.",
            honeypot: "Thanks! Your message has been sent.",
        },
        es: {
            missingName: "Por favor, ingrese su nombre.",
            missingEmail: "Por favor, ingrese un correo electrónico válido.",
            missingMsg: "Por favor, escriba un mensaje.",
            tooFast: "Tómese un momento para completar el formulario.",
            duplicate: "Parece que ya ha enviado este mensaje.",
            cooldown: "Espere un momento antes de enviar de nuevo.",
            success: "¡Gracias! Su mensaje ha sido enviado.",
            error: "Error al enviar. Inténtelo de nuevo más tarde.",
            honeypot: "¡Gracias! Su mensaje ha sido enviado.",
        },
        pt: {
            missingName: "Por favor, insira seu nome.",
            missingEmail: "Por favor, insira um e-mail válido.",
            missingMsg: "Por favor, escreva uma mensagem.",
            tooFast: "Reserve um momento para preencher o formulário.",
            duplicate: "Parece que você já enviou esta mensagem.",
            cooldown: "Aguarde um momento antes de enviar novamente.",
            success: "Obrigado! Sua mensagem foi enviada.",
            error: "Falha ao enviar. Tente novamente mais tarde.",
            honeypot: "Obrigado! Sua mensagem foi enviada.",
            sending: "Enviando mensagem…"
        }
  };

    // Sprache aus URL ermitteln, z.B. /de/, /en/, /es/, /pt/
    const lang = window.location.pathname.split("/")[1] || "de";
    const t = messages[lang] || messages["de"];

    // Alpine Store für Formularstatus
    Alpine.store('fg', { status: '' });

    // Alpine-Komponente formGuard
    Alpine.data('formGuard', () => ({
        minFillMs: 5000,
        cooldownMs: 60000,
        dupKey: 'contact:lastHash',
        cooldownKey: 'contact:lastTs',
        challenge: randomHex(16),
        start: Date.now(),

        init() { },

        configRequest(e) {
            if (e.target !== this.$el) return;
            e.detail.parameters._js_challenge = this.challenge;
            e.detail.parameters._elapsed_ms = String(Date.now() - this.start);
        },

        beforeRequest(e) {
            if (e.target !== this.$el) return;

            const fd = new FormData(this.$el);
            const hp = (fd.get('website') || '').trim();

            // Honeypot-Check (Spam)
            if (hp) {
                e.preventDefault();
                Alpine.store('fg').status = t.honeypot;
                this.$el.reset();
                this.resetGuards();
                return;
            }

            // Mindestzeit, um Bots zu erkennen
            if (Date.now() - this.start < this.minFillMs) {
                e.preventDefault();
                Alpine.store('fg').status = t.tooFast;
                return;
            }

            // Eingabewerte prüfen
            const name = (fd.get('name') || '').trim();
            const email = (fd.get('email') || '').trim();
            const msg = (fd.get('message') || '').trim();

            // Feldspezifische Fehlermeldungen
            if (!name) {
                e.preventDefault();
                Alpine.store('fg').status = t.missingName;
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                e.preventDefault();
                Alpine.store('fg').status = t.missingEmail;
                return;
            }
            if (!msg) {
                e.preventDefault();
                Alpine.store('fg').status = t.missingMsg;
                return;
            }

            // Cooldown prüfen (zu viele Anfragen)
            const lastTs = parseInt(localStorage.getItem(this.cooldownKey) || '0', 10);
            if (lastTs && Date.now() - lastTs < this.cooldownMs) {
                e.preventDefault();
                Alpine.store('fg').status = t.cooldown;
                return;
            }

            // Duplikate vermeiden
            const fp = hashStr(`${name}|${email}|${msg}`);
            const lastHash = sessionStorage.getItem(this.dupKey);
            if (lastHash && lastHash === fp) {
                e.preventDefault();
                Alpine.store('fg').status = t.duplicate;
                return;
            }

            sessionStorage.setItem(this.dupKey, fp);
            Alpine.store('fg').status = "Sending…";
        },

        afterRequest(e) {
            if (e.target !== this.$el) return;

            if (e.detail.successful) {
                localStorage.setItem(this.cooldownKey, String(Date.now()));
                Alpine.store('fg').status = t.success;
                this.$el.reset();
                this.resetGuards();
            } else {
                Alpine.store('fg').status = t.error;
            }
        },

        resetGuards() {
            this.start = Date.now();
            this.challenge = randomHex(16);
        },
    }));
});

// Zufalls-Token und Hashfunktionen (wie gehabt)
function randomHex(len) {
    const a = new Uint8Array(len);
    (crypto || window.crypto).getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}

function hashStr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return (h >>> 0).toString(36);
}
