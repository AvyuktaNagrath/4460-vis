(function () {

    const modal = document.getElementById('insight-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalGoto = document.getElementById('modal-goto');
    const cards = document.querySelectorAll('.frame--takeaways .card');

    const insightData = {
        geographic: {
            title: 'Markets Lead GDP Recovery Globally',
            body: `
              <p>
                The global heatmap showed markets recovered first in 17 out of 19 countries. 
                Only India and Indonesia broke the pattern. South Africa had the most extreme 
                case with markets leading GDP recovery by 21 months.
              </p>
              <p>
                This is a structural pattern, not random variation. Markets price future expectations. 
                GDP measures current output. Recovery times varied by 18 months between countries, 
                but stock markets anticipated recovery on similar timelines regardless of geography.
              </p>
            `,
            target: '#frame-3'
        },
        chronological: {
            title: 'Market Cap Diverges from Economic Reality',
            body: `
              <p>
                The chronological chart tracked market cap as a percentage of GDP over 24 years. 
                This ratio spiked during bubbles and crashed during crises, 
                but always recovered faster than the underlying economy.
              </p>
              <p>
                After 2008, markets rebounded by 2010 while GDP lagged into 2011 and 2012. The same 
                pattern repeated in 2020. Markets lead because they price future earnings, not current conditions.
              </p>
            `,
            target: '#frame-4'
        },
        crisis: {
            title: 'Different Crises Hit Different Sectors',
            body: `
              <p>
                The crisis heatmap showed how each type of shock affects industries differently. 
                The 2008 financial crisis hammered financials and real estate while technology stayed 
                stable. The 2020 pandemic crushed travel and retail while healthcare and tech surged.
              </p>
              <p>
                The dot-com bubble destroyed tech valuations while traditional sectors barely noticed. 
                No single sector provides universal protection, and the type of crisis determines which 
                industries suffer and which survive.
              </p>
            `,
            target: '#frame-5'
        },
        sector: {
            title: 'Market Value Does Not Match Economic Output',
            body: `
              <p>
                The sector tree maps exposed a major disconnect: technology and financials dominate 
                market cap despite representing only modest shares of GDP. On the other hand, manufacturing, 
                retail, and construction drive significant economic output but barely move the market.
              </p>
              <p>
                The market structure does not reflect economic structure. 
                Following market cap indices overweights a portfolio in sectors that crash hardest 
                during tech bubbles or financial crises, while underweighing in sectors that employ 
                millions and produce real goods.
              </p>
            `,
            target: '#frame-6'
        }
    };

    let currentTarget = null;

    // back to takeaways button
    const backButton = document.createElement('button');
    backButton.className = 'back-to-takeaways';
    backButton.innerHTML = '← Back to Takeaways';
    backButton.style.display = 'none';
    document.body.appendChild(backButton);
    backButton.addEventListener('click', () => {
        backButton.style.display = 'none';
        document.querySelector('#frame-7').scrollIntoView({ behavior: 'smooth' });
    });
    // scrolling messes stuff up, so we only hide it when we go back to takeaways
    window.addEventListener('frameEnter', (e) => {
        if (e.detail.id === 'frame-7') {
            backButton.style.display = 'none';
        }
    });

    // open modal
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

    // close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        currentTarget = null;
    });

    // go to vis
    modalGoto.addEventListener('click', () => {
        if (currentTarget) {
            backButton.style.display = 'block';
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.querySelector(currentTarget).scrollIntoView({ behavior: 'smooth' });
            currentTarget = null;
        }
    });

    // close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            currentTarget = null;
        }
    });
})();