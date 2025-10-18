(function () {

    const modal = document.getElementById('insight-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalGoto = document.getElementById('modal-goto');
    const cards = document.querySelectorAll('.frame--takeaways .card');

    const insightData = {
        geographic: {
            title: 'Diversify by Region',
            body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            target: '#frame-3'
        },
        chronological: {
            title: 'Time Rebalances After Recoveries',
            body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            target: '#frame-4'
        },
        sector: {
            title: 'Mix Cyclical and Defensive Sectors',
            body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            target: '#frame-6'
        }
    };

    let currentTarget = null;

    // open
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const insight = card.getAttribute('data-insight');
            const data = insightData[insight];

            if (data) {
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.body;
                currentTarget = data.target;
                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // close
    modalClose.addEventListener('click', () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        currentTarget = null;
    });

    // vis cta
    modalGoto.addEventListener('click', () => {
        if (currentTarget) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.querySelector(currentTarget).scrollIntoView({ behavior: 'smooth' });
            currentTarget = null;
        }
    });

    // additioanl close for off modal click for ui sake
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            currentTarget = null;
        }
    });
})();