import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useContext } from 'react';
import { Context } from '../contexts/Context';
export const calculateAveragePercentage = (tableData, columnName) => {
    const columnValues = tableData.map((row) => row[columnName]);

    const numericValues = columnValues.filter((value) => !isNaN(parseFloat(value)));

    if (numericValues.length === 0) {
        console.log(`No numeric values found in column ${columnName}`);
        return null;
    }

    const sum = numericValues.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = (sum / numericValues.length)*100;
    return average.toFixed(2);
};

export const calculateAverage = (tableData, columnName) => {
    const columnValues = tableData.map((row) => row[columnName]);

    const numericValues = columnValues.filter((value) => !isNaN(parseFloat(value)));

    if (numericValues.length === 0) {
        console.log(`No numeric values found in column ${columnName}`);
        return null;
    }

    const sum = numericValues.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = (sum / numericValues.length);
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

export const formatDate = (dateStr)=>{
    if(dateStr){
        const date = new Date(dateStr);
        // Get the year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
        const day = String(date.getDate()).padStart(2, '0');
        
        // Format the date as yyyy-mm-dd
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }    
}
export const generatePDF = (id = 'my-table') => {
    //loader
    const parentDiv = document.createElement('div');
    parentDiv.id = 'loader';
    parentDiv.classList.add('loader-container', 'flex-column');
const loaderDiv = document.createElement('div');
loaderDiv.className = 'loader';
parentDiv.appendChild(loaderDiv);
document.body.appendChild(parentDiv);

    const input = document.getElementById(id);
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Jarvis Ticker for ' + formatDate(new Date()) + '.pdf');
        const parentDiv = document.getElementById('loader');
        if (parentDiv) {
            parentDiv.remove();
        }
    }).catch((error)=>{
        console.error('Error generating PDF:', error);
    });
};
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
};
export const exportToExcel = (id = 'my-table') => {
    const table = document.getElementById(id);    
    const tableData = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('th, td');
        cells.forEach(cell => {
            rowData.push(cell.textContent.trim());
        });
        tableData.push(rowData);
    });

    // Create a new workbook and a new worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);

 // Style the header row
 if (tableData.length > 0) {
    // Apply bold font style to the header row (first row)
    const headerRow = tableData[0];
    headerRow.forEach((_, colIndex) => {
        const cellAddress = { c: colIndex, r: 0 }; // First row, each column
        const cellRef = XLSX.utils.encode_cell(cellAddress);

        if (!worksheet[cellRef]) worksheet[cellRef] = {}; // Ensure cell object exists
        worksheet[cellRef].s = {
            font: {
                bold: true,
            }
        };
    });
}
 // Adjust column widths based on the content
 const columnWidths = tableData[0].map((_, colIndex) => {
    // Get the maximum length of data in each column
    const maxLength = tableData.reduce((max, row) => Math.max(max, row[colIndex].length), 0);
    return { wpx: maxLength * 10 }; // Adjust multiplier (10) as needed for padding
});

worksheet['!cols'] = columnWidths;

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// Write the workbook to a file
XLSX.writeFile(workbook, 'exported-data.xlsx');
    // // Append the worksheet to the workbook
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // // Generate a binary string representation of the workbook
    // const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // // Convert the binary string to a Blob
    // const blob = new Blob([s2ab(workbookBinary)], { type: 'application/octet-stream' });

    // // Create a link element to trigger the download
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'table_data.xlsx';
    // link.click();
    // URL.revokeObjectURL(link.href); // Clean up the URL object
};
export const getSortIcon = (columnName,sortConfig) => {
    if (sortConfig && sortConfig.key === columnName) {
        return sortConfig.direction === 'asc' ? <div className="arrow-icons up">
            <ArrowDropUpIcon />
            <ArrowDropDownIcon />
        </div>
            :
            <div className="arrow-icons down">
                <ArrowDropUpIcon />
                <ArrowDropDownIcon />
            </div>
    }
    else {
        return <div className="arrow-icons">
            <ArrowDropUpIcon />
            <ArrowDropDownIcon />
        </div>
    }
    return null;
};

export const convertToReadableString = (str)=> {
    return str
      .replace(/([A-Z])/g, ' $1') // Add a space before each uppercase letter
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  }

export const roundToTwoDecimals = (number)=> {
    return Math.round(number * 100) / 100;
}
export const amountSeperator = (amount)=>{
    amount = parseFloat(amount);
  
    // Check if the amount is a valid number
    if (isNaN(amount)) {
      return "";
    }
    let formattedAmount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

    // Remove the .00 if it's not needed
    if (formattedAmount.endsWith(".00")) {
        formattedAmount = formattedAmount.slice(0, -3);
    }

    return formattedAmount;
}
export const mmddyy = (inputDate)=>{
    const [year, month, day] = inputDate.split('-').map(Number);
    
    // Create a new Date object with the year, month, and day
    const date = new Date(year, month - 1, day); // Months are zero-based in JavaScript

    // Format the month and day with leading zeros if needed
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');
    const formattedYear = date.getFullYear();

    // Return the formatted date string
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
}
export function formatPublishedDate(dateString) {
    // Parse the input string into a Date object
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1; // JavaScript months are 0-indexed
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(9, 11);
    const minute = dateString.slice(11, 13);

    const date = new Date(year, month, day, hour, minute);

    // Options for formatting the date
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    // Format the date into "Sep 20, 2024 at 6:45AM"
    return date.toLocaleString('en-US', options).replace(',', ' at');
}
export function formatCurrency(value) {
    value = Number(value)
    const parts = value.toFixed(2).split('.');
    const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1];
    return `$ ${wholePart}.${decimalPart}`;
}
export const decodeJWT = (token) => {
    if(token){
        const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  
    return JSON.parse(jsonPayload);
    }
    return ""    
  };
 export const buildQueryString = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `?${queryString}` : '';
};

export const fetchWithInterceptor = async (url,userId,queries, options = {}) => {
    const accessToken = localStorage.getItem("access_token")
    if(userId){        
        const {userID} = decodeJWT(accessToken)
        url = url+buildQueryString({userId:userID})
    }
    const queryParams = {
        ...queries
    };
    url = url + buildQueryString(queryParams)
    // Add default headers or modify existing ones
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };

    options.headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    // Show loader or any other pre-request logic
    // context.setLoaderState(true);

    try {
        const response = await fetch(url, options);

        // Handle non-200 responses
        if (!response.ok) {
            const errorText = await response.json(); // Parse error response as JSON
            throw new Error(`Error: ${response.status} - ${JSON.stringify(errorText)}`);
        }

        // Parse the response as JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Propagate the error to be handled by the calling function
    } finally {
        // Hide loader or any other post-request logic
        // context.setLoaderState(false);
    }
};

