# Itsara Portfolio

เว็บ portfolio นี้ใช้ `React + Express` และตอนนี้รองรับการจัดการข้อมูลผ่าน API ภายใน repo เดียวกันแล้ว

## โครงสร้างหลัก

- `src/` คือ frontend React
- `server.js` คือ entry ของ backend ฝั่ง Express
- `routes/` คือ API routes แยกตามฟีเจอร์
- `utils/` คือ utility ของ backend
- `data/content.json` คือแหล่งข้อมูลหลักของ `projects`, `certificates`, `activities`
- `public/images/` คือรูปที่อ้างจากข้อมูล API

## การรันในเครื่อง

เปิด 2 terminal

### Terminal 1: รัน backend

```bash
npm run server
```

ค่า default ของ backend คือ `http://localhost:5000`

### Terminal 2: รัน frontend

```bash
npm start
```

ค่า default ของ frontend คือ `http://localhost:3000`

## Environment Variables

ถ้า backend ไม่ได้รันที่ `http://localhost:5000` ให้ตั้งค่า frontend:

```bash
REACT_APP_API_BASE_URL=http://localhost:5000
```

ถ้าต้องการใช้ route `/contact` ของ Express + Nodemailer ให้ตั้งค่า:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
```

## ระบบข้อมูลปัจจุบัน

ตอนนี้ข้อมูลหลักของเว็บมาจาก:

- `projects`
- `certificates`
- `activities`

ทั้งหมดถูกเก็บไว้ใน:

- `data/content.json`

และถูกจัดการผ่าน API:

- `GET /api/content`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/certificates`
- `POST /api/certificates`
- `PUT /api/certificates/:id`
- `DELETE /api/certificates/:id`
- `GET /api/activities`
- `POST /api/activities`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`

## หน้า Manage

ตอนนี้มี section `Manage` อยู่ในหน้าเว็บแล้ว แต่:

- ไม่มี link ใน navbar
- ต้องเปิดผ่าน `/manage` เอง
- ต้อง login เป็น admin ก่อน

หลัง login แล้ว ใช้สำหรับ:

- เพิ่มข้อมูลใหม่
- แก้ไขข้อมูลเดิม
- ลบข้อมูล

รองรับทั้ง `projects`, `certificates`, `activities`

## เรื่องรูปภาพ

แยกการใช้รูปเป็น 2 แบบ:

- `src/assets/img/` สำหรับรูป static ของ UI
- `public/images/` สำหรับรูปของข้อมูลที่มาจาก API

ถ้าจะเพิ่ม item ใหม่ผ่านหน้า manage ให้ใส่ path รูปในรูปแบบ:

- `/images/projects/example.png`
- `/images/certificates/example.jpg`
- `/images/activities/example.jpg`

## Contact Flow ปัจจุบัน

ตอนนี้ระบบ contact ยังมี 2 ทางอยู่พร้อมกัน:

1. หน้า `Contact` ฝั่ง frontend ใช้ `EmailJS`
2. backend มี route `/contact` ผ่าน `Express + Nodemailer`

สถานะตอนนี้:

- หน้าเว็บยังส่งผ่าน `EmailJS`
- route `/contact` ยังไม่ได้ถูกเรียกจาก `Contact.js`

ก่อน deploy จริงควรเลือกให้เหลือทางเดียว เพื่อไม่ให้ดูแล 2 flow ซ้ำกัน

## หมายเหตุ

- storage ตอนนี้ยังเป็นไฟล์ JSON ไม่ใช่ database จริง
- ถ้ามีหลายคนแก้ข้อมูลพร้อมกัน ควรย้ายไปใช้ database ภายหลัง
- ถ้า deploy แบบ static hosting อย่างเดียว API จะใช้งานไม่ได้
