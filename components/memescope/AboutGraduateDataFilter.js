function aboutGraduateFilterData(memescopePage) {

    return {
        Title: memescopePage?.mainHeader?.filters?.abouttograduate,
        FilterInput: [
            {
                id: "1",
                name: memescopePage?.mainHeader?.filters?.newcreation?.top10holders,
                title: "top10holders",
                type: "checkbox",
            },
            {
                id: "2",
                name: memescopePage?.mainHeader?.filters?.newcreation?.withatleast1social,
                title: "withatleast1social",
                type: "checkbox",
            },
        ],
        FromToFilter: [
            {
                id: "3",
                title: "progress",
                name: memescopePage?.mainHeader?.filters?.newcreation?.bypumpprogress,
                firstInputName: "Min",
                firstInputIcon: "%",
                secondInputName: "Max",
                secondInputIcon: "%",
                type: "number",
            },
            {
                id: "4",
                title: "holders",
                name: memescopePage?.mainHeader?.filters?.newcreation?.byholderscount,
                firstInputName: "Min",
                firstInputIcon: "",
                secondInputName: "Max",
                secondInputIcon: "",
                type: "number",
            },
            // {
            //     id: "5",
            //     title: "holding",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bydevholding,
            //     firstInputName: "Min",
            //     firstInputIcon: "",
            //     secondInputName: "Max",
            //     secondInputIcon: "",
            //     type: "number",
            // },
            // {
            //     id: "6",
            //     title: "snipers",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bysnipers,
            //     firstInputName: "Min",
            //     firstInputIcon: "$",
            //     secondInputName: "Max",
            //     secondInputIcon: "$",
            //     type: "number",
            // },
            {
                id: "7",
                title: "age",
                name: memescopePage?.mainHeader?.filters?.newcreation?.byage,
                firstInputName: "Min",
                firstInputIcon: "",
                secondInputName: "Max",
                secondInputIcon: "",
                type: "number",
            },
            // {
            //     id: "8",
            //     title: "liquidity",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bycurrentliquidity,
            //     firstInputName: "Min",
            //     firstInputIcon: "$",
            //     secondInputName: "Max",
            //     secondInputIcon: "$",
            //     type: "number",
            // },
            {
                id: "9",
                title: "volume",
                name: memescopePage?.mainHeader?.filters?.newcreation?.byvolume,
                firstInputName: "Min",
                firstInputIcon: "$",
                secondInputName: "Max",
                secondInputIcon: "$",
                type: "number",
            },
            {
                id: "10",
                title: "MKT",
                name: memescopePage?.mainHeader?.filters?.newcreation?.bymCap,
                firstInputName: "Min",
                firstInputIcon: "$",
                secondInputName: "Max",
                secondInputIcon: "$",
                type: "number",
            },
            // {
            //     id: "11",
            //     title: "TXNS",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bytx,
            //     firstInputName: "Min",
            //     firstInputIcon: "",
            //     secondInputName: "Max",
            //     secondInputIcon: "",
            //     type: "number",
            // },
            // {
            //     id: "12",
            //     title: "buys",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bybuys,
            //     firstInputName: "Min",
            //     firstInputIcon: "",
            //     secondInputName: "Max",
            //     secondInputIcon: "",
            //     type: "number",
            // },
            // {
            //     id: "13",
            //     name: memescopePage?.mainHeader?.filters?.newcreation?.bysells,
            //     title: "sells",
            //     firstInputName: "Min",
            //     firstInputIcon: "",
            //     secondInputName: "Max",
            //     secondInputIcon: "",
            //     type: "number",
            // },
        ]
    }
};

// filter data  
const initialAboutGraduatDataFilterValues = {
    top10holders: { checked: false },
    withatleast1social: { checked: false },
    progress: { min: "", max: "" },
    holders: { min: "", max: "" },
    holding: { min: "", max: "" },
    snipers: { min: "", max: "" },
    age: { min: "", max: "" },
    liquidity: { min: "", max: "" },
    volume: { min: "", max: "" },
    MKT: { min: "", max: "" },
    TXNS: { min: "", max: "" },
    buys: { min: "", max: "" },
    sells: { min: "", max: "" },
};

// Check if user set any filters
function checkIfAboutGraduatDataFiltersExist(filters) {
    // Check checkboxes
    if (filters.top10holders?.checked) return true;
    if (filters.withatleast1social?.checked) return true;

    // Check number inputs
    if (filters.progress?.min || filters.progress?.max) return true;
    if (filters.holders?.min || filters.holders?.max) return true;
    if (filters.holding?.min || filters.holding?.max) return true;
    if (filters.snipers?.min || filters.snipers?.max) return true;
    if (filters.age?.min || filters.age?.max) return true;
    if (filters.liquidity?.min || filters.liquidity?.max) return true;
    if (filters.volume?.min || filters.volume?.max) return true;
    if (filters.MKT?.min || filters.MKT?.max) return true;
    if (filters.TXNS?.min || filters.TXNS?.max) return true;
    if (filters.buys?.min || filters.buys?.max) return true;
    if (filters.sells?.min || filters.sells?.max) return true;

    return false;
}

// field name which is cominh from API
function getAboutGraduatDataFieldName(filterName) {
    const fieldMap = {
        progress: "bonding_curv",
        holders: "holders",
        // holding: "devHolding",
        // snipers: "snipers",
        age: "created_time",
        // liquidity: "liquidity",
        volume: "volume",
        MKT: "MKC",
        // TXNS: "transactions",
        // buys: "buys",
        // sells: "sells",
    };
    return fieldMap[filterName] || filterName;
}

// Apply all filters
function applyAllAboutGraduatDataFilters(dataArray, filters) {
    let result = [...dataArray];

    if (filters.top10holders?.checked) {
        result = result.filter((item) => item?.holders > 10);
    }

    if (filters.withatleast1social?.checked) {
        result = result.filter((item) => item?.socialIconsLink?.length > 0);
    } 

    // Number filters (min/max ranges)
    const numberFilters = [
        "progress",
        "holders",
        // "holding",
        // "snipers",
        "age",
        // "liquidity",
        "volume",
        "MKT",
        // "TXNS",
        // "buys",
        // "sells",
    ];

    numberFilters.forEach((filterName) => {
        const fieldName = getAboutGraduatDataFieldName(filterName);

        // Apply minimum filter
        if (filters[filterName]?.min) {
            result = result.filter((item) => {
                let value = Number(item?.[fieldName]);

                // covert in miniutes
                if (filterName === "age") {
                    const now = Date.now();
                    const ageInMs = now - value;
                    value = Math.floor(ageInMs / (1000 * 60));
                }

                const minValue = Number(filters[filterName].min);
                return value >= minValue;
            });
        }

        // Apply maximum filter
        if (filters[filterName]?.max) {
            result = result.filter((item) => {
                let value = Number(item?.[fieldName]);

                // covert in miniutes)
                if (filterName === "age") {
                    const now = Date.now();
                    const ageInMs = now - value;
                    value = Math.floor(ageInMs / (1000 * 60));
                }

                const maxValue = Number(filters[filterName].max);
                return value <= maxValue;
            });
        }
    });

    return result;
}
// === localStorage manipulation ===  \\


// Save filters
function saveAboutGraduatDataFiltersToStorage(filters) {
    try {
        localStorage.setItem("aboutGraduatDataFilters", JSON.stringify(filters));
    } catch (error) {
        console.error("Could not save new data filters:", error);
    }
}

// Get filters
function loadAboutGraduatDataFiltersFromStorage() {
    try {
        const saved = localStorage.getItem("aboutGraduatDataFilters");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error("Could not load new data filters:", error);
    }
    return null;
}

// Remove filters
function clearAboutGraduatDataFiltersFromStorage() {
    try {
        localStorage.removeItem("aboutGraduatDataFilters");
    } catch (error) {
        console.error("Could not clear new data filters:", error);
    }
}

function applyAboutGraduatDataFilters(aboutGraduateDataFilterValues, Graduatedata, setFilteredAboutGraduatData, setaboutGraduateDataFiltersApplied) {
    const hasFilters = checkIfAboutGraduatDataFiltersExist(aboutGraduateDataFilterValues);

    if (hasFilters) {
        // Apply filters to data
        const filteredResult = applyAllAboutGraduatDataFilters(Graduatedata, aboutGraduateDataFilterValues);
        setFilteredAboutGraduatData(filteredResult);
        setaboutGraduateDataFiltersApplied(true);

        // Save to storage
        saveAboutGraduatDataFiltersToStorage(aboutGraduateDataFilterValues);
    } else {
        setFilteredAboutGraduatData([]);
        setaboutGraduateDataFiltersApplied(false);

        // Remove localStorage
        clearAboutGraduatDataFiltersFromStorage();
    }
}
function resetAboutGraduatDataFilters(setAboutGraduateDataFilterValues, setFilteredAboutGraduatData, setaboutGraduateDataFiltersApplied) {
    setAboutGraduateDataFilterValues(initialAboutGraduatDataFilterValues);
    setFilteredAboutGraduatData([]);
    setaboutGraduateDataFiltersApplied(false);
    clearAboutGraduatDataFiltersFromStorage();
}

export {
    aboutGraduateFilterData,
    initialAboutGraduatDataFilterValues,
    checkIfAboutGraduatDataFiltersExist,
    getAboutGraduatDataFieldName,
    applyAllAboutGraduatDataFilters,
    saveAboutGraduatDataFiltersToStorage,
    loadAboutGraduatDataFiltersFromStorage,
    clearAboutGraduatDataFiltersFromStorage,
    applyAboutGraduatDataFilters,
    resetAboutGraduatDataFilters
};