/* =========================================================
   ตั้งค่า Firebase — กรอกค่าจากคอนโซล Firebase ที่ "ไฟล์นี้ไฟล์เดียว"
   ---------------------------------------------------------
   วิธีหาค่า:
   Firebase Console → ⚙️ Project settings → ส่วน "Your apps" →
   เลือกเว็บแอป (</>) → คัดลอกค่าในก้อน firebaseConfig มาวางทับด้านล่าง

   • ถ้าปล่อยว่าง (หรือยังเป็นค่าตัวอย่าง) → แอปจะทำงานโหมด localStorage
     + catalog.json โดยอัตโนมัติ ไม่ error
   • กรอกครบเมื่อไร แอปจะสลับไปโหมด Firebase (ซิงค์สด) ให้เอง
   ========================================================= */

window.NPS_FIREBASE_CONFIG = {
  apiKey:            "",   // TODO: กรอก apiKey
  authDomain:        "",   // TODO: เช่น your-project.firebaseapp.com
  projectId:         "",   // TODO: เช่น your-project-id
  storageBucket:     "",   // TODO: เช่น your-project.appspot.com
  messagingSenderId: "",   // TODO
  appId:             ""    // TODO
};

/* อีเมลเจ้าของ (ไม่บังคับ) — เติมไว้เพื่อให้ช่องอีเมลตอนล็อกอินขึ้นให้อัตโนมัติ */
window.NPS_OWNER_EMAIL = "";
