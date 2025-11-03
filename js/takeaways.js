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
            body: `
              <p>
                Recovery times vary greatly across regions. Developed economies like the U.S.
                and Canada rebounded within months, while emerging markets took years to return
                to pre-crisis output. 
              </p>
              <p>
                Diversifying across regions smooths volatility — markets in Asia or Europe may
                lag or lead North America depending on crisis type and monetary policy timing.
              </p>
            `,
            target: '#frame-3'
        },
        chronological: {
            title: 'Time Rebalances After Recoveries',
            body: `
              <p>
                Financial markets typically recover before real economic activity does.
                After every major downturn — the Dot-com Bust, the Great Recession, and COVID-19 —
                equity indices surged months before GDP growth turned positive.
              </p>
              <p>
                This lead-lag dynamic shows that markets price in future expectations rather
                than current performance. Recognizing this helps investors avoid overreacting
                to short-term shocks.
              </p>
            `,
            target: '#frame-4'
        },

        sector: {
            title: 'Mix Cyclical and Defensive Sectors',
            body: `
              <p>
                Sectoral imbalances widen during crises. Manufacturing and construction tend
                to contract sharply, while finance, healthcare, and information services stay
                resilient or recover faster.
              </p>
              <p>
                A portfolio combining cyclical (tech, industrials) and defensive (healthcare,
                utilities) sectors balances growth potential with stability across market cycles.
              </p>
            `,
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