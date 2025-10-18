(function () {

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

    // frame reveals
    const frames = $$('.frame');
    const hookVisFixed = $('.hook-vis-fixed');
    const hookScrollHint = $('.hook-scroll-hint');

    const frameObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('is-entered');
                emit('frameEnter', { id: e.target.id });

                // for frame 2 stickiness specifically
                if (e.target.id === 'frame-2') {
                    if (hookVisFixed) hookVisFixed.classList.add('is-visible');
                    if (hookScrollHint) hookScrollHint.classList.add('is-visible');
                }
            } else {
                emit('frameExit', { id: e.target.id });

                // respesictve hide
                if (e.target.id === 'frame-2') {
                    if (hookVisFixed) hookVisFixed.classList.remove('is-visible');
                    if (hookScrollHint) hookScrollHint.classList.remove('is-visible');
                }
            }
        });
    }, { threshold: 0.2 });
    frames.forEach((f) => frameObserver.observe(f));

    // steps inside frames
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
    }, { threshold: 0.5 });
    steps.forEach((s) => stepObserver.observe(s));
})();