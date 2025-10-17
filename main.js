// main.js

(function () {

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

    // frame reveal
    const frames = $$('.frame');
    const hookVisFixed = $('.hook-vis-fixed');

    const frameObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('is-entered');
                emit('frameEnter', { id: e.target.id });

                // Show hook vis when frame-2 enters
                if (e.target.id === 'frame-2' && hookVisFixed) {
                    hookVisFixed.classList.add('is-visible');
                }
            } else {
                emit('frameExit', { id: e.target.id });

                // Hide hook vis when frame-2 exits
                if (e.target.id === 'frame-2' && hookVisFixed) {
                    hookVisFixed.classList.remove('is-visible');
                }
            }
        });
    }, { threshold: 0.2 });
    frames.forEach((f) => frameObserver.observe(f));

    // step activation
    const steps = $$('.step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            const active = e.isIntersecting;
            e.target.classList.toggle('is-active', active);
            if (active) {
                const frame = e.target.closest('.frame');
                const stepId = e.target.getAttribute('data-step') || null;
                emit('frameStep', { frameId: frame?.id || null, step: stepId });
            }
        });
    }, { rootMargin: '-30% 0px -50% 0px', threshold: 0.01 });
    steps.forEach((s) => stepObserver.observe(s));

    // keyboard quick reset for demo placeholders
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') { return; }
        $$('#main svg .placeholder, .vis-svg .placeholder').forEach((t) => { t.textContent = t.textContent; });
    });

})();