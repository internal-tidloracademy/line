const liffId = '2007302184-J1LRyjwM'; // 🔁 ใส่ LIFF ID ที่ได้จาก LINE Developers
const scriptURL = 'https://script.google.com/macros/s/AKfycbxBlkjjj7yBlSUkJk43qyJ4b7rkSj1Jmoq0vsshBi-55YZqTzt9mF2-6fBvG6E4L0wFCQ/exec'; // 🔁 URL ที่ได้จาก GAS ที่ deploy เป็น Web App

  let userId = '';
  let isSubmitBound = false;

  function main() {
    liff.init({ liffId: liffId })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        return liff.getProfile();
      })
      .then((profile) => {
        if (!profile) return;
        userId = profile.userId;
        console.log('✅ ได้ userId:', userId);

        // ✅ ผูก form submit handler แค่ครั้งเดียว
        if (!isSubmitBound) {
          const form = document.forms['myForm'];
          const submitButton = document.getElementById('btn');
          const loadingText = document.getElementById('loading-text');
          const successMessage = document.getElementById('success-message');

          form.addEventListener('submit', (e) => {
            e.preventDefault();

            submitButton.style.display = 'none';
            loadingText.style.display = 'block';

            const codeId = form.querySelector('#codeId')?.value.trim();
            const nameEn = form.querySelector('#nameEn')?.value.trim();

            if (!userId || !codeId || !nameEn) {
              alert("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง");
              submitButton.style.display = 'inline-block';
              loadingText.style.display = 'none';
              return;
            }

            const formData = new FormData(form);
            formData.append('userId', userId);

            fetch(scriptURL, {
              method: 'POST',
              body: formData
            })
            .then(response => {
              console.log('✅ ส่งสำเร็จ:', response);
              form.style.display = 'none';
              loadingText.style.display = 'none';
              successMessage.style.display = 'block';
            })
            .catch(error => {
              console.error('❌ ส่งไม่สำเร็จ:', error);
              alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
              submitButton.style.display = 'inline-block';
              loadingText.style.display = 'none';
            });
          });

          isSubmitBound = true;
        }
      })
      .catch(err => {
        console.error('❌ เกิดปัญหาในการ init LIFF:', err);
      });
  }

const input = document.getElementById('nameEn');

  input.addEventListener('input', function () {
    // ลบทุกอย่างที่ไม่ใช่ a-z หรือ A-Z
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
    
    if (/[^a-zA-Z]/.test(this.value)) {
      alert("กรุณากรอกเฉพาะภาษาอังกฤษเท่านั้น");
    }
  });
