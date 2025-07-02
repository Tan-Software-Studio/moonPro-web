
const FilterInput = [
    {
        id: "1",
        name: "Top 10 Holders",
        type: "checkbox",
    },
    {
        id: "2",
        name: "With at least 1 social",
        type: "checkbox",
    }
]

// New Creations data input
const FromToFilter = [
    {
        id: "3",
        title: "progress",
        name: "By Pump progress %",
        firstInputName: "Min",
        firstInputIcon: "%",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "4",
        title: "Holders",
        name: "By Holders Count",
        firstInputName: "Min",
        firstInputIcon: "%",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "5",
        title: "holding",
        name: "By Dev holding %",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "6",
        title: "Snipers",
        name: "By Snipers",
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
    },
    {
        id: "7",
        title: "Age",
        name: "By Age (mins)",
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
    },
    {
        id: "8",
        title: "Liquidity",
        name: "By Current Liquidity($)",
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
    },
    {
        id: "9",
        title: "Volume",
        name: "By Volume",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "10",
        title: "MKT",
        name: "By MKT Cap",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "11",
        title: "TXNS",
        name: "By TXNS",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "12",
        title: "Buys",
        name: "By Buys",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    },
    {
        id: "13",
        title: "Sells",
        name: "By Sells",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
    }

]
// Memescope page

// New Creations data
const NewCreationFilterData = {
    Title: "New Creations Filter",
    FilterInput,
    FromToFilter
}
// About to Graduate data
const AboutGraduate = {
    Title: "About to Graduate",
    FilterInput,
    FromToFilter
}
// Graduated data
const Graduate = {
    Title: "Graduated",
    FilterInput,
    FromToFilter
}

// Newpiars data

const NewPairs = {
    Title: "Filter",
    FilterInput: [
        {
            id: "1",
            name: "Mint Auth",
            type: "checkbox",
        },
        {
            id: "2",
            name: "Freeze Auth",
            type: "checkbox",
        },
        {
            id: "3",
            name: "LP Burned",
            type: "checkbox",
        },
        {
            id: "4",
            name: "With at least 1 social",
            type: "checkbox",
        },
    ],
    FromToFilter: [
        {
            id: "5",
            title: "Liquidity",
            name: "By Current Liquidity($)",
            firstInputName: "Min",
            firstInputIcon: "$",
            secondInputName: "Max",
            secondInputIcon: "$",
            type: "number",
        },
        {
            id: "6",
            title: "Volume",
            name: "By Volume",
            firstInputName: "Min",
            firstInputIcon: "%",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "7",
            title: "Age",
            name: "By Age (mins)",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "8",
            title: "MKT",
            name: "By MKT Cap",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "9",
            title: "TXNS",
            name: "By TXNS",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "10",
            title: "Buys",
            name: "By Buys",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "11",
            title: "Sells",
            name: "By Sells",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
    ]
}

// ---Trendings---
const Trendings = {
    Title: "Filter",
    FilterInput: [
        {
            id: "1",
            name: "Mint Auth",
            type: "checkbox",
            infotipString: "The token can’t be minted anymore — no one can create new tokens."
        },
        {
            id: "2",
            name: "Freeze Auth",
            type: "checkbox",
            infotipString: "No one can freeze token transfers."
        },
        {
            id: "3",
            name: "LP Burned",
            type: "checkbox",
            infotipString: " Liquidity Pool tokens were burned — this helps lock the liquidity in place."
        },
        {
            id: "4",
            name: "With at least 1 social",
            type: "checkbox",
        },
    ],
    FromToFilter: [
        {
            id: "5",
            title: "Liquidity",
            name: "By Current Liquidity($)",
            firstInputName: "Min",
            firstInputIcon: "$",
            secondInputName: "Max",
            secondInputIcon: "$",
            type: "number",
        },
        {
            id: "6",
            title: "Volume",
            name: "By Volume",
            firstInputName: "Min",
            firstInputIcon: "%",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "7",
            title: "Age",
            name: "By Age (mins)",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "8",
            title: "MKT",
            name: "By MKT Cap",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "9",
            title: "TXNS",
            name: "By TXNS",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "10",
            title: "Buys",
            name: "By Buys",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
        {
            id: "11",
            title: "Sells",
            name: "By Sells",
            firstInputName: "Min",
            firstInputIcon: "",
            secondInputName: "Max",
            secondInputIcon: "",
            type: "number",
        },
    ]
}



export const FilterSidebarData = {
    NewCreationFilterData,
    AboutGraduate,
    Graduate,
    NewPairs,
    Trendings
}