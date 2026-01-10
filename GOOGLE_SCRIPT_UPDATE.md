# Google Apps Script Update Required

To enable the booking list feature in the Admin Panel, you need to update your Google Apps Script to return booking data in the `doGet` function.

## Current Script Location
https://script.google.com/macros/s/AKfycbwPp8DUtxrS9c7BY6tp3O7hO6dPaoyB6MB--UlphQhdiWLt8WTLllRQPEsEV6wtvifI/exec

## Required Update

Update your `doGet` function to return both `booked` slots AND full `bookings` data:

```javascript
function doGet(e) {
  const SHEET_NAME = "main";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find column indices
  const dateCol = headers.indexOf('Date');
  const timeCol = headers.indexOf('Time');
  const nameCol = headers.indexOf('Name');
  const emailCol = headers.indexOf('Email');
  const phoneCol = headers.indexOf('Phone');
  const serviceCol = headers.indexOf('Service');
  
  const booked = {};
  const bookings = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = row[dateCol];
    const time = row[timeCol];
    
    if (date && time) {
      // For blocking calendar slots
      const dateStr = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      if (!booked[dateStr]) {
        booked[dateStr] = [];
      }
      booked[dateStr].push(time.toString());
      
      // For admin booking list
      bookings.push({
        date: dateStr,
        time: time.toString(),
        name: row[nameCol] || '',
        email: row[emailCol] || '',
        phone: row[phoneCol] || '',
        service: row[serviceCol] || ''
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    booked: booked,
    bookings: bookings
  })).setMimeType(ContentService.MimeType.JSON);
}
```

## What This Does

1. **`booked`** - Returns date/time pairs for blocking slots on the booking calendar
2. **`bookings`** - Returns full booking details (name, email, phone, service) for the admin panel

## After Updating

1. Save the script
2. Deploy as Web App (if not already deployed)
3. Make sure "Who has access" is set to "Anyone"
4. Refresh the admin page and click "Refresh" to load bookings
