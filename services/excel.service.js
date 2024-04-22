const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Function to filter rows based on employee IDs
function filterRowsByEmpId(worksheet, empIdList) {
    return worksheet.filter(row => (empIdList.includes(row.EmpID)));

}

// Function to write filtered rows to a new Excel file
async function writeToExcel(inputFilePath, filteredRows, fileName) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    // Get the first worksheet in the workbook
    const worksheet = workbook.getWorksheet(1);

    // Create a new worksheet for the filtered data
    const filteredWorksheet = workbook.addWorksheet('FilteredData');

    // Copy headers to the filtered worksheet
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1) { // Only copy headers from the first row
            row.eachCell((cell, colNumber) => {
                filteredWorksheet.getColumn(colNumber).key = cell.value;
            });
        }
    });

    // Add filtered rows to the filtered worksheet
    filteredRows.forEach(row => {
        filteredWorksheet.addRow(row);
    });

    // Save to file
    const timestamp = Date.now();
    const formattedFileName = `${timestamp}-${fileName}`;
    await workbook.xlsx.writeFile(path.join(__dirname, '../uploads', formattedFileName));
}

// Function to read Excel file and return filtered rows
async function readFilteredRows(filePath, empIdList) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1 && empIdList.includes(row.getCell('C').value)) { // Skip header row and filter rows
            const rowData = {};
            row.eachCell((cell, colNumber) => {
                rowData[worksheet.getColumn(colNumber).name] = cell.value;
            });
            rows.push(rowData);
        }
    });
    return rows;
}

// Read the Excel files and return filtered rows
async function getFilteredRows(projectAFilePath, projectBFilePath, projectAIds, projectBIds) {
    const projectARows = await readFilteredRows(projectAFilePath, projectAIds);
    const projectBRows = await readFilteredRows(projectBFilePath, projectBIds);
    return { projectA: projectARows, projectB: projectBRows };
}

// Read the Excel file, filter rows, and save to separate Excel files
async function splitExcelFile(inputFilePath, projectAIds, projectBIds) {



    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);

    const worksheet = workbook.getWorksheet(1);
    // Convert worksheet to JSON

    const rows = [];

    // worksheet.eachRow((row, rowNumber) => {
    //     if (rowNumber) { // Skip header row
    //         rows.push({
    //             EmpID: row.getCell('C').value // Assuming EmpId is in column A, adjust accordingly
    //             // Add other columns here as needed
    //         });
    //     }
    // });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) { // Skip header row
            rows.push(row.getCell('C').value); // Assuming EmpID is in column B
        }
    });


    const smartShip = [
        { "EmpId": "ITP 1028" },
        { "EmpId": "ITP 1030" },
        { "EmpId": "ITP 1038" },
        { "EmpId": "ITP 1248" },
        { "EmpId": "ITP 1283" },
        { "EmpId": "ITP 1332" },
        { "EmpId": "ITP 1463" },
        { "EmpId": "ITP 1471" },
        { "EmpId": "ITP 1482" },
        { "EmpId": "ITP 1514" },
        { "EmpId": "ITP 1519" },
        { "EmpId": "TATP 1196" },
        { "EmpId": "IBTP 1539" },
        { "EmpId": "IBTP 1207" },
        { "EmpId": "IBTP 1215" }
    ]
    const smartVoyager = [
        { "EmpId": "IATP 1534" },
        { "EmpId": "IATP 1706" },
        { "EmpId": "CATP 1330" },
        { "EmpId": "IATP 1527" },
        { "EmpId": "IATP 1557" },
        { "EmpId": "IATP 1564" },
        { "EmpId": "IATP 1569" },
        { "EmpId": "IATP 1574" },
        { "EmpId": "CATP 1152" },
        { "EmpId": "IATP 1578" },
        { "EmpId": "IATP 1526" },
        { "EmpId": "IATP 1582" },
        { "EmpId": "CATP 1201" },
        { "EmpId": "CATP 1215" }
    ]


    const smartShipEmpIds = smartShip.map(entry => entry.EmpId);
    const smartVoyagerEmpIds = smartVoyager.map(entry => entry.EmpId);

    console.log("Smart Ship EmpIds:", smartShipEmpIds);
    console.log("Smart Voyager EmpIds:", smartVoyagerEmpIds);

    // Filter rows for project A and project B based on EmpIDs
    const projectARows = rows.filter(empId => {
        console.log("Current EmpId for project A:", empId);
        return smartShipEmpIds.includes(empId);
    });
    const projectBRows = rows.filter(empId => {
        console.log("Current EmpId for project B:", empId);
        return smartVoyagerEmpIds.includes(empId);
    });

    console.log("Project A Rows:", projectARows);
    console.log("Project B Rows:", projectBRows);




    

    await writeToExcel(inputFilePath, projectARows, 'ProjectA.xlsx');
    await writeToExcel(inputFilePath, projectBRows, 'ProjectB.xlsx');

    return {
        success: true,
        message: 'Excel files generated successfully.',
        projectAFile: 'ProjectA.xlsx',
        projectBFile: 'ProjectB.xlsx'
    };
}

module.exports = {
    splitExcelFile,
    getFilteredRows // Exporting the getFilteredRows function for use in other parts of your application if needed
};
