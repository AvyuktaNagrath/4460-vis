const introWrap = d3.select("#frame-1 .intro-wrap");
introWrap.html("");

// text writing paragraph
const introText = introWrap.append("div")
    .attr("class", "intro-text");

introText.append("h2")
    .attr("id", "f1-title")
    .text("Does the Market Reflect the Economy?");
introText.append("p")
    .attr("class", "intro-paragraph")
    .html("More people are asking this question than ever before because the share of people investing is now" +
        " 5 times higher than in 2015, with 37% of 25-year-olds holding investment accounts compared to just 6%" +
        " a decade ago (JP Morgan Chase Institute, 2025).");
introText.append("p")
    .attr("class", "intro-paragraph")
    .html("But most people don't actually know the answer. The average investor underperforms their own investments by 1% every year compared to the market" +
        ", losing 15% of potential returns over a decade due to poor timing, bad strategy, and failed diversification (LEO Wealth, 2025).");
introText.append("p")
    .attr("class", "intro-paragraph")
    .html("The problem is that investors treat markets as if they mirror the economy. They wait for GDP growth or unemployment data to confirm recovery." +
        " They chase sectors that already rallied. They panic when economic news turns bad. By the time the economy recovers," +
        " markets have already moved, and the ship has sailed to profit hugely.");

// solution CTA
const solutionBox = introText.append("div")
    .attr("class", "intro-solution-box");
solutionBox.append("p")
    .attr("class", "intro-solution-text")
    .html("To answer this question, we visualized the relationship between markets and economies across <strong>geography</strong>, <strong>time</strong>, <strong>crises</strong> and <strong>sectors</strong>." +
        " The visualizations' insights show when markets diverge from reality and how to craft a profitable investment strategy with this in mind.");

//highlighted stats
const statCards = introWrap.append("div")
    .attr("class", "intro-stats");
const stats = [
    {
        number: "5x",
        label: "More retail investors than 2015",
        source: "JP Morgan Chase Institute",
        link: "https://www.jpmorganchase.com/institute/all-topics/financial-health-wealth-creation/a-decade-in-the-market-how-retail-investing-behavior-has-shifted-since-2015"
    },
    {
        number: "1%",
        label: "Annual retail investor underperformance",
        source: "LEO Wealth",
        link: "https://leowealth.com/insights/mind-the-gap-why-retail-investors-often-underperform-their-investments/"
    },
    {
        number: "15%",
        label: "Compounded lost returns over 10 years",
        source: "LEO Wealth",
        link: "https://leowealth.com/insights/mind-the-gap-why-retail-investors-often-underperform-their-investments/"
    }
];

stats.forEach(stat => {
    const card = statCards.append("div")
        .attr("class", "stat-card");

    card.append("div")
        .attr("class", "stat-number")
        .text(stat.number);

    card.append("div")
        .attr("class", "stat-label")
        .text(stat.label);

    card.append("a")
        .attr("class", "stat-source")
        .attr("href", stat.link)
        .attr("target", "_blank")
        .attr("rel", "noopener noreferrer")
        .text(stat.source);
});