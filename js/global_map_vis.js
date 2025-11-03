class GlobalMapVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.currentMode = 'gdp'; // 'gdp' 'market' 'lead' are the three modes to toggle

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Get the SVG element (already exists in HTML)
        vis.svg = d3.select("#" + vis.parentElement);

        // Get viewBox dimensions
        const viewBox = vis.svg.attr("viewBox").split(" ");
        vis.width = +viewBox[2];
        vis.height = +viewBox[3];

        // Get the plot area group
        vis.plotArea = vis.svg.select(".plot-area");

        // Create map projection (Mercator for rectangular world map)
        vis.projection = d3.geoMercator()
            .scale(150)
            .translate([vis.width / 2, vis.height / 1.5]);

        vis.path = d3.geoPath().projection(vis.projection);

        // Color scales using D3 built-in schemes
        vis.colorSequential = d3.scaleThreshold()
            .domain([3, 6, 9, 12, 18, 24, 36])
            .range(d3.schemeBlues[8]);

        vis.colorDiverging = d3.scaleThreshold()
            .domain([-36, -24, -18, -12, -9, -6, -3, 0, 3, 6, 9, 12, 18, 24, 36])
            .range(d3.schemeRdBu[11]);

        vis.noRecoveryColor = "#e5e7eb";
        vis.noDataColor = "#f3f4f6";

        // Create tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')
            .style("opacity", 0);

        // Load TopoJSON world data
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
            vis.countries = topojson.feature(world, world.objects.countries).features;

            console.log("Loaded world map:", vis.countries);

            // Create lookup for our recovery data by ISO3
            vis.dataByCountry = {};
            vis.data.forEach(d => {
                vis.dataByCountry[d.iso3] = d;
            });

            vis.wrangleData();
        });

        // TODO: Create legend
        // TODO: Create toggle buttons
        // TODO: Create takeaway box
        // TODO: Create region summary panel
    }

    updateVis() {
        let vis = this;

        // ISO numeric code to ISO3 mapping for our countries
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

        // Helper function to get color for a country
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

        // Helper to format dates
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

        // Draw countries with enter-update-exit pattern
        let countries = vis.plotArea.selectAll(".country")
            .data(vis.displayData);

        // Enter
        let countriesEnter = countries.enter()
            .append("path")
            .attr("class", "country");

        // Merge and update
        countries = countriesEnter.merge(countries);

        countries
            .attr("d", vis.path)
            .style("fill", getColor)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);

        // Add event handlers
        countries
            .on('click', function(event, d) {
                console.log("CLICK WORKS!", d);
            })
            .on('mouseover', function(event, d) {
                console.log("Mouseover triggered!");

                const countryId = d.id;
                const iso3 = isoNumericToISO3[countryId];

                console.log("Country ID:", countryId, "ISO3:", iso3);

                if (iso3 && vis.dataByCountry[iso3]) {
                    const data = vis.dataByCountry[iso3];

                    d3.select(this)
                        .attr('stroke-width', '2px')
                        .attr('stroke', 'black');

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>${data.country}</h3>
                            <h4>Market: bottom ${formatDate(data.mkt_crash_date)} → recovered ${formatDate(data.mkt_recovery_date)} (${data.mkt_recovery_months || 'N/A'}m)</h4>
                            <h4>GDP: bottom ${formatDate(data.gdp_crash_date, true)} → recovered ${formatDate(data.gdp_recovery_date, true)} (${data.gdp_recovery_months || 'N/A'}m)</h4>
                            <h4>Lead: ${data.lead_months !== null ? data.lead_months + 'm' : 'N/A'}</h4>
                        </div>
                    `);
                }
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                    .attr('stroke', '#fff');

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        // Exit
        countries.exit().remove();
    }

    /*
     * Data wrangling
     */
    wrangleData() {
        let vis = this;

        // Wait until countries are loaded
        if (!vis.countries) return;

        // Get current metric based on mode
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
     * Handle mode change from toggle
     */
    onModeChange(newMode) {
        let vis = this;

        vis.currentMode = newMode;
        vis.wrangleData();
    }
}