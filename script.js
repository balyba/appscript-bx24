// Get row array
function getRowData(row, spreadSheet) {
  const data = spreadSheet.getRange("A" + row + ":" + "H" + row).getValues();
  return data;
}

// Check the cells in the range for emptiness
function checkPriorityCellsIsEmpty(row, spreadSheet) {
  const data = spreadSheet.getRange("A" + row + ":" + "H" + row);
  for (let column = 1; column < 6; column++) {
    Logger.log("row: " + row + " column: " + column);
    Logger.log(data.getCell(1, column).isBlank() + " index: " + column);
    if (data.getCell(1, column).isBlank()) return true;
  }
}

// Check if the lead was sent
function isSendBefore(row, spreadSheet) {
  if (
    spreadSheet
      .getRange("K" + row)
      .getCell(1, 1)
      .isBlank()
  )
    return true;
}

// Triggered by cells editing function
function onEditCustom(e) {
  const TOKEN_BX24 = "YOUR_BX24_TOKEN";
  const DOMAIN_BX24 = "YOUR_BX24_DOMAIN";
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Ответы на форму (1)"
  );
  const range = e.range;
  const row = range.getRow();
  Logger.log("row: " + row);

  if (
    range.getSheet().getName() != "Ответы на форму (1)" ||
    row == 1 ||
    checkPriorityCellsIsEmpty(row, spreadSheet) ||
    !isSendBefore(row, spreadSheet)
  )
    return;

  const rowData = getRowData(row, spreadSheet);
  const URL = `https://${DOMAIN_BX24}.bitrix24.ru/rest/1/${TOKEN_BX24}/crm.lead.add.json?FIELDS[TITLE]=Колл-центр Гранат ${rowData[0][4]}&FIELDS[COMMENTS]=${rowData[0][4]}&FIELDS[NAME]=${rowData[0][2]}&FIELDS[UF_CRM_1655903238]=Заявка Колл-центр Гранат&FIELDS[PHONE][0][VALUE]=${rowData[0][3]}&FIELDS[STATUS_ID]=17`;
  const response = UrlFetchApp.fetch(URL);

  spreadSheet
    .getRange("K" + row)
    .getCell(1, 1)
    .setValue("Отправлено в Битрикс24!");
  Logger.log(response.getContentText());
}
