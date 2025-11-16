const regionMap = new Map([
    ["Aruba", "Americas"],
    ["Argentina", "Americas"],
    ["American Samoa", "Americas"],
    ["Antigua and Barbuda", "Americas"],
    ["Bahamas, The", "Americas"],
    ["Belize", "Americas"],
    ["Bermuda", "Americas"],
    ["Bolivia", "Americas"],
    ["Brazil", "Americas"],
    ["Barbados", "Americas"],
    ["Canada", "Americas"],
    ["Channel Islands", "Europe"],
    ["Chile", "Americas"],
    ["Colombia", "Americas"],
    ["Cabo Verde", "Africa"],
    ["Costa Rica", "Americas"],
    ["Cuba", "Americas"],
    ["Curacao", "Americas"],
    ["Cayman Islands", "Americas"],
    ["Dominica", "Americas"],
    ["Dominican Republic", "Americas"],
    ["Ecuador", "Americas"],
    ["Grenada", "Americas"],
    ["Greenland", "Americas"],
    ["Guatemala", "Americas"],
    ["Guam", "Oceania"],
    ["Guyana", "Americas"],
    ["Honduras", "Americas"],
    ["Haiti", "Americas"],
    ["Jamaica", "Americas"],
    ["St. Kitts and Nevis", "Americas"],
    ["St. Lucia", "Americas"],
    ["St. Martin (French part)", "Americas"],
    ["Mexico", "Americas"],
    ["Northern Mariana Islands", "Oceania"],
    ["Nicaragua", "Americas"],
    ["Panama", "Americas"],
    ["Peru", "Americas"],
    ["Paraguay", "Americas"],
    ["El Salvador", "Americas"],
    ["Suriname", "Americas"],
    ["Sint Maarten (Dutch part)", "Americas"],
    ["Turks and Caicos Islands", "Americas"],
    ["Trinidad and Tobago", "Americas"],
    ["Uruguay", "Americas"],
    ["United States", "Americas"],
    ["St. Vincent and the GRENADINES", "Americas"],
    ["Venezuela, RB", "Americas"],
    ["British Virgin Islands", "Americas"],
    ["Virgin Islands (U.S.)", "Americas"],
    ["Afghanistan", "Asia"],
    ["United Arab Emirates", "Asia"],
    ["Armenia", "Asia"],
    ["Azerbaijan", "Asia"],
    ["Bangladesh", "Asia"],
    ["Bahrain", "Asia"],
    ["Brunei Darussalam", "Asia"],
    ["Bhutan", "Asia"],
    ["China", "Asia"],
    ["Cyprus", "Asia"],
    ["Georgia", "Asia"],
    ["Hong Kong SAR, China", "Asia"],
    ["Indonesia", "Asia"],
    ["India", "Asia"],
    ["Iran, Islamic Rep.", "Asia"],
    ["Iraq", "Asia"],
    ["Israel", "Asia"],
    ["Jordan", "Asia"],
    ["Japan", "Asia"],
    ["Kazakhstan", "Asia"],
    ["Kyrgyz Republic", "Asia"],
    ["Cambodia", "Asia"],
    ["Korea, Rep.", "Asia"],
    ["Kuwait", "Asia"],
    ["Lao PDR", "Asia"],
    ["Lebanon", "Asia"],
    ["Sri Lanka", "Asia"],
    ["Macao SAR, China", "Asia"],
    ["Maldives", "Asia"],
    ["Myanmar", "Asia"],
    ["Mongolia", "Asia"],
    ["Malaysia", "Asia"],
    ["Nepal", "Asia"],
    ["Oman", "Asia"],
    ["Pakistan", "Asia"],
    ["Philippines", "Asia"],
    ["Korea, Dem. People's Rep.", "Asia"],
    ["West Bank and Gaza", "Asia"],
    ["Qatar", "Asia"],
    ["Saudi Arabia", "Asia"],
    ["Singapore", "Asia"],
    ["Syrian Arab Republic", "Asia"],
    ["Thailand", "Asia"],
    ["Tajikistan", "Asia"],
    ["Turkmenistan", "Asia"],
    ["Turkiye", "Asia"],
    ["Uzbekistan", "Asia"],
    ["Viet Nam", "Asia"],
    ["Yemen, Rep.", "Asia"],
    ["Albania", "Europe"],
    ["Andorra", "Europe"],
    ["Austria", "Europe"],
    ["Belgium", "Europe"],
    ["Bulgaria", "Europe"],
    ["Bosnia and Herzegovina", "Europe"],
    ["Belarus", "Europe"],
    ["Switzerland", "Europe"],
    ["Czechia", "Europe"],
    ["Germany", "Europe"],
    ["Denmark", "Europe"],
    ["Spain", "Europe"],
    ["Estonia", "Europe"],
    ["Finland", "Europe"],
    ["France", "Europe"],
    ["Faroe Islands", "Europe"],
    ["United Kingdom", "Europe"],
    ["Gibraltar", "Europe"],
    ["Greece", "Europe"],
    ["Croatia", "Europe"],
    ["Hungary", "Europe"],
    ["Isle of Man", "Europe"],
    ["Ireland", "Europe"],
    ["Iceland", "Europe"],
    ["Italy", "Europe"],
    ["Liechtenstein", "Europe"],
    ["Lithuania", "Europe"],
    ["Luxembourg", "Europe"],
    ["Latvia", "Europe"],
    ["Monaco", "Europe"],
    ["Moldova", "Europe"],
    ["Malta", "Europe"],
    ["Montenegro", "Europe"],
    ["North Macedonia", "Europe"],
    ["Netherlands", "Europe"],
    ["Norway", "Europe"],
    ["Poland", "Europe"],
    ["Portugal", "Europe"],
    ["Romania", "Europe"],
    ["Russian Federation", "Europe"],
    ["San Marino", "Europe"],
    ["Serbia", "Europe"],
    ["Slovak Republic", "Europe"],
    ["Slovenia", "Europe"],
    ["Sweden", "Europe"],
    ["Ukraine", "Europe"],
    ["Kosovo", "Europe"],
    ["Angola", "Africa"],
    ["Burundi", "Africa"],
    ["Benin", "Africa"],
    ["Burkina Faso", "Africa"],
    ["Botswana", "Africa"],
    ["Central African Republic", "Africa"],
    ["Cote d'Ivoire", "Africa"],
    ["Cameroon", "Africa"],
    ["Congo, Dem. Rep.", "Africa"],
    ["Congo, Rep.", "Africa"],
    ["Comoros", "Africa"],
    ["Djibouti", "Africa"],
    ["Algeria", "Africa"],
    ["Egypt, Arab Rep.", "Africa"],
    ["Eritrea", "Africa"],
    ["Ethiopia", "Africa"],
    ["Gabon", "Africa"],
    ["Ghana", "Africa"],
    ["Guinea", "Africa"],
    ["Gambia, The", "Africa"],
    ["Guinea-Bissau", "Africa"],
    ["Equatorial Guinea", "Africa"],
    ["Kenya", "Africa"],
    ["Liberia", "Africa"],
    ["Libya", "Africa"],
    ["Lesotho", "Africa"],
    ["Morocco", "Africa"],
    ["Madagascar", "Africa"],
    ["Mali", "Africa"],
    ["Mozambique", "Africa"],
    ["Mauritania", "Africa"],
    ["Mauritius", "Africa"],
    ["Malawi", "Africa"],
    ["Namibia", "Africa"],
    ["Niger", "Africa"],
    ["Nigeria", "Africa"],
    ["Rwanda", "Africa"],
    ["Sudan", "Africa"],
    ["Senegal", "Africa"],
    ["Sierra Leone", "Africa"],
    ["Somalia, Fed. Rep.", "Africa"],
    ["Sao Tome and Principe", "Africa"],
    ["Eswatini", "Africa"],
    ["Seychelles", "Africa"],
    ["Chad", "Africa"],
    ["Togo", "Africa"],
    ["Tunisia", "Africa"],
    ["Tanzania", "Africa"],
    ["Uganda", "Africa"],
    ["South Africa", "Africa"],
    ["Zambia", "Africa"],
    ["Zimbabwe", "Africa"],
    ["Australia", "Oceania"],
    ["Fiji", "Oceania"],
    ["Micronesia, Fed. Sts.", "Oceania"],
    ["Kiribati", "Oceania"],
    ["Marshall Islands", "Oceania"],
    ["Nauru", "Oceania"],
    ["New Caledonia", "Oceania"],
    ["New Zealand", "Oceania"],
    ["Palau", "Oceania"],
    ["Papua New Guinea", "Oceania"],
    ["French Polynesia", "Oceania"],
    ["Solomon Islands", "Oceania"],
    ["Tonga", "Oceania"],
    ["Tuvalu", "Oceania"],
    ["Vanuatu", "Oceania"],
    ["Samoa", "Oceania"],
    ["South Asia", "Other"]
]);
const regions = ["All Regions", "Americas", "Asia", "Europe", "Africa", "Oceania", "Other"];
function getRegion(country) {
    return regionMap.get(country) || "Other";
}

function drawFrame4Chart() {

    let activeCountry = null;
    const proximityThreshold = 400;

    const margin = { top: 10, right: 30, bottom: 50, left: 60 };

    const svg = d3.select("#vis-ak1");
    const viewBox = svg.attr("viewBox").split(" ").map(Number);
    const baseWidth = viewBox[2];
    const baseHeight = viewBox[3];

    const width = baseWidth - margin.left - margin.right;
    const height = baseHeight - margin.top - margin.bottom;

    const mainGroup = svg.select("g.plot-area")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    svg.select("text.placeholder").remove();

    d3.csv("data/stockgdp.csv").then(data => {
        const years = data.columns.filter(d => !isNaN(parseInt(d)) && parseInt(d) > 1900);
        let longData = [];
        data.forEach(row => {
            const country = row["Country Name"];
            const region = getRegion(country);
            if (region !== "Other") {
                years.forEach(year => {
                    const value = parseFloat(row[year]);
                    if (!isNaN(value)) {
                        longData.push({
                            country: country,
                            region: region,
                            year: parseInt(year),
                            value: value
                        });
                    }
                });
            }
        });
        const dataByYear = d3.group(longData, d => d.year);

        let x = d3.scaleLinear()
            .domain(d3.extent(longData, d => d.year))
            .range([0, width]);

        let y = d3.scaleLinear()
            .domain([0, d3.max(longData, d => d.value)])
            .nice()
            .range([height, 0]);

        const xOriginal = x.copy();
        const yOriginal = y.copy();

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const xAxisGroup = mainGroup.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        const yAxisGroup = mainGroup.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        mainGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - (height / 2))
            .attr("class", "axis-label")
            .text("Market Cap (% of GDP)");

        mainGroup.append("defs").append("clipPath")
            .attr("id", "f4-clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        const chartArea = mainGroup.append("g")
            .attr("clip-path", "url(#f4-clip)");

        const focusLine = chartArea.append("line")
            .attr("class", "focus-line")
            .attr("y1", 0)
            .attr("y2", height)
            .style("opacity", 0);

        const groupedData = d3.group(longData, d => d.country);

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value));

        const bg = chartArea.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .style("pointer-events", "all");

        const paths = chartArea.selectAll(".line")
            .data(groupedData)
            .join("path")
            .attr("class", "line")
            .attr("d", d => line(d[1]))
            .style("stroke", d => color(d[0]));

        const regionFilterDropdown = d3.select("#f4-region-filter");
        const countryFilterDropdown = d3.select("#f4-country-filter");
        const allCountries = Array.from(groupedData.keys()).sort();

        regions.forEach(region => {
            regionFilterDropdown.append("option").attr("value", region).text(region);
        });

        function updateCountryFilter(selectedRegion) {
            countryFilterDropdown.html("");
            let filteredCountries;
            if (selectedRegion === "All Regions") {
                filteredCountries = allCountries;
                countryFilterDropdown.append("option").attr("value", "all").text("All Countries");
            } else {
                filteredCountries = allCountries.filter(country => getRegion(country) === selectedRegion);
                countryFilterDropdown.append("option").attr("value", "all").text(`All ${selectedRegion} Countries`);
            }
            filteredCountries.forEach(country => {
                countryFilterDropdown.append("option").attr("value", country).text(country);
            });
        }

        function applyFilters() {
            const selectedRegion = regionFilterDropdown.property("value");
            const selectedCountry = countryFilterDropdown.property("value");
            paths
                .style("opacity", d => {
                    const countryName = d[0]; const regionName = getRegion(countryName);
                    const regionMatch = (selectedRegion === "All Regions") || (regionName === selectedRegion);
                    const countryMatch = (selectedCountry === "all") || (countryName === selectedCountry);
                    return (regionMatch && countryMatch) ? 1 : 0.1;
                })
                .style("stroke-width", d => {
                    const countryName = d[0];
                    if (selectedCountry === "all") return 1.5;
                    return (countryName === selectedCountry) ? 2.5 : 1.5;
                });
        }

        d3.select("#frame-4").on("change", function(event) {
            if (event.target.id === "f4-region-filter") {
                const selectedRegion = d3.select(event.target).property("value");
                updateCountryFilter(selectedRegion);
                applyFilters();
            }
            if (event.target.id === "f4-country-filter") {
                applyFilters();
            }
        });

        updateCountryFilter("All Regions");
        applyFilters();

        function zoomed(event) {
            const transform = event.transform;
            x.domain(transform.rescaleX(xOriginal).domain());
            y.domain(transform.rescaleY(yOriginal).domain());
            xAxisGroup.call(d3.axisBottom(x).tickFormat(d3.format("d")));
            yAxisGroup.call(d3.axisLeft(y));
            paths.attr("d", d => line(d[1]));
            hoverPaths.attr("d", d => line(d[1]));
        }

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .extent([[0, 0], [width, height]])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        bg.call(zoom);

        d3.select("#f4-reset-zoom").on("click", () => {
            bg.call(zoom.transform, d3.zoomIdentity);

            regionFilterDropdown.property("value", "All Regions");
            countryFilterDropdown.property("value", "all");

            updateCountryFilter("All Regions");

            applyFilters();
            activeCountry = null;
            tooltip.style("opacity", 0);
            focusLine.style("opacity", 0);
        });

        const hoverPaths = chartArea.selectAll(".hover-line")
            .data(groupedData)
            .join("path")
            .attr("class", "hover-line")
            .attr("d", d => line(d[1]))
            .on("mouseover", (event, d) => {
                const countryName = d[0];
                const selectedRegion = regionFilterDropdown.property("value");
                const selectedCountry = countryFilterDropdown.property("value");
                if (selectedRegion !== "All Regions" && getRegion(countryName) !== selectedRegion) {
                    return;
                }
                if (selectedCountry !== "all" && countryName !== selectedCountry) {
                    return;
                }

                activeCountry = countryName;

                paths
                    .style("opacity", p => (p[0] === countryName ? 1 : 0.1))
                    .style("stroke-width", p => (p[0] === countryName ? 2.5 : 1.5))
                    .filter(p => p[0] === countryName).raise();
            })
            .on("mouseout", () => {
            });

        mainGroup.on("mousemove", (event) => {
            const [mx, my] = d3.pointer(event, mainGroup.node());
            const year = Math.round(x.invert(mx));
            const bisectX = x(year);
            const selectedRegion = regionFilterDropdown.property("value");
            const selectedCountry = countryFilterDropdown.property("value");

            const pointsForYear = dataByYear.get(year);
            if (!pointsForYear) {
                tooltip.style("opacity", 0);
                focusLine.style("opacity", 0);
                return;
            }

            let countryToDisplay = activeCountry;

            if (!activeCountry) {
                let closestData = null;
                let minDist = Infinity;

                pointsForYear.forEach(d => {
                    const regionMatch = (selectedRegion === "All Regions") || (getRegion(d.country) === selectedRegion);
                    const countryMatch = (selectedCountry === "all") || (d.country === selectedCountry);
                    if (regionMatch && countryMatch) {
                        const yPos = y(d.value);
                        const dist = Math.abs(my - yPos);
                        if (dist < minDist) {
                            minDist = dist;
                            closestData = d;
                        }
                    }
                });

                if (!closestData || minDist > proximityThreshold) {
                    tooltip.style("opacity", 0);
                    focusLine.style("opacity", 0);
                    return;
                }

                countryToDisplay = closestData.country;
            }

            focusLine.style("opacity", 1).attr("x1", bisectX).attr("x2", bisectX);

            const countryData = pointsForYear.find(p => p.country === countryToDisplay);

            if (countryData) {
                tooltip.style("opacity", 1)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .html(`<strong>${countryData.country}</strong><br>${countryData.year}: ${countryData.value.toFixed(2)}%`);
            } else {
                tooltip.style("opacity", 1)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .html(`<strong>${countryToDisplay}</strong><br>Insufficient data for ${year}`);
            }
        });

        bg.on("mouseout", () => {
            activeCountry = null;
            tooltip.style("opacity", 0);
            focusLine.style("opacity", 0);
            applyFilters();
        });

        bg.on("mouseover", () => {
            activeCountry = null;
            tooltip.style("opacity", 0);
            focusLine.style("opacity", 0);
            applyFilters();
        });

    }).catch(error => {
        console.error("Error loading or parsing data:", error);
        svg.select("text.placeholder").text("Error loading data. Check console.").attr("fill", "red");
    });
}

window.addEventListener("frameEnter", e => {
    if (e.detail.id === "frame-4") {
        const svg = d3.select("#vis-ak1");
        if (!svg.classed("chart-drawn")) {
            svg.classed("chart-drawn", true);
            drawFrame4Chart();
        }
    }
});