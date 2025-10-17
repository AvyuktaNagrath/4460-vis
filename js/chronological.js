function drawChronologicalVis() {
    //const margin = { top: 20, right: 30, bottom: 50, left: 60 };
//const width = 1440 - margin.left - margin.right;
//const height = 750 - margin.top - margin.bottom;

    /*const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);*/
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 1265 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#vis-ak1");
    const plot = svg.select(".plot-area");

    d3.csv("data/chronological_data.csv").then(data => {
        const years = data.columns.filter(d => !isNaN(parseInt(d)) && parseInt(d) > 1900);

        let longData = [];
        data.forEach(row => {
            years.forEach(year => {
                const value = parseFloat(row[year]);
                if (!isNaN(value)) {
                    longData.push({
                        country: row["Country Name"],
                        year: parseInt(year),
                        value: value
                    });
                }
            });
        });

        const dataByYear = d3.group(longData, d => d.year);

        const x = d3.scaleLinear()
            .domain([
                d3.min(longData, d => d.year),
                d3.max(longData, d => d.year)
            ])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(longData, d => d.value)])
            .nice()
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        plot.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")))
            .selectAll("text")
                    .attr("dx", "10");

        plot.append("g")
            .call(d3.axisLeft(y));

        plot.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - (height / 2))
            .attr("class", "axis-label")
            .text("Market Cap (% of GDP)");

        const groupedData = d3.group(longData, d => d.country);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value));

        const paths = plot.selectAll(".line")
            .data(groupedData)
            .join("path")
            .attr("class", "line")
            .attr("d", d => line(d[1]))
            .style("stroke", d => color(d[0]))
            .style("stroke-width", 1.5)
            .style("opacity", 1);


        const countries = Array.from(groupedData.keys()).sort();
        const filterDropdown = d3.select("#country-filter");

        filterDropdown.append("option")
            .attr("value", "all")
            .text("All Countries");

        countries.forEach(country => {
            filterDropdown.append("option")
                .attr("value", country)
                .text(country);
        });

        filterDropdown.on("change", function(event) {
            const selectedCountry = d3.select(this).property("value");

            paths.transition().duration(300)
                .style("opacity", d => {
                    return (selectedCountry === "all" || d[0] === selectedCountry) ? 1 : 0.1;
                })
                .style("stroke-width", d => {
                    if (selectedCountry === "all") return 1.5;
                    return (d[0] === selectedCountry) ? 2.5 : 1.5;
                });
        });


        const hoverLabel = plot.append("text")
            .attr("class", "country-label")
            .style("opacity", 0)
            .attr("text-anchor", "start");

        const focusLine = plot.append("line")
            .attr("class", "focus-line")
            .style("opacity", 0)
            .attr("y1", 0)
            .attr("y2", height);

        const focusCircles = plot.append("g")
            .attr("class", "focus-circles")
            .style("opacity", 0);

        const focusCircle = focusCircles.selectAll("circle")
            .data(groupedData)
            .join("circle")
            .attr("r", 5) // radius of 5px
            .style("fill", d => color(d[0]))
            .style("stroke", "white")
            .style("stroke-width", 1.5);

        const overlay = plot.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height);

        overlay
            .on("mouseover", () => {
                focusLine.style("opacity", 1);
                focusCircles.style("opacity", 1);
                hoverLabel.style("opacity", 1);
            })
            .on("mouseout", () => {
                focusLine.style("opacity", 0);
                focusCircles.style("opacity", 0);
                hoverLabel.style("opacity", 0);
            })
            .on("mousemove", (event) => {
                const [mx, my] = d3.pointer(event);

                const year = Math.round(x.invert(mx));

                const pointsForYear = dataByYear.get(year);

                if (!pointsForYear) return;

                const bisectX = x(year);

                focusLine.attr("x1", bisectX).attr("x2", bisectX);

                let closestData = null;
                let minDist = Infinity;

                pointsForYear.forEach(d => {
                    const yPos = y(d.value);
                    const dist = Math.abs(my - yPos);
                    if (dist < minDist) {
                        minDist = dist;
                        closestData = d;
                    }
                });

                const countryDataMap = new Map(pointsForYear.map(d => [d.country, d]));

                focusCircle
                    .style("display", d => countryDataMap.has(d[0]) ? "block" : "none") // d[0] is country name
                    .attr("transform", d => {
                        const countryData = countryDataMap.get(d[0]);
                        if (countryData) {
                            return `translate(${bisectX}, ${y(countryData.value)})`;
                        }
                        return null;
                    });

                if (closestData) {
                    const yPos = y(closestData.value);

                    let textX = bisectX + 10;
                    let anchor = "start";
                    if (textX + 150 > width) {
                        textX = bisectX - 10;
                        anchor = "end";
                    }

                    hoverLabel
                        .attr("x", textX)
                        .attr("y", yPos)
                        .attr("text-anchor", anchor)
                        .attr("fill", color(closestData.country))
                        .text(`${closestData.country}: ${closestData.value.toFixed(2)}% in ${closestData.year}`);
                }
            });

    }).catch(error => {
        console.error("Error loading or parsing data:", error);
        d3.select("#vis-ak1").append("text")
            .attr("x", 50)
            .attr("y", 50)
            .text("Failed to load data. Please check the console and your CSV file.");
    });
}

window.addEventListener("frameEnter", e => {
    if (e.detail.id === "frame-4") {
        drawChronologicalVis();
    }
});