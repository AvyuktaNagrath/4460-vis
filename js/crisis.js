(function () {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function drawHeatmap(heatmapData) {
        const svg = d3.select("#vis-kz2");
        const plotArea = svg.select(".plot-area");

        svg.select(".placeholder").remove();

        const viewBox = svg.attr("viewBox").split(" ").map(Number);

        const margin = {top: 80, right: 25, bottom: 10, left: 200};

        const width = viewBox[2] - margin.left - margin.right;
        const height = viewBox[3] - margin.top - margin.bottom;

        plotArea.attr("transform", `translate(${margin.left}, ${margin.top})`);

        const industries = [...new Set(heatmapData.map(d => d.Industry))];
        const years = [...new Set(heatmapData.map(d => d.Year))];

        const x = d3.scaleBand().range([0, width]).domain(years).padding(0.05);
        const y = d3.scaleBand().range([height, 0]).domain(industries).padding(0.05);

        const maxAbsValue = d3.max(heatmapData, d => Math.abs(d.PercentChange));
        const myColor = d3.scaleDiverging()
            .domain([-maxAbsValue, 0, maxAbsValue])
            .interpolator(d3.interpolateRdYlGn);

        plotArea.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, -10)`)
            .call(d3.axisTop(x).tickSize(0))
            .select(".domain").remove();

        plotArea.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove();

        const tooltip = d3.select("#tooltip");

        const mouseover = (event, d) => {
            tooltip.style("opacity", 1);
            d3.select(event.currentTarget).style("stroke", "#2d3748").style("stroke-width", 2);
        };
        const mousemove = (event, d) => {
            tooltip
                .html(`<h3>${d.Crisis}</h3>
                       <span class="type">Sector: ${d.Industry} (${d.Year})</span>
                       <p>Change: ${d.PercentChange.toFixed(1)}%</p>`)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 10) + "px");
        };
        const mouseleave = (event, d) => {
            tooltip.style("opacity", 0);
            d3.select(event.currentTarget).style("stroke", "none");
        };

        const crisisLabels = [
            { year: "2001", crisis: "Dot-com Bust" },
            { year: "2008", crisis: "Great Recession" },
            { year: "2020", crisis: "COVID-19" },
            { year: "2022", crisis: "Inflation Shock" }
        ];

        plotArea.selectAll(".crisis-label")
            .data(crisisLabels)
            .enter()
            .append("text")
            .attr("class", "crisis-label")
            .attr("x", d => x(d.year) + (d.crisis === "Great Recession" ? x.bandwidth() * 1.5 : x.bandwidth() / 2))
            .attr("y", -45)
            .style("text-anchor", "middle")
            .text(d => d.crisis);

        plotArea.selectAll(".cell")
            .data(heatmapData, d => d.Year + ':' + d.Industry)
            .join("rect")
            .attr("class", "cell")
            .attr("x", d => x(d.Year))
            .attr("y", d => y(d.Industry))
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => myColor(d.PercentChange))
            .attr("data-year", d => d.Year)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        plotArea.selectAll(".cell-label")
            .data(heatmapData)
            .enter()
            .append("text")
            .attr("class", "cell-label")
            .attr("x", d => x(d.Year) + x.bandwidth() / 2)
            .attr("y", d => y(d.Industry) + y.bandwidth() / 2)
            .attr("dy", ".35em")
            .style("fill", d => Math.abs(d.PercentChange) > 15 ? "white" : "#2d3748")
            .text(d => d.PercentChange.toFixed(1) + "%")
            .attr("data-year", d => d.Year);

        const legendContainer = d3.select("#frame-5 .info-card");

        const legendDiv = legendContainer.append("div")
            .attr("class", "legend-container")
            .style("margin-top", "1rem");

        legendDiv.append("div")
            .attr("class", "legend-title")
            .text("% Change in Real Gross Output");

        const legendSvg = legendDiv.append("svg")
            .attr("id", "kz2-legend")
            .attr("width", "10H0%")
            .attr("height", 20)
            .style("display", "block")
            .style("margin-top", "4px");

        const defs = legendSvg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", "kz2-linear-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%");

        linearGradient.selectAll("stop")
            .data(myColor.ticks().map((t, i, n) => ({ offset: `${100 * i / (n.length - 1)}%`, color: myColor(t) })))
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        legendSvg.append("rect")
            .attr("width", "100%")
            .attr("height", 20)
            .style("fill", "url(#kz2-linear-gradient)");

        const legendLabels = legendDiv.append("div")
            .attr("class", "legend-labels");

        legendLabels.append("span").text(`${-Math.round(maxAbsValue)}%`);
        legendLabels.append("span").text("0%");
        legendLabels.append("span").text(`+${Math.round(maxAbsValue)}%`);
    }
    d3.json("data/crisis_data.json").then(data => {
        if (data) {
            drawHeatmap(data);
        } else {
            console.error("Failed to load heatmap data or data is empty.");
        }
    }).catch(error => {
        console.error("Error fetching crisis_data.json:", error);
    });

})();

const eventsData = [
    {
        name: "Dot.com Bubble Burst",
        startDate: new Date("2000-03-10"),
        endDate: new Date("2003-04-01"),
        type: "Economic",
        description: "Collapse of technology stock valuations after speculative growth.",
        yOffset: -40,
        color: "#d62728",
        heatmap_key: "2001"
    },
    {
        name: "Great Recession",
        focusDate: new Date("2008-09-15"),
        type: "Economic",
        description: "Major financial crisis triggered by subprime mortgage market collapse.",
        yOffset: 40,
        color: "#ff7f0e",
        heatmap_key: ["2008", "2009"]
    },
    {
        name: "COVID-19 Pandemic",
        startDate: new Date("2020-02-01"),
        endDate: new Date("2021-03-01"),
        type: "Health/Economic",
        description: "Global pandemic leading to widespread lockdowns and economic disruption.",
        yOffset: -60,
        color: "#2ca02c",
        heatmap_key: "2020"
    },
    {
        name: "Inflation Shock",
        startDate: new Date("2022-02-24"),
        endDate: new Date("2023-12-31"),
        type: "Economic",
        description: "A global spike in inflation and energy prices, exacerbated by the Russian invasion of Ukraine and post-COVID supply issues.",
        yOffset: 40,
        color: "#7f7f7f",
        heatmap_key: "2022"
    }
];

function drawTimelineVis() {

    const margin = { top: 40, right: 30, bottom: 40, left: 30 };

    const svg = d3.select("#vis-ak7");
    const viewBox = svg.attr("viewBox").split(" ").map(Number);
    const baseWidth = viewBox[2];
    const baseHeight = viewBox[3];

    const width = baseWidth - margin.left - margin.right;
    const height = baseHeight - margin.top - margin.bottom;

    const mainGroup = svg.select("g.plot-area")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3.select("#tooltip");

    svg.select("text.placeholder").remove();

    const x = d3.scaleTime()
        .domain([new Date("2000-01-01"), new Date("2024-12-31")])
        .range([0, width]);

    const axisYCenter = height / 2;
    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeYear.every(2))
        .tickFormat(d3.timeFormat("%Y"));

    mainGroup.append("g")
        .attr("class", "timeline-axis")
        .attr("transform", `translate(0, ${axisYCenter})`)
        .call(xAxis);

    const onMouseOver = function(event, d) {
        tooltip.style("opacity", 1);

        const keys = d.heatmap_key;
        if (keys) {
            d3.selectAll("#vis-kz2 .cell, #vis-kz2 .cell-label")
                .transition().duration(200)
                .style("opacity", 0.15);

            const selector = (Array.isArray(keys) ? keys : [keys])
                .map(key => `#vis-kz2 [data-year="${key}"]`)
                .join(", ");

            d3.selectAll(selector)
                .transition().duration(200)
                .style("opacity", 1);
        }
    };

    const onMouseMove = function(event, d) {
        tooltip.html(
            `<h3>${d.name}</h3>
             <span class="type" style="font-style: italic; color: #555;">Type: ${d.type}</span>
             <p style="margin: 0; color: #333;">${d.description}</p>`
        )
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 10) + "px");
    };

    const onMouseOut = function(event, d) {
        tooltip.style("opacity", 0);

        d3.selectAll("#vis-kz2 .cell, #vis-kz2 .cell-label")
            .transition().duration(200)
            .style("opacity", 1);
    };

    const eventsGroup = mainGroup.append("g")
        .attr("transform", `translate(0, ${axisYCenter})`);

    const eventElements = eventsGroup.selectAll("g")
        .data(eventsData)
        .join("g")
        .attr("class", "event-group")
        .on("mouseover", onMouseOver)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseOut);

    eventElements.each(function(d) {
        const g = d3.select(this);
        const y = d.yOffset;
        const color = d.color;

        // --- NEW CODE: Add invisible hover box ---
        const hoverPaddingY = 20;
        const hoverPaddingX = 10;

        if (d.focusDate) {
            const xPos = x(d.focusDate);
            g.append("rect")
                .attr("x", xPos - (hoverPaddingX * 2)) // Center a 40px wide box
                .attr("y", y > 0 ? 0 - hoverPaddingY : y - (hoverPaddingY * 2))
                .attr("width", hoverPaddingX * 4)
                .attr("height", Math.abs(y) + (hoverPaddingY * 3))
                .attr("fill", "white")
                .style("opacity", 0);
        }
        else if (d.startDate) {
            const x1 = x(d.startDate);
            const x2 = x(d.endDate);
            g.append("rect")
                .attr("x", x1 - hoverPaddingX)
                .attr("y", y > 0 ? 0 - hoverPaddingY : y - (hoverPaddingY * 2))
                .attr("width", (x2 - x1) + (hoverPaddingX * 2))
                .attr("height", Math.abs(y) + (hoverPaddingY * 3))
                .attr("fill", "white")
                .style("opacity", 0);
        }
        // --- END NEW CODE ---

        if (d.focusDate) {
            const xPos = x(d.focusDate);

            g.append("line")
                .attr("class", "event-line")
                .attr("x1", xPos).attr("y1", 0)
                .attr("x2", xPos).attr("y2", y)
                .style("stroke", color);

            g.append("circle")
                .attr("class", "event-axis-point")
                .attr("cx", xPos).attr("cy", 0)
                .attr("r", 5)
                .style("fill", color);

            g.append("text")
                .attr("class", "event-label")
                .attr("x", xPos)
                .attr("y", y + (y > 0 ? 15 : -8))
                .text(d.name);

        }
        else if (d.startDate) {
            const x1 = x(d.startDate);
            const x2 = x(d.endDate);
            const midX = x1 + (x2 - x1) / 2;

            g.append("line")
                .attr("class", "event-line")
                .attr("x1", x1).attr("y1", y)
                .attr("x2", x2).attr("y2", y)
                .style("stroke", color);

            g.append("line")
                .attr("class", "event-line")
                .attr("x1", x1).attr("y1", 0)
                .attr("x2", x1).attr("y2", y)
                .style("stroke", color);

            g.append("line")
                .attr("class", "event-line")
                .attr("x1", x2).attr("y1", 0)
                .attr("x2", x2).attr("y2", y)
                .style("stroke", color);

            g.append("text")
                .attr("class", "event-label")
                .attr("x", midX)
                .attr("y", y + (y > 0 ? 15 : -8))
                .text(d.name);
        }
    });
}

window.addEventListener("frameEnter", e => {
    if (e.detail.id === "frame-5") {
        const svg = d3.select("#vis-ak7");
        if (!svg.classed("timeline-drawn")) {
            svg.classed("timeline-drawn", true);
            drawTimelineVis();
        }
    }
});