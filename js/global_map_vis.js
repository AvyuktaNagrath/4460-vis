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

class GlobalMapVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.currentMode = 'gdp'; // 'gdp' 'market' 'lead' are the three modes to toggle

        this.focusedRegion = null; // for country select

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


        // init takeaway box
        // just using html inject because text wouldn't wrap properly otherwise
        vis.infoSvg = d3.select("#vis-an6-info");
        const viewBox2 = vis.infoSvg.attr("viewBox").split(" ");
        vis.infoW = +viewBox2[2];
        vis.infoH = +viewBox2[3];

        vis.infoFO = vis.infoSvg.selectAll("foreignObject.info")
            .data([0])
            .join(enter => enter.append("foreignObject")
                .attr("class","info")
                .attr("x", 0).attr("y", 0)
                .attr("width", vis.infoW)
                .attr("height", vis.infoH));

        vis.infoDiv = d3.select(vis.infoFO.node())
            .selectAll("div")
            .data([0])
            .join(enter => enter.append("xhtml:div")
                .style("padding","16px")
                .style("font-family","Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"));

        vis.panelTitleEl = vis.infoDiv.selectAll("h2.frame-title")
            .data([0])
            .join(enter => enter.append("xhtml:h2")
                .attr("class", "frame-title")
                .style("margin", "0 0 6px 0")
                .style("font-size", "18px")
                .style("font-weight", "700")
                .style("color", "#0f172a")
                .text("Global Recovery Comparison - GDP vs. Markets")
            );

        vis.mapHelperEl = vis.infoDiv.selectAll("div.map-helper")
            .data([0])
            .join(enter => enter.append("xhtml:div")
                .attr("class", "map-helper")
                .style("background", "#f0f9ff")
                .style("border", "1px solid #bae6fd")
                .style("border-radius", "6px")
                .style("padding", "10px 12px")
                .style("margin", "16px 0 16px 0")
                .style("font-size", "13px")
                .style("color", "#075985")
            );

        vis.mapHelperEl.append("xhtml:p")
            .style("margin", "0")
            .style("font-weight", "600")
            .html("<strong>Interactive Map:</strong> Hover over any country to see its detailed recovery stats. " +
                "Use the buttons above (GDP Recovery, Market Recovery, or Lead) to switch the map’s metric and update the visualization.");

        vis.titleEl = vis.infoDiv.selectAll("h3.mode-title")
            .data([0])
            .join(enter => enter.append("xhtml:h3")
                .attr("class","mode-title")
                .style("margin","0 0 8px 0")
                .style("font-size","16px")
                .style("font-weight","600")
                .style("color","#111827"));

        vis.paraEl = vis.infoDiv.selectAll("p.mode-para")
            .data([0])
            .join(enter => enter.append("xhtml:p")
                .attr("class","mode-para")
                .style("margin","0")
                .style("font-size","12px")
                .style("line-height","1.5")
                .style("color","#374151"));
        vis.tableHelperEl = vis.infoDiv.selectAll("div.table-helper")
            .data([0])
            .join(enter => enter.append("xhtml:div")
                .attr("class", "table-helper")
                .style("background", "#f0f9ff")
                .style("border", "1px solid #bae6fd")
                .style("border-radius", "6px")
                .style("padding", "10px 12px")
                .style("margin", "16px 0 0 0")
                .style("font-size", "13px")
                .style("color", "#075985")
            );
        vis.tableHelperEl.append("xhtml:p")
            .style("margin", "0")
            .style("font-weight", "600")
            .html("<strong>Interactive Table:</strong> Click any region row below to focus the map. Use clear button to clear region focus");

        // region summary panel
        vis.tableEl = vis.infoDiv.selectAll("table.region-table")
            .data([0])
            .join(enter => enter.append("xhtml:table")
                .attr("class","region-table")
                .style("width","100%")
                .style("margin","12px 0 0 0")
                .style("border-collapse","collapse")
                .style("font-size","12px")
            );

        const headerCols = ["Region","#","Mean Months","Median Months","Min","Max"];

        vis.theadEl = vis.tableEl.selectAll("thead").data([0])
            .join(enter => enter.append("xhtml:thead"));

        vis.theadEl.selectAll("tr").data([0])
            .join(enter => enter.append("xhtml:tr"))
            .selectAll("th")
            .data(headerCols)
            .join(enter => enter.append("xhtml:th")
                .style("text-align","left")
                .style("font-weight","600")
                .style("color","#111827")
                .style("padding","6px 8px")
                .style("border-bottom","1px solid #e5e7eb")
                .text(d => d)
            );

        vis.tbodyEl = vis.tableEl.selectAll("tbody").data([0])
            .join(enter => enter.append("xhtml:tbody"));

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

    updateVis() {
        let vis = this;


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

        const featureRegion = (feature) => {
            const iso3 = isoNumericToISO3[feature.id];
            const row = iso3 && vis.dataByCountry[iso3];
            return row ? row.region : null;
        };
        const baseOpacity = d => (!vis.focusedRegion || featureRegion(d) === vis.focusedRegion) ? 1 : 0.25;
        // accentuate focused region
        const baseStroke = d => {
            const r = featureRegion(d);
            if (vis.focusedRegion && r === vis.focusedRegion) return "#000";
            return "#d1d5db";
        };
        const baseStrokeW = d => (!vis.focusedRegion || featureRegion(d) === vis.focusedRegion) ? 1 : 0.5;

        countries
            .attr("d", vis.path)
            .style("fill", getColor)
            .style("opacity", baseOpacity)
            .attr("stroke", baseStroke)
            .attr("stroke-width", baseStrokeW);


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
                    .attr('stroke', baseStroke(d))
                    .attr('stroke-width', baseStrokeW(d));

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

        // takeaway paragraphs
        vis.titleEl.text(this.getTakeawayTitle());
        vis.paraEl.text(this.getTakeawayText());

        // table

        const stats = this.computeRegionStats();
        const fmtInt = d3.format("d");
        const fmt1   = d => isNaN(d) ? "—" : d3.format(".1f")(d);

        const rows = vis.tbodyEl.selectAll("tr")
            .data(stats, d => d.region);

        vis.clearBtn = vis.infoDiv.selectAll("button.clear-focus")
            .data([0])
            .join(enter => enter.append("xhtml:button")
                .attr("class","clear-focus")
                .style("margin","8px 0 0 0")
                .style("padding","4px 8px")
                .style("font-size","12px")
                .style("border","1px solid #e5e7eb")
                .style("border-radius","6px")
                .style("background","#f8fafc")
                .style("cursor","pointer")
                .text("Clear region focus")
                .on("click", () => this.clearFocus())
            );

        const rowsEnter = rows.enter()
            .append("xhtml:tr")
            .style("cursor","pointer")
            .on("click", (event, d) => this.focusByRegion(d.region));

        rowsEnter.merge(rows)
            .style("background-color", d => d.region === this.focusedRegion ? "#eef2ff" : null);

        rows.exit().remove();

        const cols = [
            d => d.region,
            d => fmtInt(d.n),
            d => fmt1(d.mean),
            d => fmt1(d.median),
            d => fmt1(d.min),
            d => fmt1(d.max)
        ];

        const cells = rowsEnter.merge(rows).selectAll("td")
            .data(d => cols.map(f => f(d)));

        cells.enter()
            .append("xhtml:td")
            .style("padding","6px 8px")
            .style("border-bottom","1px solid #f1f5f9")
            .style("color","#374151")
            .merge(cells)
            .text(d => d);

        cells.exit().remove();


    }

    //text getters for cleanliness

    getTakeawayTitle() {
        if (this.currentMode === 'market') {
            return "Market Recovery";
        }
        else if (this.currentMode === 'gdp'){
            return "GDP Recovery";
        }
        return "Lead: Market – GDP";
    }
    getTakeawayText() {
        if (this.currentMode === 'market'){
            return "This map shows how many months it took each country's equity market to recover back to its pre COVID crash baseline. We measure recovery as the first period where the index returns to its December 2019 level and then stays above that level for at least one additional observation. Market index history for each country was fetched individually from Stooq, then combined into a standardized structure. The major insight is that market recoveries were generally much faster, and treated the shock as temporary far earlier than GDP did, even though fundamentals had not stabilized yet.";
        }
        else if (this.currentMode === 'gdp'){
            return "This map shows how many months it took each country's real GDP to recover to its pre COVID crash baseline. We use quarterly OECD GDP, except for a few gaps (for example Russia) which did not meaningfully affect this study’s 2020 centered window. China was excluded due to missing compatible baseline structure and because it would behave as its own systemic outlier. The major insight is that GDP recovery was structurally slower and reflected real output healing, not investor expectations, and this lag is what creates the divergence pattern we are focusing on.";
        }

        return "This map shows the difference between how fast markets recovered and how fast GDP recovered, measured in months (GDP months minus Market months). The lead is computed purely as subtraction of the two recovery durations. India and Indonesia were the only cases where markets lagged behind GDP. In nearly every other country, markets recovered first, and in South Africa the lead reached as extreme as 21 months. The major insight is that lead is the most direct visualization of how detached market forward pricing was relative to real world economic repair.";
    }






    // focus helpers
    focusByRegion(region) {
        this.focusedRegion = region;
        this.updateVis();
    }
    clearFocus() {
        this.focusedRegion = null;
        this.updateVis();
    }


    // avg helper
    computeRegionStats() {
        const key = this.currentMetric;

        const grouped = d3.rollups(
            this.data.filter(d => d[key] != null),
            v => {
                const vals = v.map(d => +d[key]).sort(d3.ascending);
                return {
                    n: vals.length,
                    mean: d3.mean(vals),
                    median: d3.median(vals),
                    min: d3.min(vals),
                    max: d3.max(vals)
                };
            },
            d => d.region
        );

        const rows = grouped.map(([region, s]) => ({ region, ...s }));
        rows.sort((a, b) => d3.ascending(a.region, b.region));
        return rows;
    }

    // toggle mode change
    onModeChange(newMode) {
        let vis = this;

        vis.currentMode = newMode;
        vis.wrangleData();
    }
}