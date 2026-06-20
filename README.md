# ร้านหนองภัยศูนย์เสาโรมัน (NPS Roman) — ระบบราคาสินค้า

เว็บแอป (PWA) สำหรับร้านขายเสาโรมัน/วัสดุตกแต่ง ทำงาน **2 ฝั่ง** ในเว็บเดียว

- **ฝั่งลูกค้า/หน้าร้าน** (ค่าเริ่มต้น): เห็นกริดสินค้า รูป + ราคาขาย, แตะดูหน้าสินค้าเดี่ยว, สแกน QR เปิดสินค้าได้
- **ฝั่งเจ้าของ** (ล็อกอิน + PIN): เห็นต้นทุน/กำไร/%กำไร, สรุปยอด, เพิ่ม–แก้–ลบ, สร้าง/พิมพ์ป้าย QR

แก้ราคาจากมือถือ → **ลูกค้าเห็นทันที** (เมื่อเปิดโหมด Firebase) และ **ต้นทุนเป็นความลับจริง** ด้วย Security Rules — ไม่ใช่แค่ซ่อนบนจอ

---

## สองโหมดการทำงาน (สลับอัตโนมัติ)

| | โหมด Firebase (แนะนำ) | โหมด local (ค่าเริ่มต้นถ้ายังไม่ตั้งค่า) |
|---|---|---|
| ข้อมูล | Firestore (คลาวด์) ซิงค์สด | localStorage ในเครื่อง |
| ลูกค้าเห็นอัปเดต | ทันที ทุกเครื่อง | ต้องกด "เผยแพร่แคตตาล็อก" แล้วอัปโหลด `catalog.json` เอง |
| ต้นทุน | แยกเก็บใน `private_costs` ลูกค้าอ่านไม่ได้ (Rules) | ไม่ถูกเผยแพร่ใน `catalog.json` |
| เปิดใช้ | กรอกค่าใน `firebase-config.js` ให้ครบ | ปล่อย `firebase-config.js` ว่างไว้ |

> แอปตรวจ `firebase-config.js` ตอนเปิด ถ้า `apiKey`/`projectId`/`appId` ครบ → ใช้ Firebase, ถ้าไม่ → ใช้ local ทั้งหมดอัตโนมัติ **ไม่ต้องแก้โค้ด**

---

## โครงไฟล์

```
index.html             แอปหลัก (หน้าร้าน + เจ้าของ + หน้าสินค้าเดี่ยว)
firebase-config.js     ⬅️ กรอกค่า Firebase ที่นี่ (ปล่อยว่าง = โหมด local)
manifest.webmanifest   PWA manifest
sw.js                  Service Worker (ออฟไลน์ + แคช)
firestore.rules        Security Rules (ลับต้นทุนจริง)
catalog.json           แคตตาล็อกสำรอง (เฉพาะโหมด local)
assets/                logo.png, logo-mark.png, icon-192.png, icon-512.png
apple-touch-icon.png   ไอคอนติดหน้าจอ iPhone (180x180)
favicon.png / .ico     favicon
.nojekyll              บอก GitHub Pages ให้เสิร์ฟไฟล์ตรง ๆ
.github/workflows/deploy.yml   ออโต้ deploy ขึ้น GitHub Pages
```

---

## ✅ เช็กลิสต์ค่าที่ต้องกรอกเอง (3–4 ค่า)

- [ ] **`firebase-config.js`** — วาง `firebaseConfig` จากคอนโซล Firebase (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
- [ ] **`firestore.rules`** — แทน `OWNER_UID` (2 จุด) ด้วย UID จริงของเจ้าของ แล้ว Publish
- [ ] **บัญชีเจ้าของ** — สร้างใน Firebase Authentication (Email/Password)
- [ ] **ที่อยู่เว็บร้าน (URL)** — ใส่ในแอป (เมนูตั้งค่า) ให้ QR ลิงก์ถูกที่ เช่น `https://<user>.github.io/nps-shop/`

---

## ขั้นตอนตั้งค่า Firebase (ทำตามได้จริง)

### 1) สร้างโปรเจกต์ + เปิด Firestore
1. ไปที่ <https://console.firebase.google.com> → **Add project** ตั้งชื่อ เช่น `nps-shop`
2. เมนูซ้าย **Build → Firestore Database → Create database**
   - เลือก **Production mode** (เดี๋ยวเราใส่ Rules เอง), เลือก location เช่น `asia-southeast1`

### 2) เพิ่มเว็บแอป แล้วคัดลอกค่า config
1. หน้า Project Overview → กดไอคอน **`</>` (Web)** → ตั้งชื่อ (ไม่ต้องเลือก Hosting)
2. จะได้ก้อนโค้ด `const firebaseConfig = { ... }`
3. เปิดไฟล์ **`firebase-config.js`** ในโปรเจกต์นี้ แล้ววางค่าลงในแต่ละช่อง:
   ```js
   window.NPS_FIREBASE_CONFIG = {
     apiKey:            "AIza...",
     authDomain:        "nps-shop.firebaseapp.com",
     projectId:         "nps-shop",
     storageBucket:     "nps-shop.appspot.com",
     messagingSenderId: "1234567890",
     appId:             "1:1234567890:web:abc123"
   };
   window.NPS_OWNER_EMAIL = "owner@example.com"; // ไม่บังคับ
   ```

### 3) สร้างบัญชีเจ้าของ (Email/Password)
1. เมนูซ้าย **Build → Authentication → Get started**
2. แท็บ **Sign-in method → Email/Password → Enable → Save**
3. แท็บ **Users → Add user** ใส่อีเมล + รหัสผ่านของเจ้าของ
4. คัดลอก **User UID** ของบัญชีนี้ไว้ (ใช้ขั้นถัดไป)

### 4) ใส่ Security Rules (ลับต้นทุนจริง)
1. เปิดไฟล์ **`firestore.rules`** แทนคำว่า `OWNER_UID` **ทั้ง 2 จุด** ด้วย UID ที่คัดลอกมา
2. นำไปลง 1 ใน 2 วิธี:
   - **ง่ายสุด:** Console → **Firestore Database → แท็บ Rules** → วางทับ → **Publish**
   - หรือ CLI: `firebase deploy --only firestore:rules`

ผลลัพธ์: ลูกค้าทั่วไปอ่าน `products` ได้ (รูป+ราคา) แต่ **อ่าน `private_costs` ไม่ได้** และเขียนอะไรไม่ได้เลย เขียนได้เฉพาะบัญชีเจ้าของที่ล็อกอินแล้ว

> ความปลอดภัย: **PIN 6 หลัก = กันคนหยิบมือถือหน้าเคาน์เตอร์** (ความสะดวก) — ตัวกันสิทธิ์เขียน/อ่านต้นทุน **จริง ๆ คือ Firebase Auth + Security Rules**
>
> รหัสเจ้าของร้านเริ่มต้น (PIN) = **`748596`** เปลี่ยนได้ที่เมนู ตั้งค่า → "เปลี่ยนรหัสเจ้าของร้าน (PIN)" (รหัสเก็บแบบ hash ในเครื่องแต่ละเครื่อง)

---

## Deploy ขึ้น GitHub Pages

### วิธีที่ 1 — GitHub Actions (มีให้แล้ว, แนะนำ)
1. สร้าง repo ใหม่บน GitHub แล้ว push โฟลเดอร์นี้ขึ้นไป (branch `main`)
   ```bash
   git init && git add . && git commit -m "NPS shop"
   git branch -M main
   git remote add origin https://github.com/<user>/nps-shop.git
   git push -u origin main
   ```
2. ใน repo → **Settings → Pages → Build and deployment → Source = GitHub Actions**
3. ทุกครั้งที่ push เวิร์กโฟลว์ `.github/workflows/deploy.yml` จะ deploy ให้เอง
4. เว็บจะอยู่ที่ `https://<user>.github.io/<repo>/`

### วิธีที่ 2 — เสิร์ฟจาก branch ตรง ๆ
1. **Settings → Pages → Source = Deploy from a branch** → เลือก `main` / โฟลเดอร์ `/ (root)` → Save
2. (ไฟล์ `.nojekyll` มีให้แล้ว เพื่อให้เสิร์ฟไฟล์ทั้งหมดถูกต้อง)

### ตั้งที่อยู่เว็บร้านสำหรับ QR
เปิดเว็บที่ deploy แล้ว → เข้าโหมดเจ้าของ → **ตั้งค่า** → ช่อง "ที่อยู่เว็บร้าน (URL)" ใส่ URL จริง เช่น `https://<user>.github.io/nps-shop/` แล้วบันทึก → QR ที่พิมพ์จะลิงก์ถูกที่

---

## ติดตั้งบน iPhone (Add to Home Screen)
เปิดเว็บใน **Safari** → ปุ่มแชร์ → **เพิ่มไปยังหน้าจอโฮม** → จะได้ไอคอนเสาโรมัน เปิดเต็มจอเหมือนแอป และฝั่งลูกค้าเปิดออฟไลน์ได้ (เห็นแคตตาล็อกล่าสุดที่แคชไว้)

---

## ทดสอบบนเครื่อง (local)
ต้องเสิร์ฟผ่าน http (ไม่ใช่เปิดไฟล์ตรง ๆ) เพราะ PWA/Service Worker/ES module ต้องใช้ origin:
```bash
cd nps-shop
python3 -m http.server 5173
# เปิด http://localhost:5173
```
ถ้ายังไม่กรอก `firebase-config.js` จะรันโหมด local ให้เลย (เพิ่มสินค้า เห็นในเครื่อง พิมพ์ QR ได้)

---

## วิธีใช้งานสั้น ๆ
- **เข้าโหมดเจ้าของ:** ปุ่ม "เจ้าของร้าน" มุมขวาบน → (โหมด Firebase: ล็อกอินอีเมล/รหัสครั้งแรก) → ใส่ PIN 6 หลัก (เริ่มต้น `748596`)
- **เพิ่มสินค้า:** ปุ่ม + ด้านล่าง → ถ่ายรูป/เลือกอัลบั้ม (ระบบย่อรูปอัตโนมัติ) → ใส่ชื่อ/ต้นทุน/ราคาขาย → บันทึก
- **QR ติดสินค้า:** ปุ่ม QR ในการ์ดสินค้า → "พิมพ์ป้ายนี้" หรือ "พิมพ์ QR ทั้งหมด" (ป้ายมีโลโก้ + ชื่อ + ราคา + QR)
- **ย้ายข้อมูลเดิมขึ้นคลาวด์:** ถ้าเคยใช้โหมด local มาก่อน เข้าโหมดเจ้าของ (Firebase) → ตั้งค่า → "ย้ายข้อมูลในเครื่องขึ้น Firebase"

---

## TODO / ต่อยอดอนาคต
- **รูปจำนวนมาก/ความละเอียดสูง:** ตอนนี้เก็บรูปเป็น base64 JPEG ย่อแล้ว (~40–60KB) ในเอกสาร `products` (ใต้ลิมิต 1MB/doc) ถ้าต้องการรูปใหญ่/เยอะมาก ให้ย้ายไป **Firebase Storage** แล้วเก็บแค่ URL ใน Firestore
- เพิ่มฟิลด์ `order` เพื่อจัดเรียงสินค้าเองแบบลากวาง (โครงสร้างมี `order` รองรับแล้ว)
