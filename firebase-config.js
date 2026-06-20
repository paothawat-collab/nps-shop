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
  apiKey:            "AIzaSyCMDKAVIqBweSlX3JEUACPSooK8c9lpkeI",
  authDomain:        "nps-shop-27b20.firebaseapp.com",
  projectId:         "nps-shop-27b20",
  storageBucket:     "nps-shop-27b20.firebasestorage.app",
  messagingSenderId: "632508860590",
  appId:             "1:632508860590:web:a27be2cb83359c5529853f"
};

/* อีเมลเจ้าของ (ไม่บังคับ) — เติมไว้เพื่อให้ช่องอีเมลตอนล็อกอินขึ้นให้อัตโนมัติ */
window.NPS_OWNER_EMAIL = "paothawat@gmail.com";
