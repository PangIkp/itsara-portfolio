# แผนงาน Redesign

## เป้าหมาย

ปรับหน้าตาของเว็บให้ดูเป็นระเบียบและใช้งานดีขึ้น โดยยังคงเอกลักษณ์เดิมของเว็บไว้ ได้แก่:

- โทนสีชมพูเดิม
- ทิศทางของพื้นหลังเดิม
- mood แบบ portfolio ส่วนตัว
- โครง section หลักเดิมเป็นส่วนใหญ่

## หลักการ redesign

- ไม่ redesign เพื่อเปลี่ยนทุกอย่าง
- redesign เฉพาะส่วนที่ช่วยให้เว็บดูดีขึ้นและรองรับระบบใหม่ได้ดีขึ้น
- รักษา visual identity เดิมไว้
- ให้ UI ใหม่เข้ากับ API/content manager ที่จะทำเพิ่ม

## สิ่งที่ควรคงไว้

- background หลักของเว็บ
- palette สีชมพูและโทนใกล้เคียง
- ภาพรวมของ section เช่น banner, skills, projects, certificates, activities, contact
- ความเป็นเว็บ portfolio ส่วนตัว

## สิ่งที่ควรปรับ

## Phase A: โครงสร้างภาพรวม

### To-do

- [x] ปรับ spacing ระหว่าง section ให้สม่ำเสมอ
- [x] ทำ heading ของแต่ละ section ให้มีระบบเดียวกัน
- [x] ลดความแน่นของข้อความบางส่วน
- [x] ตรวจสอบความสมดุลของ margin และ padding ทั้ง desktop และ mobile

### Definition of done

- ทุก section ดูเชื่อมกันเป็นระบบมากขึ้น
- หน้าเว็บอ่านง่ายขึ้นโดยไม่เสียสไตล์เดิม

## Phase B: Navbar และ Navigation

### To-do

- [x] ปรับ spacing ของ navbar
- [x] ทำ active state ให้ชัดขึ้น
- [x] ปรับ hover state ให้ดูคมและสม่ำเสมอ
- [x] ปรับ mobile menu ให้ใช้งานง่ายขึ้น
- [x] ตรวจสอบ logo และ social icons ให้บาลานซ์กับเมนู

### Definition of done

- navbar ดูสะอาดขึ้น
- ใช้งานบน mobile ได้ลื่นขึ้น

## Phase C: Card ของเนื้อหาหลัก

### To-do

- [x] ทำ card ของ `projects` ให้รูปแบบนิ่งขึ้น
- [x] ทำ card ของ `certificates` ให้มี presentation ที่สม่ำเสมอ
- [x] ทำ card ของ `activities` ให้ข้อความอ่านง่ายขึ้น
- [x] ปรับอัตราส่วนรูปให้ใกล้เคียงกัน
- [x] ปรับ hover overlay ให้ชัดขึ้นแต่ยังอยู่ในธีมเดิม

### Definition of done

- card ทั้ง 3 section ไปใน visual direction เดียวกัน
- ภาพและข้อความดูเป็นระบบมากขึ้น

## Phase D: ฟอร์มและหน้า Content Manager

### To-do

- [x] ออกแบบ form field สำหรับ admin ให้ใช้งานง่าย
- [x] ทำปุ่ม action เช่น save, edit, delete ให้ชัด
- [x] ใช้สีเดิมของเว็บ แต่เพิ่มลำดับชั้นของ UI ให้ชัดขึ้น
- [x] แยกพื้นที่ list กับ form ไม่ให้ชนกัน
- [x] เพิ่ม feedback state เช่น success, error, loading

### Definition of done

- หน้า admin กลมกลืนกับเว็บหลัก
- ใช้งานจริงได้ ไม่ใช่แค่ดูสวย

## Phase E: เก็บงานภาพรวม

### To-do

- [x] เช็ก responsive layout ทุก section
- [x] เช็ก contrast ของข้อความบนพื้นหลัง
- [x] เช็กขนาดรูปไม่ให้แตกหรือ crop แปลก
- [x] เก็บ animation ให้พอดี ไม่รบกวนการใช้งาน
- [x] เช็กความสม่ำเสมอของ typography

### Definition of done

- งานภาพรวมดูเรียบร้อยและพร้อมใช้งานจริง

## ลำดับที่แนะนำ

1. ทำ API และ content flow ก่อน
2. redesign ส่วนที่โดนใช้งานจริงก่อน เช่น cards และ admin UI
3. ค่อย polish navbar, spacing, และ responsive detail

## สรุป

redesign ของโปรเจกต์นี้ควรเป็นการปรับให้ดีขึ้นแบบค่อยเป็นค่อยไป ไม่ใช่การเปลี่ยน visual language ใหม่ทั้งหมด เพราะจุดแข็งคือมีธีมและ mood เดิมที่ชัดอยู่แล้ว
