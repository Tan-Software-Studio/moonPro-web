function graduatedFilterData(memescopePage) {
    return {
        Title: memescopePage?.mainHeader?.filters?.graduated,
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
                secondInputIcon: "",
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
                firstInputIcon: "",
                secondInputName: "Max",
                secondInputIcon: "",
                type: "number",
            },
            {
                id: "10",
                title: "MKT",
                name: memescopePage?.mainHeader?.filters?.newcreation?.bymCap,
                firstInputName: "Min",
                firstInputIcon: "",
                secondInputName: "Max",
                secondInputIcon: "",
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

const initialGraduatedDataFilterValues = {
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

function checkIfGraduatedDataFiltersExist(filters) {
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

function getGraduatedDataFieldName(filterName) {
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


function applyAllGraduatedDataFilters(dataArray, filters) {
    let result = [...dataArray];

    // Boolean filters (checkboxes)
    if (filters.top10holders?.checked) {
        result = result.filter((item) => item?.isTop10Holder === true);
    }

    if (filters.withatleast1social?.checked) {
        result = result.filter((item) => item?.hasSocialMedia === true);
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
        const fieldName = getGraduatedDataFieldName(filterName);

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

function saveGraduatedDataFiltersToStorage(filters) {
    try {
        localStorage.setItem("graduatedDataFilters", JSON.stringify(filters));
    } catch (error) {
        console.error("Could not save new data filters:", error);
    }
}

// Get filters
function loadGraduatedDataFiltersFromStorage() {
    try {
        const saved = localStorage.getItem("graduatedDataFilters");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error("Could not load new data filters:", error);
    }
    return null;
}

// Remove filters
function clearGraduatedDataFiltersFromStorage() {
    try {
        localStorage.removeItem("graduatedDataFilters");
    } catch (error) {
        console.error("Could not clear new data filters:", error);
    }
}

function applyGraduatedDataFilters(graduatedDataFilterValues, Graduateddata, setFilteredGraduatedData, setGraduatedDataFiltersApplied) {
    const hasFilters = checkIfGraduatedDataFiltersExist(graduatedDataFilterValues);

    if (hasFilters) {
        // Apply filters to data
        const filteredResult = applyAllGraduatedDataFilters(Graduateddata, graduatedDataFilterValues);
        setFilteredGraduatedData(filteredResult);
        setGraduatedDataFiltersApplied(true);

        // Save to storage
        saveGraduatedDataFiltersToStorage(graduatedDataFilterValues);
    } else {
        setFilteredGraduatedData([]);
        setGraduatedDataFiltersApplied(false);

        // Remove localStorage
        clearGraduatedDataFiltersFromStorage();
    }
}

function resetGratuatedDataFilters(setGraduatedDataFiltersApplied, setGraduatedDataFilterValues, setFilteredGraduatedData, ) {
    setGraduatedDataFilterValues(initialGraduatedDataFilterValues);
    setFilteredGraduatedData([]);
    setGraduatedDataFiltersApplied(false);
    clearGraduatedDataFiltersFromStorage();
}

export {
    graduatedFilterData,
    initialGraduatedDataFilterValues,
    checkIfGraduatedDataFiltersExist,
    applyAllGraduatedDataFilters,
    saveGraduatedDataFiltersToStorage,
    loadGraduatedDataFiltersFromStorage,
    clearGraduatedDataFiltersFromStorage,
    getGraduatedDataFieldName,
    applyGraduatedDataFilters,
    resetGratuatedDataFilters

};