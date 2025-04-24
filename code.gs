// ฟังก์ชันโหลดหน้า index.html เมื่อเปิด Web App
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('คุณเป็นพนักงานสำนักงานใหญ่ หรือ สาขา');
    // หากต้องการฝังใน iframe: .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันบันทึกข้อมูลที่ส่งจาก LIFF ผ่าน google.script.run
function submitFormData(data) {
  try {
    const sheet = SpreadsheetApp.openById("19tM1Tj9PRpVluvohK4UYDEOxFfcfBKMIra9nuHXV63k")
                                .getSheetByName("ชีต1"); // ✅ เปลี่ยนให้ตรงกับชื่อชีตใน Google Sheet

    Logger.log("DATA: " + JSON.stringify(data)); // ✅ Log ดูว่าได้ข้อมูลหรือไม่

    sheet.appendRow([
      Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy, HH:mm:ss"),
      data.userId,
      data.codeId,
      data.nameEn
    ]);

    return {
      status: 'success',
      message: '✅ บันทึกข้อมูลสำเร็จแล้ว!'
    };

  } catch (error) {
    Logger.log("ERROR: " + error.message); // ✅ เพิ่ม log error
    return {
      status: 'error',
      message: '❌ บันทึกไม่สำเร็จ: ' + error.message
    };
  }
}

// กรณีมีหลายไฟล์ HTML ต้อง include() HTML ได้
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}
