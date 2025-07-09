// 🔁 กรอก LIFF ID และ URL ของ GAS Web App ที่ Deploy แล้ว
const LIFF_ID = '2007302184-J1LRyjwM';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBlkjjj7yBlSUkJk43qyJ4b7rkSj1Jmoq0vsshBi-55YZqTzt9mF2-6fBvG6E4L0wFCQ/exec';

let userId = '';
let isFormBound = false;

window.addEventListener('DOMContentLoaded', () => {
  initLiff();
  bindNameInputValidation();
});

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();
    userId = profile.userId;
    console.log('✅ ได้ userId:', userId);

    bindFormSubmit();
  } catch (err) {
    console.error('❌ เกิดปัญหาในการ init LIFF:', err);
    alert('ไม่สามารถเชื่อมต่อกับ LIFF ได้ โปรดลองอีกครั้ง');
  }
}

function bindFormSubmit() {
  if (isFormBound) return;

  const form = document.getElementById('registerForm');
  const btn = document.getElementById('btnSubmit');
  const loadingText = document.getElementById('loadingText');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codeId = form.codeId.value.trim();
    const nameEn = form.nameEn.value.trim();

    if (!userId || !codeId || !nameEn) {
      alert('❌ กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    btn.style.display = 'none';
    loadingText.style.display = 'block';

    // เตรียม FormData
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('codeId', codeId);
    formData.append('nameEn', nameEn);

    console.log('▶️ กำลังส่ง:', {
      userId, codeId, nameEn
    });

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      console.log('✅ ส่งสำเร็จ:', response);

      if (response.ok) {
        form.style.display = 'none';
        loadingText.style.display = 'none';
        successMessage.style.display = 'block';
      } else {
        throw new Error(`Status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ ส่งไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่');
      btn.style.display = 'block';
      loadingText.style.display = 'none';
    }
  });

  isFormBound = true;
}

function bindNameInputValidation() {
  const input = document.getElementById('nameEn');
  if (!input) return;

  input.addEventListener('input', () => {
    // เก็บเฉพาะ A–Z, a–z
    const filtered = input.value.replace(/[^a-zA-Z]/g, '');
    if (filtered !== input.value) {
      input.value = filtered;
      alert('กรุณากรอกเฉพาะภาษาอังกฤษเท่านั้น');
    }
  });
}
