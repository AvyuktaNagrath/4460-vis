// heatmap visualization for how different crisis affect different US industry sector
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
            .interpolator(d3.interpolateRdYlGn); // Red -> Yellow -> Green

        plotArea.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, -10)`) // Position above heatmap
            .call(d3.axisTop(x).tickSize(0))
            .select(".domain").remove();

        plotArea.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove();

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const mouseover = (event, d) => {
            tooltip.style("opacity", 1);
            d3.select(event.currentTarget).style("stroke", "#2d3748").style("stroke-width", 2);
        };
        const mousemove = (event, d) => {
            tooltip
                .html(`<b>${d.Industry} (${d.Year})</b><br>${d.Crisis}<br>Change: ${d.PercentChange.toFixed(1)}%`)
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
            .attr("x", d => x(d.year) + (d.crisis === "Great Recession" ? x.bandwidth() * 1.5 : x.bandwidth() / 2)) // Center 'Great Recession' over 2 cols
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
            .style("fill", d => Math.abs(d.PercentChange) > 15 ? "white" : "#2d3748") // Contrast for readability
            .text(d => d.PercentChange.toFixed(1) + "%");

        const legendContainer = d3.select("#frame-5 .info-card");

        const legendDiv = legendContainer.append("div")
            .attr("class", "legend-container")
            .style("margin-top", "1rem");

        legendDiv.append("div")
            .attr("class", "legend-title")
            .text("% Change in Real Gross Output");

        const legendSvg = legendDiv.append("svg")
            .attr("id", "kz2-legend")
            .attr("width", "100%")
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