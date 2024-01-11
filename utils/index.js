export const calculateAverage = (tableData, columnName) => {
    console.log(tableData)
    const columnValues = tableData.map((row) => row[columnName]);

    const numericValues = columnValues.filter((value) => !isNaN(parseFloat(value)));

    if (numericValues.length === 0) {
        console.log(`No numeric values found in column ${columnName}`);
        return null;
    }

    const sum = numericValues.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = sum / numericValues.length;
    return average.toFixed(2);
};

export const searchTable = (tableData, searchTerm) => {
    const filteredRows = tableData.filter((row) =>
        Object.values(row).some((cellValue) => {
            if (typeof cellValue === 'string') {
                return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (typeof cellValue === 'number') {
                return cellValue === parseFloat(searchTerm);
            }
            return false;
        })
    );

    return filteredRows;
};
