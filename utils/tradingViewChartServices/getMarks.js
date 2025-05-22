import { getStoredMarks } from "./mark";

export const getMarks = (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
) => {
    onDataCallback(
        getStoredMarks()
    );
};