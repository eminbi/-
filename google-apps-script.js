// Code.gs

// Global configurations
const CONFIG = {
  SPREADSHEET_ID: '<YOUR_SPREADSHEET_ID>',
  DRIVE_FOLDER_ID: '<YOUR_DRIVE_FOLDER_ID>',
  SHEET_NAMES: {
    LIST: 'Research List',
    DETAILS: 'Research Details',
    CONFIG: 'Config'
  }
};

// Initialize the spreadsheet structure
function initializeSpreadsheet() {
  const spreadsheet = SpreadsheetApp.getActive();
  
  // Create main list sheet
  let listSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.LIST);
  if (!listSheet) {
    listSheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.LIST);
    setupListSheet(listSheet);
  }
  
  // Create details sheet
  let detailsSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.DETAILS);
  if (!detailsSheet) {
    detailsSheet = spreadsheet.insertSheet(CONFIG.SHEET_NAMES.DETAILS);
    setupDetailsSheet(detailsSheet);
  }
}

function setupListSheet(sheet) {
  const headers = [
    'ID',
    'Title',
    'Authors',
    'Year',
    'Type',
    'Summary',
    'Tags',
    'Last Modified',
    'Usage History'
  ];
  
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#f3f3f3')
    .setFontWeight('bold');
    
  // Add data validation for Type column
  const typeRange = sheet.getRange(2, 5, sheet.getMaxRows() - 1);
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Book', 'Paper', 'Journal', 'Other'], true)
    .build();
  typeRange.setDataValidation(typeRule);
}

function setupDetailsSheet(sheet) {
  const headers = [
    'ID',
    'Reference ID',
    'Content',
    'Notes',
    'File Links',
    'AI Generated Content',
    'Created Date',
    'Modified Date'
  ];
  
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#f3f3f3')
    .setFontWeight('bold');
}

// Utility function to generate unique ID
function generateUniqueId() {
  return Utilities.getUuid();
}

// Add new research item
function addResearchItem(data) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAMES.LIST);
  const id = generateUniqueId();
  
  const newRow = [
    id,
    data.title,
    data.authors,
    data.year,
    data.type,
    data.summary,
    data.tags,
    new Date(),
    ''
  ];
  
  sheet.appendRow(newRow);
  return id;
}

// Get research item by ID
function getResearchItemById(id) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAMES.LIST);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return {
        id: data[i][0],
        title: data[i][1],
        authors: data[i][2],
        year: data[i][3],
        type: data[i][4],
        summary: data[i][5],
        tags: data[i][6],
        lastModified: data[i][7],
        usageHistory: data[i][8]
      };
    }
  }
  return null;
}
