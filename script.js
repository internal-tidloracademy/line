// ——————————————
// ตั้งค่า LIFF ID และ URL ของ GAS Web App
// ——————————————
const LIFF_ID    = '2007302184-J1LRyjwM';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBlkjjj7yBlSUkJk43qyJ4b7rkSj1Jmoq0vsshBi-55YZqTzt9mF2-6fBvG6E4L0wFCQ/exec';

let userId = '';
let isFormBound = false;

// ——————————————
// เริ่มทำงานเมื่อ DOM โหลดแล้ว
// ——————————————
window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOMContentLoaded');
  initLiff();
  bindNameInputValidation();
});

// ——————————————
// ปรับใช้งาน LIFF
// ——————————————
async function initLiff() {
  try {
    /*console.log('▶️ กำลัง init LIFF ด้วย ID:', LIFF_ID);*/
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      console.log('ℹ️ ยังไม่ล็อกอิน LIFF, เรียก login()');
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    userId = profile.userId;
    console.log('✅ ได้ userId:', userId);

    bindFormSubmit();
  } catch (err) {
    console.error('❌ เกิดปัญหาในการ init LIFF:', err);
    alert('ไม่สามารถเชื่อมต่อกับ LIFF ได้ โปรดลองใหม่ภายหลัง');
  }
}

// ——————————————
// ผูก event submit form
// ——————————————
function bindFormSubmit() {
  if (isFormBound) return;
  console.log('▶️ ผูก form submit handler');

  const form           = document.getElementById('registerForm');
  const btn            = document.getElementById('btnSubmit');
  const loadingText    = document.getElementById('loadingText');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('▶️ form submit ถูกเรียก');

    const codeId = document.getElementById('codeId').value.trim();
    const nameEn = document.getElementById('nameEn').value.trim();
    console.log('📥 ค่า input:', { userId, codeId, nameEn });

    if (!userId || !codeId || !nameEn) {
      console.warn('⚠️ ข้อมูลไม่ครบ', { userId, codeId, nameEn });
      alert('❌ กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    btn.style.display         = 'none';
    loadingText.style.display = 'block';

    const payload = { userId, codeId, nameEn };
    console.log('▶️ payload ที่จะส่งไป GAS:', payload);

    try {
      // mode no-cors จะปิด CORS preflight และไม่อ่าน response
      await fetch(SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      console.log('✅ ส่ง (no-cors) เรียบร้อย');

      // แสดงผลสำเร็จทันที
      form.style.display         = 'none';
      loadingText.style.display  = 'none';
      successMessage.style.display = 'block';

    } catch (error) {
      console.error('❌ ส่งไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่');
      btn.style.display         = 'block';
      loadingText.style.display = 'none';
    }
  });

  isFormBound = true;
}

// ——————————————
// ตรวจ input ชื่อ ให้เหลือเฉพาะ A–Z/a–z
// ——————————————
function bindNameInputValidation() {
  const input = document.getElementById('nameEn');
  if (!input) return;

  input.addEventListener('input', () => {
    const filtered = input.value.replace(/[^a-zA-Z]/g, '');
    if (filtered !== input.value) {
      console.log('⚠️ แก้ค่า nameEn:', input.value, '→', filtered);
      input.value = filtered;
      alert('กรุณากรอกเฉพาะภาษาอังกฤษเท่านั้น');
    }
  });
}
