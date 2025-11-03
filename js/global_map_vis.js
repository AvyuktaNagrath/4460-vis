class GlobalMapVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.currentMode = 'gdp'; // 'gdp' 'market' 'lead' are the three modes to toggle

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.svg = d3.select("#" + vis.parentElement);

        const viewBox = vis.svg.attr("viewBox").split(" ");
        vis.width = +viewBox[2];
        vis.height = +viewBox[3];

        vis.plotArea = vis.svg.select(".plot-area");


        // using merctor for rectangular
        vis.projection = d3.geoMercator()
            .scale(150)
            .translate([vis.width / 2, vis.height / 1.5]);

        vis.path = d3.geoPath().projection(vis.projection);

        vis.colorSequential = d3.scaleThreshold()
            .domain([3, 6, 9, 12, 18, 24, 36])
            .range(d3.schemeRdYlGn[8].reverse());

        // had to make own scale
        vis.colorDiverging = d3.scaleThreshold()
            .domain([-3, 0, 3, 6, 9, 12, 15, 18, 21, 24])
            .range([
                '#dc2626',
                '#f87171',
                '#84cc16',
                '#84cc16',
                '#65a30d',
                '#67a510',
                '#4d7c0f',
                '#4d7c0f',
                '#3f6212',
                '#3f6212',
                '#365314'
            ]);

        vis.noRecoveryColor = "#e5e7eb";
        vis.noDataColor = "#f3f4f6";


        // changed tooltip to just copy other styles because merge broke it for some reason
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')
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

        // toggle buttons
        vis.toggleGroup = vis.svg.append("g")
            .attr("class", "mode-toggle")
            .attr("transform", "translate(20, 20)");

        const modes = [
            { id: 'gdp', label: 'GDP Recovery' },
            { id: 'market', label: 'Market Recovery' },
            { id: 'lead', label: 'Lead (Market - GDP)' }
        ];

        const buttonWidth = 150;
        const buttonHeight = 35;
        const buttonSpacing = 5;

        modes.forEach((mode, i) => {
            const button = vis.toggleGroup.append("g")
                .attr("class", "toggle-button")
                .attr("transform", `translate(${i * (buttonWidth + buttonSpacing)}, 0)`)
                .style("cursor", "pointer")
                .on("click", function() {
                    vis.onModeChange(mode.id);

                    vis.toggleGroup.selectAll(".toggle-button rect")
                        .attr("fill", "#e5e7eb")
                        .attr("stroke", "#9ca3af");

                    d3.select(this).select("rect")
                        .attr("fill", "#3b82f6")
                        .attr("stroke", "#2563eb");

                    vis.toggleGroup.selectAll(".toggle-button text")
                        .attr("fill", "#374151");

                    d3.select(this).select("text")
                        .attr("fill", "white");
                });

            button.append("rect")
                .attr("width", buttonWidth)
                .attr("height", buttonHeight)
                .attr("rx", 6)
                .attr("fill", mode.id === 'gdp' ? "#3b82f6" : "#e5e7eb")
                .attr("stroke", mode.id === 'gdp' ? "#2563eb" : "#9ca3af")
                .attr("stroke-width", 2);

            button.append("text")
                .attr("x", buttonWidth / 2)
                .attr("y", buttonHeight / 2)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("fill", mode.id === 'gdp' ? "white" : "#374151")
                .attr("font-size", "14px")
                .attr("font-weight", "500")
                .style("pointer-events", "none")
                .text(mode.label);
        });

        // topo map loading
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
            vis.countries = topojson.feature(world, world.objects.countries).features;

            console.log("Loaded world map:", vis.countries);

            vis.dataByCountry = {};
            vis.data.forEach(d => {
                vis.dataByCountry[d.iso3] = d;
            });

            vis.wrangleData();
        });

        // legend
        vis.legendGroup = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(20, ${vis.height - 80})`);

        vis.legendTitle = vis.legendGroup.append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("font-size", "12px")
            .attr("font-weight", "600")
            .text("Recovery Time (months)");

        const legendWidth = 300;
        const legendHeight = 20;
        const numBins = 8;
        const binWidth = legendWidth / numBins;

        vis.legendRects = vis.legendGroup.selectAll(".legend-rect")
            .data(d3.range(numBins))
            .enter()
            .append("rect")
            .attr("class", "legend-rect")
            .attr("x", (d, i) => i * binWidth)
            .attr("y", 0)
            .attr("width", binWidth)
            .attr("height", legendHeight)
            .attr("fill", (d, i) => vis.colorSequential.range()[i]);

        vis.legendScale = d3.scaleLinear()
            .domain([0, 36])
            .range([0, legendWidth]);

        vis.legendAxis = d3.axisBottom(vis.legendScale)
            .tickValues([0, 3, 6, 9, 12, 18, 24, 36])
            .tickFormat(d => d + "m");

        vis.legendAxisGroup = vis.legendGroup.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(vis.legendAxis);

        // todo takeaway box
        // todo region summary panel maybe?
    }

    /*
     * Data wrangling
     */
    wrangleData() {
        let vis = this;

        if (!vis.countries) return;

        let metricKey;
        if (vis.currentMode === 'market') {
            metricKey = 'mkt_recovery_months';
        } else if (vis.currentMode === 'gdp') {
            metricKey = 'gdp_recovery_months';
        } else {
            metricKey = 'lead_months';
        }

        vis.currentMetric = metricKey;
        vis.displayData = vis.countries;

        vis.updateVis();
    }

    /*
     * The drawing function
     */
    updateVis() {
        let vis = this;

        // map to codes for topo
        const isoNumericToISO3 = {
            '840': 'USA',
            '124': 'CAN',
            '826': 'GBR',
            '276': 'DEU',
            '250': 'FRA',
            '380': 'ITA',
            '392': 'JPN',
            '036': 'AUS',
            '554': 'NZL',
            '410': 'KOR',
            '360': 'IDN',
            '076': 'BRA',
            '484': 'MEX',
            '643': 'RUS',
            '682': 'SAU',
            '710': 'ZAF',
            '792': 'TUR',
            '356': 'IND',
            '032': 'ARG'
        };

        const getColor = (feature) => {
            const countryId = feature.id;
            const iso3 = isoNumericToISO3[countryId];

            if (!iso3 || !vis.dataByCountry[iso3]) {
                return vis.noDataColor;
            }

            const countryData = vis.dataByCountry[iso3];
            const value = countryData[vis.currentMetric];

            if (value === null || value === undefined) {
                return vis.noRecoveryColor;
            }

            if (vis.currentMode === 'lead') {
                return vis.colorDiverging(value);
            } else {
                return vis.colorSequential(value);
            }
        };

        // map quarteres to dates
        const formatDate = (dateStr, isGDP = false) => {
            if (!dateStr) return 'N/A';
            const date = new Date(dateStr);
            if (isGDP) {
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                return `${date.getFullYear()}-Q${quarter}`;
            } else {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${months[date.getMonth()]} ${date.getFullYear()}`;
            }
        };

        let countries = vis.plotArea.selectAll(".country")
            .data(vis.displayData);

        let countriesEnter = countries.enter()
            .append("path")
            .attr("class", "country");

        countries = countriesEnter.merge(countries);

        countries
            .attr("d", vis.path)
            .style("fill", getColor)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);


        // mouseover is dynamic based on which mode is selected to prevent data overload for viewer
        countries
            .on('mouseover', function(event, d) {
                const countryId = d.id;
                const iso3 = isoNumericToISO3[countryId];

                if (iso3 && vis.dataByCountry[iso3]) {
                    const data = vis.dataByCountry[iso3];

                    d3.select(this)
                        .attr('stroke-width', '2px')
                        .attr('stroke', '#333');

                    let tooltipHTML = `<strong>${data.country}</strong><br>`;

                    if (vis.currentMode === 'market') {
                        tooltipHTML += `Crash: ${formatDate(data.mkt_crash_date)} (${d3.format(",")(data.mkt_crash_value)})<br>`;
                        tooltipHTML += `Recovery: ${formatDate(data.mkt_recovery_date)} (${data.mkt_recovery_value ? d3.format(",")(data.mkt_recovery_value) : 'N/A'})<br>`;
                        tooltipHTML += `Duration: ${data.mkt_recovery_months || 'N/A'} months`;
                    } else if (vis.currentMode === 'gdp') {
                        tooltipHTML += `Crash: ${formatDate(data.gdp_crash_date, true)} (${data.gdp_crash_value ? d3.format(",")(data.gdp_crash_value) : 'N/A'})<br>`;
                        tooltipHTML += `Recovery: ${formatDate(data.gdp_recovery_date, true)} (${data.gdp_recovery_value ? d3.format(",")(data.gdp_recovery_value) : 'N/A'})<br>`;
                        tooltipHTML += `Duration: ${data.gdp_recovery_months || 'N/A'} months`;
                    } else {
                        tooltipHTML += `Market Recovery: ${data.mkt_recovery_months || 'N/A'} months<br>`;
                        tooltipHTML += `GDP Recovery: ${data.gdp_recovery_months || 'N/A'} months<br>`;
                        tooltipHTML += `Lead: ${data.lead_months !== null ? data.lead_months + ' months' : 'N/A'}`;
                    }

                    vis.tooltip
                        .style("opacity", 1)
                        .html(tooltipHTML);
                }
            })
            // to follow the cursor
            .on('mousemove', function(event, d) {
                vis.tooltip
                    .style("left", event.pageX + 12 + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                    .attr('stroke', '#fff');

                vis.tooltip.style("opacity", 0);
            });

        countries.exit().remove();

        // legend updates
        // sepcial case for lead since diff scale
        if (vis.currentMode === 'lead') {
            vis.legendTitle.text("Lead Time (months)");

            const numBins = 11;
            const binWidth = 300 / numBins;

            const legendData = vis.colorDiverging.range();

            const rects = vis.legendGroup.selectAll(".legend-rect")
                .data(legendData);

            rects.enter()
                .append("rect")
                .attr("class", "legend-rect")
                .merge(rects)
                .attr("x", (d, i) => i * binWidth)
                .attr("y", 0)
                .attr("width", binWidth)
                .attr("height", 20)
                .attr("fill", d => d);

            rects.exit().remove();

            vis.legendScale.domain([-3, 24]);
            vis.legendAxis.tickValues([-3, 0, 3, 6, 9, 12, 15, 18, 21, 24])
                .tickFormat(d => d + "m");

        } else {
            const modeLabel = vis.currentMode === 'market' ? 'Market' : 'GDP';
            vis.legendTitle.text(`${modeLabel} Recovery Time (months)`);

            const numBins = 8;
            const binWidth = 300 / numBins;

            const legendData = vis.colorSequential.range();

            const rects = vis.legendGroup.selectAll(".legend-rect")
                .data(legendData);

            rects.enter()
                .append("rect")
                .attr("class", "legend-rect")
                .merge(rects)
                .attr("x", (d, i) => i * binWidth)
                .attr("y", 0)
                .attr("width", binWidth)
                .attr("height", 20)
                .attr("fill", d => d);

            rects.exit().remove();

            vis.legendScale.domain([0, 36]);
            vis.legendAxis.tickValues([0, 3, 6, 9, 12, 18, 24, 36])
                .tickFormat(d => d + "m");
        }

        vis.legendAxisGroup.call(vis.legendAxis);
    }

    /*
     * mode change from toggle
     */
    onModeChange(newMode) {
        let vis = this;

        vis.currentMode = newMode;
        vis.wrangleData();
    }
}