// left panel Real Economy (GDP) treemap
document.addEventListener("DOMContentLoaded", () => {
    const treemap_width = 420;
    const treemap_height = 280;

    const svg = d3.select("#vis-ak6-gdp")
        .attr("width", treemap_width)
        .attr("height", treemap_height)
        .style("overflow", "visible");

    const gRoot = svg.append("g")
        .attr("class", "treemap-root")
        .attr("transform", "translate(-140, 0) scale(2.1)");

    d3.csv("data/sector_left_data.csv").then(raw => {
        const data = raw.map(d => ({
            Industry: d.Industry,
            Value: +d.Value
        }));

        const root = d3.hierarchy({ children: data })
            .sum(d => d.Value);

        const treemapLayout = d3.treemap()
            .size([treemap_width - 20, treemap_height - 20]);
        treemapLayout(root);

        const color = d3.scaleOrdinal(d3.schemeTableau10);

        // draw one <g> per leaf
        const cells = gRoot.selectAll("g.cell")
            .data(root.leaves())
            .join("g")
            .attr("class", "cell")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // rectangles
        cells.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.data.Industry))
            .attr("stroke", "white")
            .attr("rx", 3)
            .attr("ry", 3);

        cells.sort((a, b) => b.data.Value - a.data.Value);

        // hover tooltip
        const totalValue = d3.sum(data, d => d.Value);
        const tooltip = d3.select("#tooltip");

        cells.select("rect")
            .on("mousemove", (event, d) => {
                const percent = ((d.data.Value / totalValue) * 100).toFixed(1);
                tooltip
                    .style("left", `${event.pageX + 12}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .style("opacity", 1)
                    .html(`
          <strong>${d.data.Industry}</strong><br>
          Value: ${d3.format(",")(d.data.Value)}<br>
          Share: ${percent}%
        `);
            })
            .on("mouseover", function() {
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke", "white").attr("stroke-width", 1);
                tooltip.style("opacity", 0);
            });

        // sector labels
        cells.append("text")
            .attr("class", "cell-label")
            .attr("x", d => (d.x1 - d.x0) / 2)
            .attr("y", d => (d.y1 - d.y0) / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("pointer-events", "none")
            .each(function(d) {
                const text = d3.select(this);
                const name = d.data.Industry;
                text.text(name);

                // if text is too wide for its box, trim and add ellipsis
                const boxWidth = d.x1 - d.x0 - 6;
                let textLength = this.getComputedTextLength();
                let truncated = name;
                while (textLength > boxWidth && truncated.length > 2) {
                    truncated = truncated.slice(0, -1);
                    text.text(truncated + "…");
                    textLength = this.getComputedTextLength();
                }
            });
    });



// right panel market value (Cap)
    d3.csv("data/sector_right_data.csv").then(raw => {
        const data = raw.map(d => ({
            Sector: d.Sector,
            MarketCap: +d.MarketCap
        }));

        const svg = d3.select("#vis-ak6-mcap")
            .attr("width", 420)
            .attr("height", 280)
            .style("overflow", "visible");

        const gRoot = svg.append("g")
            .attr("class", "treemap-root")
            .attr("transform", "translate(-140, 0) scale(2.1)");

        const root = d3.hierarchy({ children: data }).sum(d => d.MarketCap);

        const treemapLayout = d3.treemap()
            .size([400, 260])
            .paddingInner(2);

        treemapLayout(root);

        const color = d3.scaleOrdinal(d3.schemeTableau10);

        const cells = gRoot.selectAll("g.cell")
            .data(root.leaves())
            .join("g")
            .attr("class", "cell")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // rectangles
        cells.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.data.Sector))
            .attr("stroke", "white")
            .attr("rx", 3)
            .attr("ry", 3);

        // hover tooltip
        const totalValue = d3.sum(data, d => d.MarketCap);
        const tooltip = d3.select("#tooltip")
            .style("position", "absolute")
            .style("text-align", "center")
            .style("padding", "8px 12px")
            .style("font-size", "12px")
            .style("background", "#2d3748")
            .style("color", "white")
            .style("border-radius", "6px")
            .style("pointer-events", "none")
            .style("opacity", "0")
            .style("transition", "opacity 0.2s ease-in-out")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.15)")
            .style("z-index", "999");

        cells.select("rect")
            .on("mousemove", (event, d) => {
                const percent = ((d.data.MarketCap / totalValue) * 100).toFixed(1);
                tooltip
                    .style("left", `${event.pageX + 12}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .style("opacity", 1)
                    .html(`
          <strong>${d.data.Sector}</strong><br>
          Market Cap: ${d3.format(",")(d.data.MarketCap)}<br>
          Share: ${percent}%
        `);
            })
            .on("mouseover", function() {
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke", "white").attr("stroke-width", 1);
                tooltip.style("opacity", 0);
            });

        // sector labels
        cells.append("text")
            .attr("class", "cell-label")
            .attr("x", d => (d.x1 - d.x0) / 2)
            .attr("y", d => (d.y1 - d.y0) / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("pointer-events", "none")
            .each(function(d) {
                const text = d3.select(this);
                const name = d.data.Sector;
                text.text(name);

                const boxWidth = d.x1 - d.x0 - 6;
                let textLength = this.getComputedTextLength();
                let truncated = name;

                // if text is too wide for its box, trim and add ellipsis
                while (textLength > boxWidth && truncated.length > 2) {
                    truncated = truncated.slice(0, -1);
                    text.text(truncated + "…");
                    textLength = this.getComputedTextLength();
                }
            });
    });

});
