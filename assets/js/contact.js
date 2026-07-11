// Central Alpine + HTMX contact form controller.
(function () {
    const messages={
        de: {
            sending: 'Nachricht wird gesendet …',
            success: 'Vielen Dank! Wir melden uns schnellstmöglich zurück.',
            invalid: 'Bitte prüfen Sie die Pflichtfelder Name, E-Mail-Adresse und Nachricht.',
            tooFast: 'Bitte nehmen Sie sich einen Moment Zeit, um das Formular auszufüllen.',
            cooldown: 'Bitte warten Sie einen Moment, bevor Sie erneut eine Nachricht senden.',
            duplicate: 'Diese Nachricht wurde bereits gesendet.',
            networkError: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.',
            generalError: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
        },
        en: {
            sending: 'Sending message …',
            success: 'Thank you! We will get back to you as soon as possible.',
            invalid: 'Please check the required fields Name, Email Address, and Message.',
            tooFast: 'Please take a moment to complete the form.',
            cooldown: 'Please wait a moment before sending another message.',
            duplicate: 'This message has already been sent.',
            networkError: 'Network error. Please try again later.',
            generalError: 'The message could not be sent. Please try again.',
        },
        es: {
            sending: 'Enviando mensaje …',
            success: '¡Muchas gracias! Nos pondremos en contacto lo antes posible.',
            invalid: 'Por favor, revise los campos obligatorios Nombre, correo electrónico y mensaje.',
            tooFast: 'Tómese un momento para completar el formulario.',
            cooldown: 'Espere un momento antes de enviar otro mensaje.',
            duplicate: 'Este mensaje ya ha sido enviado.',
            networkError: 'Error de red. Inténtelo de nuevo más tarde.',
            generalError: 'No se pudo enviar el mensaje. Inténtelo de nuevo.',
        },
        pt: {
            sending: 'Enviando mensagem …',
            success: 'Muito obrigado! Entraremos em contato o mais breve possível.',
            invalid: 'Verifique os campos obrigatórios Nome, endereço de e-mail e mensagem.',
            tooFast: 'Reserve um momento para preencher o formulário.',
            cooldown: 'Aguarde um momento antes de enviar outra mensagem.',
            duplicate: 'Esta mensagem já foi enviada.',
            networkError: 'Erro de rede. Tente novamente mais tarde.',
            generalError: 'Não foi possível enviar a mensagem. Tente novamente.',
        },
    };

    document.addEventListener('alpine:init', () => {
        Alpine.store('fg', { status: '', state: '' });

        Alpine.data('formGuard', () => ({
            minFillMs: 5000,
            cooldownMs: 60000,
            dupKey: 'contact:lastSentHash',
            cooldownKey: 'contact:lastSuccessTs',
            challenge: randomHex(16),
            start: Date.now(),
            isSubmitting: false,
            pendingHash: '',
            t: getMessages(),

            init() {
                this.setMessage('', '');
            },

            configRequest(e) {
                if(e.target!==this.$el) return;

                const payload=this.getPayload();
                const params=e.detail.parameters||(e.detail.parameters={});

                params.name=payload.name;
                params.email=payload.email;
                params.subject=payload.subject||document.title;
                params.message=payload.message;
                params.foundby=payload.foundby;
                params.website=payload.website;
                params._js_challenge=this.challenge;
                params._elapsed_ms=String(Math.max(1, Date.now()-this.start));
            },

            beforeRequest(e) {
                if(e.target!==this.$el) return;

                if(this.isSubmitting) {
                    e.preventDefault();
                    this.setStatus('sending', 'sending');
                    return;
                }

                const payload=this.getPayload();

                if(payload.website) {
                    e.preventDefault();
                    this.setStatus('success', 'success');
                    this.$el.reset();
                    this.resetGuards();
                    return;
                }

                if(Date.now()-this.start<this.minFillMs) {
                    e.preventDefault();
                    this.setStatus('tooFast', 'too-fast');
                    return;
                }

                if(!payload.name||!payload.message||!isValidEmail(payload.email)) {
                    e.preventDefault();
                    this.setStatus('invalid', 'invalid');
                    return;
                }

                const messageHash=hashStr([
                    payload.name,
                    payload.email,
                    payload.subject,
                    payload.message,
                ].join('|'));

                if(storageGet('sessionStorage', this.dupKey)===messageHash) {
                    e.preventDefault();
                    this.setStatus('duplicate', 'duplicate');
                    return;
                }

                const lastSuccess=parseInt(storageGet('localStorage', this.cooldownKey)||'0', 10);
                if(lastSuccess&&Date.now()-lastSuccess<this.cooldownMs) {
                    e.preventDefault();
                    this.setStatus('cooldown', 'cooldown');
                    return;
                }

                this.pendingHash=messageHash;
                this.isSubmitting=true;
                this.setStatus('sending', 'sending');
            },

            afterRequest(e) {
                if(e.target!==this.$el) return;

                const xhr=e.detail.xhr;
                const status=xhr? xhr.status||0:0;

                if(!xhr||status===0) {
                    this.finishFailedRequest();
                    return;
                }

                const responseJson=parseJson(getResponseText(xhr));
                const wasSent=status>=200
                    &&status<300
                    &&responseJson
                    &&responseJson.ok===true;

                if(wasSent) {
                    storageSet('sessionStorage', this.dupKey, this.pendingHash);
                    storageSet('localStorage', this.cooldownKey, String(Date.now()));
                    this.pendingHash='';
                    this.isSubmitting=false;
                    this.setStatus('success', 'success');
                    this.$el.reset();
                    this.resetGuards();
                    return;
                }

                const serverError=responseJson&&typeof responseJson.error==='string'
                    ? responseJson.error.trim()
                    :'';

                this.finishFailedRequest();
                this.setMessage(serverError||this.t.generalError, 'error');
            },

            networkError(e) {
                if(e.target!==this.$el) return;

                this.finishFailedRequest();
                this.setStatus('networkError', 'network-error');
            },

            clearStatus() {
                if(Alpine.store('fg').state!=='sending') {
                    this.setMessage('', '');
                }
            },

            finishFailedRequest() {
                this.pendingHash='';
                this.isSubmitting=false;
                this.challenge=randomHex(16);
            },

            resetGuards() {
                this.start=Date.now();
                this.challenge=randomHex(16);
            },

            getPayload() {
                const fd=new FormData(this.$el);

                return {
                    name: trim(fd.get('name')),
                    email: trim(fd.get('email')),
                    subject: trim(fd.get('subject')),
                    message: trim(fd.get('message')),
                    foundby: trim(fd.get('foundby')),
                    website: trim(fd.get('website')),
                };
            },

            setStatus(key, state) {
                this.setMessage(this.t[key]||'', state);
            },

            setMessage(message, state) {
                const store=Alpine.store('fg');
                store.status=message;
                store.state=state;
            },
        }));
    });

    function getMessages() {
        const lang=(document.documentElement.lang||'de').toLowerCase().split('-')[0];
        return messages[lang]||messages.de;
    }

    function trim(value) {
        return (value==null? '':String(value)).trim();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function parseJson(text) {
        if(!text) return null;
        try {
            return JSON.parse(text);
        } catch(_) {
            return null;
        }
    }

    function getResponseText(xhr) {
        try {
            return xhr.responseText||'';
        } catch(_) {
            return '';
        }
    }

    function getStorage(type) {
        try {
            return window[type]||null;
        } catch(_) {
            return null;
        }
    }

    function storageGet(type, key) {
        const storage=getStorage(type);
        if(!storage) return null;

        try {
            return storage.getItem(key);
        } catch(_) {
            return null;
        }
    }

    function storageSet(type, key, value) {
        const storage=getStorage(type);
        if(!storage||!value) return;

        try {
            storage.setItem(key, value);
        } catch(_) { }
    }

    function randomHex(len) {
        const bytes=new Uint8Array(len);
        const cryptoApi=window.crypto||window.msCrypto;

        if(cryptoApi&&cryptoApi.getRandomValues) {
            cryptoApi.getRandomValues(bytes);
        } else {
            for(let i=0; i<bytes.length; i+=1) {
                bytes[i]=Math.floor(Math.random()*256);
            }
        }

        return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }

    function hashStr(value) {
        let hash=5381;

        for(let i=0; i<value.length; i+=1) {
            hash=((hash<<5)+hash)^value.charCodeAt(i);
        }

        return (hash>>>0).toString(36);
    }
}());
