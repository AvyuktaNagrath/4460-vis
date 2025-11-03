const countryNames = {
    'USA': 'United States',
    'CAN': 'Canada',
    'GBR': 'United Kingdom',
    'DEU': 'Germany',
    'FRA': 'France',
    'ITA': 'Italy',
    'JPN': 'Japan',
    'AUS': 'Australia',
    'NZL': 'New Zealand',
    'KOR': 'South Korea',
    'IDN': 'Indonesia',
    'BRA': 'Brazil',
    'MEX': 'Mexico',
    'RUS': 'Russia',
    'SAU': 'Saudi Arabia',
    'ZAF': 'South Africa',
    'TUR': 'Turkey',
    'IND': 'India',
    'ARG': 'Argentina'
};

// Region mapping
const regionMapping = {
    'USA': 'Americas', 'CAN': 'Americas', 'BRA': 'Americas', 'MEX': 'Americas', 'ARG': 'Americas',
    'GBR': 'EU', 'DEU': 'EU', 'FRA': 'EU', 'ITA': 'EU', 'TUR': 'EU', 'RUS': 'EU',
    'JPN': 'Asia', 'KOR': 'Asia', 'IDN': 'Asia', 'IND': 'Asia', 'SAU': 'Asia',
    'AUS': 'Oceania', 'NZL': 'Oceania',
    'ZAF': 'Africa'
};

// (1) Load data with promises
let promises = [
    d3.csv("data/cleaned_market.csv"),
    d3.csv("data/cleaned_gdp.csv")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    let marketData = data[0];
    let gdpData = data[1];

    console.log("Market data:", marketData);
    console.log("GDP data:", gdpData);

    // (2) Make our data look nicer and more useful
    const isoCodes = Object.keys(marketData[0]).filter(key => key !== 'Date');

    let recoveryData = isoCodes.map(function(iso3) {
        // Check if GDP data exists for this country
        const hasGDP = gdpData[0][iso3] !== undefined;

        // Find baseline (Dec 2019 = 100)
        const mktBaseline = +marketData.find(d => d.Date === '2019-12-31')[iso3];
        const gdpBaseline = hasGDP ? +gdpData.find(d => d.Date === '2019-12-31')[iso3] : null;

        // Find crash date (min in 2020)
        let mktCrash = { date: null, value: Infinity };
        let gdpCrash = { date: null, value: Infinity };

        marketData.forEach(d => {
            if (d.Date.startsWith('2020') && +d[iso3] < mktCrash.value) {
                mktCrash = { date: d.Date, value: +d[iso3] };
            }
        });

        if (hasGDP) {
            gdpData.forEach(d => {
                if (d.Date.startsWith('2020') && +d[iso3] < gdpCrash.value) {
                    gdpCrash = { date: d.Date, value: +d[iso3] };
                }
            });
        }

        // Find recovery date (first >= baseline that stays >= baseline next period)
        let mktRecovery = null;
        let gdpRecovery = null;

        for (let i = 0; i < marketData.length - 1; i++) {
            if (marketData[i].Date >= mktCrash.date &&
                +marketData[i][iso3] >= mktBaseline &&
                +marketData[i+1][iso3] >= mktBaseline) {
                mktRecovery = { date: marketData[i].Date, value: +marketData[i][iso3] };
                break;
            }
        }

        if (hasGDP) {
            for (let i = 0; i < gdpData.length - 1; i++) {
                if (gdpData[i].Date >= gdpCrash.date &&
                    +gdpData[i][iso3] >= gdpBaseline &&
                    +gdpData[i+1][iso3] >= gdpBaseline) {
                    gdpRecovery = { date: gdpData[i].Date, value: +gdpData[i][iso3] };
                    break;
                }
            }
        }

        // Calculate months
        const monthsBetween = (d1, d2) => {
            const date1 = new Date(d1);
            const date2 = new Date(d2);
            return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
        };

        const mktRecoveryMonths = mktRecovery ? monthsBetween(mktCrash.date, mktRecovery.date) : null;
        const gdpRecoveryMonths = gdpRecovery ? monthsBetween(gdpCrash.date, gdpRecovery.date) : null;
        const leadMonths = (mktRecoveryMonths !== null && gdpRecoveryMonths !== null)
            ? gdpRecoveryMonths - mktRecoveryMonths
            : null;

        return {
            iso3,
            country: countryNames[iso3],
            region: regionMapping[iso3],
            mkt_crash_date: mktCrash.date,
            mkt_crash_value: mktCrash.value,
            mkt_recovery_date: mktRecovery?.date,
            mkt_recovery_value: mktRecovery?.value,
            mkt_recovery_months: mktRecoveryMonths,
            gdp_crash_date: gdpCrash.date,
            gdp_crash_value: gdpCrash.value,
            gdp_recovery_date: gdpRecovery?.date,
            gdp_recovery_value: gdpRecovery?.value,
            gdp_recovery_months: gdpRecoveryMonths,
            lead_months: leadMonths
        };
    });

    console.log("Recovery data:", recoveryData);
    console.table(recoveryData);

    // (3) Create visualization instance
    let globalMapVis = new GlobalMapVis("vis-an6", recoveryData);
}