  const input = document.getElementById('nameEn');

  input.addEventListener('input', function () {
    // ลบทุกอย่างที่ไม่ใช่ a-z หรือ A-Z
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
    
    if (/[^a-zA-Z]/.test(this.value)) {
      alert("กรุณากรอกเฉพาะภาษาอังกฤษเท่านั้น");
    }
  });
