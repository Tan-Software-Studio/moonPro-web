const marks = [];

export const mark = (id, time, isBuy) => {
    return {
        id,
        time,
        color: {
            border: isBuy === true ? '#195E54' : '#84303B',
            background: isBuy === true ? '#089880' : '#F23645',
        },
        text: isBuy === true ? ['Developer Buy'] : ['Developer Sell'],
        label: isBuy === true ? 'DB' : 'DS',
        labelFontColor: 'white',
        minSize: 25,
    };
}

// Add a mark object to local store
export const addMark = (id, time, isBuy) => {
  const newMark = mark(id, time, isBuy);
  marks.push(newMark);
};

// Get all stored marks
export const getStoredMarks = () => {
  return [...marks]; // return a copy to avoid direct mutation
};

// Clear all marks from local store
export const clearMarks = () => {
  marks.length = 0; // clear array in-place
};