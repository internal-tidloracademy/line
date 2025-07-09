// ——————————————
// ตั้งค่า LIFF ID และ URL ของ GAS Web App
// ——————————————
const liffId    = '2007302184-J1LRyjwM';
const scriptURL = 'https://script.google.com/macros/s/AKfycbxBlkjjj7yBlSUkJk43qyJ4b7rkSj1Jmoq0vsshBi-55YZqTzt9mF2-6fBvG6E4L0wFCQ/exec';

let userId = '';
let isSubmitBound = false;

function main() {
  // เรียก init แล้วรอจน LIFF พร้อม
  liff.init({ liffId })
    .then(() => liff.ready)
    .then(() => {
      console.log('✅ LIFF พร้อมใช้งาน');

      // ถ้ายังไม่ล็อกอิน ให้ redirect ไปล็อกอินก่อน
      if (!liff.isLoggedIn()) {
        console.log('ℹ️ ยังไม่ล็อกอิน LIFF, กำลังไปล็อกอิน');
        liff.login();
        return;
      }

      // ดึง profile
      return liff.getProfile();
    })
    .then(profile => {
      if (!profile) return; // กรณีกลับมาจาก login

      userId = profile.userId;
      console.log('✅ ได้ userId:', userId);

      bindFormSubmit();
    })
    .catch(err => {
      console.error('❌ เกิดข้อผิดพลาดใน LIFF flow:', err);
      alert('ไม่สามารถเชื่อมต่อกับ LIFF ได้ โปรดลองอีกครั้ง');
    });
}

function bindFormSubmit() {
  if (isSubmitBound) return;
  console.log('▶️ ผูก form submit handler');

  const form           = document.forms['myForm'];
  const submitButton   = document.getElementById('btn');
  const loadingText    = document.getElementById('loading-text');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', e => {
    e.preventDefault();
    console.log('📝 เริ่มการส่งฟอร์ม');

    // ดึงค่า input
    const codeId = form.querySelector('#codeId').value.trim();
    const nameEn = form.querySelector('#nameEn').value.trim();
    console.log('📥 ค่า input:', { userId, codeId, nameEn });

    // ตรวจข้อมูลครบ
    if (!userId || !codeId || !nameEn) {
      console.warn('⚠️ ข้อมูลไม่ครบ', { userId, codeId, nameEn });
      alert('❌ กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    // แสดง loading
    submitButton.style.display = 'none';
    loadingText.style.display  = 'block';

    // เตรียม FormData แล้ว append userId
    const formData = new FormData(form);
    formData.append('userId', userId);

    console.log('▶️ กำลังส่งข้อมูลไป GAS:', { codeId, nameEn, userId });

    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log('✅ ส่งสำเร็จ:', response);
      form.style.display        = 'none';
      loadingText.style.display = 'none';
      successMessage.style.display = 'block';
    })
    .catch(error => {
      console.error('❌ ส่งไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่');
      submitButton.style.display = 'inline-block';
      loadingText.style.display  = 'none';
    });
  });

  isSubmitBound = true;
}

// เรียก main ทันที
main();
