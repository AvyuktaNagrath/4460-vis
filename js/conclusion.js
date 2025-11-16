const conclusionWrap = d3.select("#frame-8 .conclusion-wrap");

conclusionWrap.append("h2")
    .attr("id", "f8-title")
    .text("Three Rules for Smarter Investing");

conclusionWrap.append("p")
    .attr("class", "conclusion-intro")
    .text("Markets and economies move on different timelines. Build a portfolio that accounts for both.");

const strategiesGrid = conclusionWrap.append("div")
    .attr("class", "strategies-grid");

// first
const strategy1 = strategiesGrid.append("div")
    .attr("class", "strategy-card");

strategy1.append("div")
    .attr("class", "strategy-number")
    .text("1");

strategy1.append("h4")
    .text("Diversify by Geography");

strategy1.append("p")
    .text("Recovery times vary wildly by region. Developed markets recovered in 8-12 months while emerging markets took 20+ months. But stock markets anticipated recovery on similar timelines regardless of location.");

strategy1.append("p")
    .attr("class", "strategy-detail")
    .text("Different regions face different crises at different times. When the US faces a financial crisis, Asian markets may stay stable. When Europe struggles, Latin America may thrive.");

strategy1.append("p")
    .attr("class", "strategy-action")
    .text("Hold positions across all of the world's regions. Geographic diversification smooths volatility as different regions cycle through their own recovery patterns.");

// seciond
const strategy2 = strategiesGrid.append("div")
    .attr("class", "strategy-card");

strategy2.append("div")
    .attr("class", "strategy-number")
    .text("2");

strategy2.append("h4")
    .text("Time Your Rebalancing");

strategy2.append("p")
    .text("Markets consistently recover 6-18 months before GDP does. This pattern repeated across 24 years and multiple crises in the chronological data.");

strategy2.append("p")
    .attr("class", "strategy-detail")
    .text("Market cap as a percentage of GDP spikes during bubbles and crashes during downturns, but always rebounds faster than the real economy. Investors price in future recovery before unemployment drops or GDP growth returns.");

strategy2.append("p")
    .attr("class", "strategy-action")
    .text("Buy during crashes when markets tank. Don't wait for economic data to confirm the recovery. Set quarterly rebalancing reminders during downturns instead of waiting for good news.");

// third
const strategy3 = strategiesGrid.append("div")
    .attr("class", "strategy-card");

strategy3.append("div")
    .attr("class", "strategy-number")
    .text("3");

strategy3.append("h4")
    .text("Balance Sectors for Crisis Protection");

strategy3.append("p")
    .text("Different crises destroy different sectors. The 2008 financial crisis crushed banks and real estate. The 2020 pandemic destroyed travel and retail. The dot-com bubble wiped out tech.");

strategy3.append("p")
    .attr("class", "strategy-detail")
    .text("Tech dominates market cap despite representing a smaller part of GDP. Manufacturing drives GDP but barely moves the S&P 500. Market concentration in growth sectors creates risk when those specific sectors crash.");

strategy3.append("p")
    .attr("class", "strategy-action")
    .text("Mix high-growth sectors with defensive positions that track real economic output. Healthcare, utilities, and consumer staples provide stability across crisis types while tech and financials drive returns in bull markets.");




conclusionWrap.append("p")
    .attr("class", "conclusion-final")
    .text("The market prices the future. The economy reports the present. Invest accordingly.");