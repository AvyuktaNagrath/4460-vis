window.addEventListener("load", function() {

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

    // This is the drawFrame4Chart function from your working test file.
    function drawFrame4Chart() {

        const margin = { top: 10, right: 30, bottom: 50, left: 60 };

        const svg = d3.select("#vis-ak1");
        const viewBox = svg.attr("viewBox").split(" ").map(Number);
        const baseWidth = viewBox[2];
        const baseHeight = viewBox[3];

        const width = baseWidth - margin.left - margin.right;
        const height = baseHeight - margin.top - margin.bottom;

        const mainGroup = svg.select("g.plot-area")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        svg.select("text.placeholder").remove();

        // Make sure this path is correct for your main project!
        // This was the path in your original chronological.js, so I'll use it.
        // If your file is in the root, change this to "data.csv"
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

            const groupedData = d3.group(longData, d => d.country);

            const line = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value));

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
                paths.transition().duration(300)
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

            // This is the simple, direct listener that we know works from the test
            regionFilterDropdown.on("change", function() {
                const selectedRegion = d3.select(this).property("value");
                updateCountryFilter(selectedRegion);
                applyFilters();
            });

            countryFilterDropdown.on("change", function() {
                applyFilters();
            });

            updateCountryFilter("All Regions");
            applyFilters();

            const hoverLabel = mainGroup.append("text")
                .attr("class", "country-label");

            const focusLine = chartArea.append("line")
                .attr("class", "focus-line")
                .attr("y1", 0)
                .attr("y2", height);

            const focusCircles = chartArea.append("g")
                .attr("class", "focus-circles");

            const focusCircle = focusCircles.selectAll("circle")
                .data(groupedData)
                .join("circle")
                .attr("r", 5)
                .style("fill", d => color(d[0]));

            const overlay = svg.select("rect.event-capture");

            function zoomed(event) {
                const transform = event.transform;
                x.domain(transform.rescaleX(xOriginal).domain());
                y.domain(transform.rescaleY(yOriginal).domain());
                xAxisGroup.call(d3.axisBottom(x).tickFormat(d3.format("d")));
                yAxisGroup.call(d3.axisLeft(y));
                paths.attr("d", d => line(d[1]));
            }

            const zoom = d3.zoom()
                .scaleExtent([1, 10])
                .extent([[0, 0], [width, height]])
                .translateExtent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            overlay.call(zoom);

            d3.select("#f4-reset-zoom").on("click", () => {
                overlay.call(zoom.transform, d3.zoomIdentity);
            });

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
                    const [mx, my] = d3.pointer(event, mainGroup.node());

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

                    const selectedRegion = regionFilterDropdown.property("value");
                    const selectedCountry = countryFilterDropdown.property("value");
                    const countryDataMap = new Map(pointsForYear.map(d => [d.country, d]));

                    focusCircle
                        .style("display", d => {
                            const countryName = d[0]; const regionName = getRegion(countryName);
                            const regionMatch = (selectedRegion === "All Regions") || (regionName === selectedRegion);
                            const countryMatch = (selectedCountry === "all") || (countryName === selectedCountry);
                            return (countryDataMap.has(countryName) && regionMatch && countryMatch) ? "block" : "none";
                        })
                        .attr("transform", d => {
                            const countryData = countryDataMap.get(d[0]);
                            if (countryData) {
                                return `translate(${bisectX}, ${y(countryData.value)})`;
                            }
                            return null;
                        });

                    if (closestData) {
                        const regionMatch = (selectedRegion === "All Regions") || (closestData.region === selectedRegion);
                        const countryMatch = (selectedCountry === "all") || (closestData.country === selectedCountry);

                        if (regionMatch && countryMatch) {
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
                                .text(`${closestData.country}: ${closestData.value.toFixed(2)}% in ${closestData.year}`)
                                .style("opacity", 1);

                        } else {
                            hoverLabel.style("opacity", 0);
                            tooltip.style("opacity", 0);
                        }
                    } else {
                        tooltip.style("opacity", 0);
                    }
                });

        }).catch(error => {
            console.error("Error loading or parsing data:", error);
            svg.select("text.placeholder").text("Error loading data. Check console.").attr("fill", "red");
        });
    }

    // This is the trigger from your main.js file
    window.addEventListener("frameEnter", e => {
        if (e.detail.id === "frame-4") {
            const svg = d3.select("#vis-ak1");
            // This "guard" ensures the chart only draws ONCE
            if (!svg.classed("chart-drawn")) {
                svg.classed("chart-drawn", true);
                drawFrame4Chart();
            }
        }
    });

});