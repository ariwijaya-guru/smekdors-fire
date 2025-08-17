/**
 * SMEKDORS FIRE - Google Apps Script Backend
 * Reads data from INFO_SEKOLAH sheet with exact column mapping
 * 
 * SPREADSHEET ID: 16bn9iYPorvEXB5M8nPFwtpXGZFXbaD8x-z1de_HLLRc
 * SHEET NAME: INFO_SEKOLAH
 * 
 * COLUMN MAPPING:
 * E2 = WEBSITE
 * F2 = BERITA  
 * G2 = EVENT
 * H2 = VIDEO
 * M2 = PENGUMUMAN
 * R2 = PRESENSI
 * S2 = UJIAN (CBT)
 * U2 = LOGIN
 */

// SPREADSHEET CONFIGURATION
const SPREADSHEET_ID = '16bn9iYPorvEXB5M8nPFwtpXGZFXbaD8x-z1de_HLLRc';
const SHEET_NAME = 'INFO_SEKOLAH';

/**
 * Main function to handle all requests
 */
function doGet(e) {
  try {
    console.log('🚀 SMEKDORS FIRE - Apps Script Request:', e.parameter);
    
    const action = e.parameter.action;
    
    if (action === 'getSchoolData') {
      return getSchoolData();
    } else if (action === 'test') {
      return testConnection();
    } else {
      return createResponse(false, 'Invalid action parameter', null);
    }
    
  } catch (error) {
    console.error('❌ Apps Script Error:', error);
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Get school data from INFO_SEKOLAH sheet
 */
function getSchoolData() {
  try {
    console.log('📊 Reading school data from spreadsheet...');
    console.log('🔗 Spreadsheet ID:', SPREADSHEET_ID);
    console.log('📋 Sheet Name:', SHEET_NAME);
    
    // Open spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet`);
    }
    
    console.log('✅ Sheet found:', sheet.getName());
    
    // Get data from row 2 (where the actual data is)
    const dataRange = sheet.getRange('A2:Z2'); // Get row 2, columns A to Z
    const values = dataRange.getValues()[0]; // Get first (and only) row
    
    console.log('📊 Raw data from row 2:', values);
    console.log('📊 Total columns read:', values.length);
    
    // EXACT COLUMN MAPPING AS PER YOUR INSTRUCTIONS
    const schoolData = {
      // Basic info
      namaSekolah: values[0] || 'SMK DR. SOETOMO SURABAYA', // Column A
      alamat: values[1] || '', // Column B
      telepon: values[2] || '', // Column C
      logo: values[3] || 'https://smkdrsoetomo.sch.id/assets/img/logo.png', // Column D
      
      // MENU URLs - EXACT MAPPING
      website: cleanUrl(values[4]), // Column E2 - WEBSITE
      berita: cleanUrl(values[5]), // Column F2 - BERITA
      event: cleanUrl(values[6]), // Column G2 - EVENT
      video: cleanUrl(values[7]), // Column H2 - VIDEO
      
      // Banner images
      banner1: cleanUrl(values[8]) || '', // Column I
      banner2: cleanUrl(values[9]) || '', // Column J
      banner3: cleanUrl(values[10]) || '', // Column K
      banner4: cleanUrl(values[11]) || '', // Column L
      
      pengumuman: cleanUrl(values[12]), // Column M2 - PENGUMUMAN
      
      // Additional columns (N, O, P, Q)
      // Skip to R, S, T, U for the remaining menu items
      presensi: cleanUrl(values[17]), // Column R2 - PRESENSI
      ujian: cleanUrl(values[18]), // Column S2 - UJIAN (CBT)
      // Skip T (index 19)
      login: cleanUrl(values[20]) // Column U2 - LOGIN
    };
    
    console.log('✅ PARSED SCHOOL DATA:');
    console.log('🌐 WEBSITE (E2):', schoolData.website);
    console.log('📰 BERITA (F2):', schoolData.berita);
    console.log('🎉 EVENT (G2):', schoolData.event);
    console.log('🎬 VIDEO (H2):', schoolData.video);
    console.log('📢 PENGUMUMAN (M2):', schoolData.pengumuman);
    console.log('📅 PRESENSI (R2):', schoolData.presensi);
    console.log('💻 UJIAN/CBT (S2):', schoolData.ujian);
    console.log('🔐 LOGIN (U2):', schoolData.login);
    
    // Validate URLs
    const urlValidation = {
      website: isValidUrl(schoolData.website),
      berita: isValidUrl(schoolData.berita),
      event: isValidUrl(schoolData.event),
      video: isValidUrl(schoolData.video),
      pengumuman: isValidUrl(schoolData.pengumuman),
      presensi: isValidUrl(schoolData.presensi),
      ujian: isValidUrl(schoolData.ujian),
      login: isValidUrl(schoolData.login)
    };
    
    console.log('🔍 URL VALIDATION RESULTS:', urlValidation);
    
    return createResponse(true, 'School data loaded successfully', {
      schoolData: schoolData,
      validation: urlValidation,
      timestamp: new Date().toISOString(),
      source: 'Google Apps Script'
    });
    
  } catch (error) {
    console.error('❌ Error reading school data:', error);
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Test connection function
 */
function testConnection() {
  try {
    console.log('🧪 Testing Apps Script connection...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }
    
    const testData = {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: sheet.getName(),
      lastRow: sheet.getLastRow(),
      lastColumn: sheet.getLastColumn(),
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Connection test successful:', testData);
    
    return createResponse(true, 'Connection test successful', testData);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Clean and validate URL
 */
function cleanUrl(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const cleaned = url.toString().trim();
  
  // Return empty string if no URL
  if (cleaned === '' || cleaned === 'undefined' || cleaned === 'null') {
    return '';
  }
  
  return cleaned;
}

/**
 * Validate if string is a proper URL
 */
function isValidUrl(url) {
  if (!url || url.trim() === '') {
    return false;
  }
  
  try {
    const urlPattern = /^https?:\/\/.+/i;
    return urlPattern.test(url.trim());
  } catch (error) {
    return false;
  }
}

/**
 * Create standardized response - FIXED VERSION
 */
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending response:', response);
  
  // FIXED: Remove setHeaders() method that doesn't exist in Apps Script
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Debug function to check specific cells
 */
function debugCells() {
  try {
    console.log('🔍 DEBUG: Checking specific cells...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Check specific cells
    const cells = {
      'E2_WEBSITE': sheet.getRange('E2').getValue(),
      'F2_BERITA': sheet.getRange('F2').getValue(),
      'G2_EVENT': sheet.getRange('G2').getValue(),
      'H2_VIDEO': sheet.getRange('H2').getValue(),
      'M2_PENGUMUMAN': sheet.getRange('M2').getValue(),
      'R2_PRESENSI': sheet.getRange('R2').getValue(),
      'S2_UJIAN': sheet.getRange('S2').getValue(),
      'U2_LOGIN': sheet.getRange('U2').getValue()
    };
    
    console.log('📊 CELL VALUES:', cells);
    
    return cells;
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return { error: error.toString() };
  }
}

/**
 * Get all data for debugging
 */
function getAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Get all data
    const allData = sheet.getDataRange().getValues();
    
    console.log('📊 ALL SHEET DATA:');
    allData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
    
    return allData;
    
  } catch (error) {
    console.error('❌ Error getting all data:', error);
    return { error: error.toString() };
  }
}