# ⚡ Project Thunder Food (โปรเจค ธันเดอร์ ฟู้ด)

<div align="center">
  <p align="center">
    <strong style="font-size: 24px;">ระบบสั่งอาหารแบบแยกบทบาทผู้ใช้งานระดับพรีเมียม (Premium Multi-Role Food Delivery Platform)</strong>
  </p>
  <p align="center">
    พัฒนาด้วยเทคโนโลยีที่ทันสมัยที่สุด <strong>Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS</strong> และขับเคลื่อนด้วยระบบ Backend ระดับสากล <strong>Supabase (Realtime Database, Storage, Auth, and hardened RLS Security)</strong>
  </p>
  
  <p align="center">
    <a href="#-tech-stack--สถาปัตยกรรมเทคโนโลยี">สถาปัตยกรรมเทคโนโลยี</a> •
    <a href="#-key-features--ฟีเจอร์หลักแบ่งตามบทบาท">ฟีเจอร์หลัก</a> •
    <a href="#-project-structure--โครงสร้างไฟล์โปรเจค">โครงสร้างโปรเจค</a> •
    <a href="#-quick-start--เริ่มต้นใช้งาน">เริ่มต้นใช้งาน</a> •
    <a href="#-documentation--เอกสารมาตรฐานระบบ">เอกสารมาตรฐาน</a>
  </p>
</div>

---

## 📝 บทสรุปโครงการ (Executive Summary)

**Project Thunder Food** คือแพลตฟอร์มสั่งและจัดส่งอาหารออนไลน์ (SaaS Delivery Platform) ที่ถูกออกแบบมาเพื่อรองรับผู้ใช้งาน 4 กลุ่มหลักอย่างเต็มรูปแบบ ได้แก่ **ลูกค้า (Customer)**, **ร้านค้า (Restaurant Owner)**, **ผู้ส่งอาหาร (Rider)** และ **ผู้ดูแลระบบ (System Admin)** 

ระบบนี้มุ่งเน้นการตอบสนองที่รวดเร็วแบบ **Real-time** ในการส่งต่อสถานะคำสั่งซื้อจากลูกค้าไปสู่ร้านค้า และต่อไปยังไรเดอร์ได้อย่างราบรื่น ภายใต้มาตรฐานความปลอดภัยระดับสูงของฐานข้อมูล PostgreSQL บน Supabase ที่มีนโยบายควบคุมการเข้าถึงข้อมูลรายแถวอย่างเข้มงวด (Row-Level Security) เพื่อส่งมอบประสบการณ์ระดับ Premium ให้แก่ลูกค้าและผู้ประกอบการ

---

## 🚀 Tech Stack & สถาปัตยกรรมเทคโนโลยี

โปรเจคนี้พัฒนาขึ้นโดยใช้มาตรฐานสูงสุดของอุตสาหกรรมเว็บแอปพลิเคชันสมัยใหม่:

*   **Frontend Framework:** `Next.js 16.0.10` (App Router) และ `React 19.0.0` เพื่อการประมวลผลฝั่งเซิร์ฟเวอร์ (Server-Side Rendering) และความเร็วสูงสุด
*   **Language:** `TypeScript` แบบ Type-safe เต็มรูปแบบ พร้อมการสร้าง Type definitions อัตโนมัติจากฐานข้อมูล Supabase เพื่อความแม่นยำในการพัฒนา
*   **Database & Backend:** `Supabase` (PostgreSQL) รองรับการแจ้งเตือนและการสื่อสารแบบ Real-time (Realtime Database Subscriptions)
*   **Authentication:** `Supabase Auth` ด้วยกลไก Secure Middleware คอยตรวจสอบ JWT token และป้องกันเส้นทางหน้าเว็บแบบอัตโนมัติ
*   **UI/UX & Styling:** `Tailwind CSS v4` ร่วมกับ `Shadcn UI` (Radix UI) พร้อมรองรับ Dynamic Responsive (Mobile-First) และ micro-animations ที่ไหลลื่น
*   **State & Form Management:** `React Hook Form` ร่วมกับ `Zod Schema Validation` เพื่อการตรวจสอบความถูกต้องของข้อมูลตั้งแต่ฝั่งผู้ใช้งาน

---

## 👥 Key Features & ฟีเจอร์หลักแบ่งตามบทบาท

ระบบได้รับการวิเคราะห์และวางระบบสิทธิ์ (Access Control) ไว้อย่างชัดเจน 4 บทบาทหลัก:

### 1. 🛒 Customer (ระบบลูกค้า)
*   **Restaurant Discovery:** ระบบค้นหาและกรองร้านค้าที่กำลังเปิดให้บริการ พร้อมคะแนนรีวิว
*   **Dynamic Cart & Checkout:** ระบบจัดการตะกร้าสินค้า ปรับแต่งตัวเลือกอาหาร และการสรุปค่าบริการอย่างแม่นยำ
*   **Payment Methods:** รองรับการชำระเงินปลายทาง (Cash) และการโอนเงิน (Transfer)
*   **Order Realtime Tracking:** ติดตามสถานะของคำสั่งซื้อตั้งแต่ร้านค้าเตรียมอาหาร ไปจนถึงพิกัดการเดินทางของไรเดอร์แบบเรียลไทม์
*   **Profile Management:** จัดการข้อมูลส่วนตัว เบอร์โทรศัพท์ และที่อยู่การจัดส่ง

### 2. 🍳 Restaurant Owner (ระบบเจ้าของร้านค้า)
*   **Restaurant Profile:** จัดการรายละเอียดร้านค้า รูปภาพหน้าปก พิกัด GPS และปุ่มเปิด-ปิดร้านค้า
*   **Interactive Menu Manager:** ระบบเพิ่ม ลบ และแก้ไขเมนูอาหาร รวมถึงแบ่งหมวดหมู่ (Menu Categories) พร้อมการอัปโหลดรูปภาพเมนูแบบลากวาง
*   **Live Order Dashboard:** ระบบรับคำสั่งซื้อแบบ Real-time พร้อมปุ่มเปลี่ยนสถานะคำสั่งซื้อ (เช่น Pending ➡️ Preparing ➡️ Ready)
*   **Analytics & Revenue Report:** แดชบอร์ดสรุปรายได้และประวัติยอดขายของร้านค้าเป็นกราฟที่สวยงาม

### 3. 🛵 Rider (ระบบผู้ส่งอาหาร/ไรเดอร์)
*   **Duty Status Toggle:** ปุ่มเปิด-ปิดการรับงานออนไลน์/ออฟไลน์ (Online/Offline Status)
*   **Job Board:** ระบบแสดงรายการคำสั่งซื้อที่ปรุงเสร็จสิ้นและพร้อมส่ง (Ready for Pickup) เพื่อให้ไรเดอร์กดรับงาน
*   **Delivery Tracking Map:** แผนที่พิกัดนำทางไปยังร้านอาหารและลูกค้า พร้อมปุ่มเปลี่ยนสถานะการส่ง (เช่น Picking up ➡️ Delivering ➡️ Completed)
*   **Earnings Tracker:** ระบบคำนวณและแสดงรายได้สะสมของไรเดอร์ (Total Earnings Dashboard)

### 4. 🔑 System Admin (ระบบผู้ดูแลระบบ)
*   **Global Overview Dashboard:** สรุปยอดขายรวม จำนวนผู้ใช้ ร้านค้า และไรเดอร์ทั้งหมดในระบบ
*   **Restaurant Verification & Control:** ควบคุมสิทธิ์การเปิดร้านค้า แก้ไขข้อมูลร้านค้า และการจัดการร้านค้าพาร์ทเนอร์
*   **System Security Control:** ตรวจสอบสิทธิ์ RLS และการตั้งค่าความปลอดภัยของระบบทั้งหมดจากส่วนกลาง

---

## 📁 Project Structure & โครงสร้างไฟล์โปรเจค

โครงสร้างไฟล์และโฟลเดอร์ตามมาตรฐาน Next.js App Router เพื่อการบำรุงรักษาในระยะยาว:

```text
Project Thunder Food/
├── app/                      # โครงสร้างหน้าเว็บหลัก (Next.js App Router)
│   ├── actions/              # Server Actions สำหรับจัดการ Logic หลังบ้าน
│   ├── admin/                # แดชบอร์ดและหน้าระบบสำหรับ Admin
│   ├── customer/             # หน้าระบบสำหรับลูกค้า (ค้นหา, สั่งอาหาร, ประวัติ)
│   ├── checkout/             # ระบบคำนวณยอดเงินและดำเนินการชำระเงิน
│   ├── forgot-password/      # หน้ากู้คืนรหัสผ่าน
│   ├── login/                # หน้าระบบเข้าสู่ระบบแยกบทบาท
│   ├── register/             # หน้าลงทะเบียนผู้ใช้งานใหม่
│   ├── restaurant/           # หน้าระบบสำหรับเจ้าของร้านอาหาร
│   ├── rider/                # หน้าระบบสำหรับไรเดอร์รับงานและนำทาง
│   ├── layout.tsx            # โครงสร้าง Layout หลักของแอปพลิเคชัน
│   └── globals.css           # สไตล์ชีทส่วนกลางและโครงร่างการออกแบบ
├── components/               # Components ย่อยที่นำกลับมาใช้ซ้ำได้ (Reusable UI components)
├── hooks/                    # Custom React Hooks สำหรับ Logic ที่ใช้ซ้ำ
├── lib/                      # บริการหลัก (Business Logic & Database Interfaces)
│   └── services/             # auth.ts, order.ts, restaurant.ts (Encapsulated Services)
├── public/                   # โฟลเดอร์สำหรับ Static Assets เช่น รูปภาพ, โลโก้
├── supabase/                 # การตั้งค่าและประวัติการพัฒนาฐานข้อมูล
│   └── migrations/           # ไฟล์ SQL Migrations สำหรับรัน Schema ฐานข้อมูลและ RLS
├── types/                    # ไฟล์กำหนดประเภทของตัวแปร (TypeScript Interfaces & Database Types)
│   └── supabase.ts           # Types ที่ถูกสร้างจากโครงสร้างฐานข้อมูลจริง
└── utils/                    # ฟังก์ชันตัวช่วยอำนวยความสะดวก
    └── supabase/             # โค้ดสร้าง Supabase client (Client, Server, Middleware)
```

---

## ⚡ Quick Start & เริ่มต้นใช้งาน

ทำตามขั้นตอนด้านล่างนี้เพื่อเปิดใช้งานระบบสำหรับการพัฒนาในเครื่องคอมพิวเตอร์ของคุณ (Local Development Environment):

### 1. โคลนโปรเจคและติดตั้ง Dependencies
```bash
# ติดตั้ง Library ที่จำเป็นทั้งหมด
npm install
```

### 2. ตั้งค่าไฟล์สภาพแวดล้อม (Environment Variables)
คัดลอกไฟล์ `.env.example` ไปเป็น `.env.local` จากนั้นกรอกข้อมูลการเชื่อมต่อ Supabase ของคุณ:
```bash
cp .env.example .env.local
```
รายละเอียดข้อมูลในไฟล์ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. ตั้งค่าฐานข้อมูล Supabase และรัน Migrations
หากใช้ Supabase CLI ในการพัฒนา ให้ใช้คำสั่งต่อไปนี้เพื่อสร้างและจำลองฐานข้อมูลในเครื่อง:
```bash
# เชื่อมต่อกับ Supabase Project
supabase login
supabase link --project-ref your-project-ref

# รัน migrations ไปยังฐานข้อมูลจริง
supabase db push
```
หรือคัดลอกคำสั่ง SQL ในโฟลเดอร์ `supabase/migrations/` ไปรันโดยตรงใน **SQL Editor** บนหน้าเว็บ Supabase Dashboard เพื่อติดตั้งตาราง ดัชนี ตัวกระตุ้น (Triggers) และนโยบาย RLS ทั้งหมด

### 4. รันระบบสำหรับพัฒนา (Local Development Server)
```bash
# สตาร์ทเซิร์ฟเวอร์ที่พอร์ต http://localhost:3000
npm run dev
```

---

## 📘 Documentation & เอกสารมาตรฐานระบบ

เพื่อส่งมอบงานให้กับลูกค้าหรือทีมงานฝ่ายพัฒนาได้อย่างมืออาชีพสูงสุด เราได้เตรียมเอกสารเชิงลึกครอบคลุมทุกด้านไว้ในโฟลเดอร์ `/docs`:

1.  **[คู่มืออธิบายระบบแอปพลิเคชันอย่างเป็นทางการ (SYSTEM_GUIDE.md)](file:///D:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/Project%20Thunder%20Food/docs/SYSTEM_GUIDE.md)**
    *   รายละเอียดขั้นตอนการไหลของข้อมูล (Detailed Workflows) สำหรับ 4 บทบาทผู้ใช้
    *   ดัชนีหน้าเว็บ (Routing & Page Index) ระบุรายละเอียดของทุกหน้าและทุกโฟลเดอร์ในระบบ
    *   ภาพรวมกลไกเรียลไทม์ (Real-time Database WAL & WebSockets) และพื้นที่จัดเก็บไฟล์ (Storage Buckets)

2.  **[เอกสารสถาปัตยกรรมซอฟต์แวร์ (SOFTWARE_ARCHITECTURE.md)](file:///D:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/Project%20Thunder%20Food/docs/ARCHITECTURE.md)**
    *   แผนภาพสถาปัตยกรรมการรับส่งข้อมูล (Client 🔄 Server 🔄 Database)
    *   แผนภาพความสัมพันธ์ของตารางฐานข้อมูล (Entity Relationship Diagram - ERD)
    *   รายละเอียดสิทธิ์การเข้าถึงฐานข้อมูลนโยบาย RLS (Row-Level Security) และ SQL Triggers อัตโนมัติ

3.  **[คู่มือมาตรฐานการเขียนโค้ดและพัฒนา (DEVELOPMENT_STANDARDS.md)](file:///D:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/Project%20Thunder%20Food/docs/DEVELOPMENT_STANDARDS.md)**
    *   ข้อตกลงในการตั้งชื่อ (Naming Conventions) ของตัวแปร ฟังก์ชัน และฐานข้อมูล
    *   แนวปฏิบัติที่ดีที่สุดของ React 19 และ Next.js 16 (Server Components vs Client Components)
    *   มาตรฐานความปลอดภัยของ Supabase (RLS Security Hardening & SQL Trigger Optimization)

4.  **[คู่มือการติดตั้งระบบและส่งมอบงานลูกค้า (DEPLOYMENT_DELIVERY.md)](file:///D:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/Project%20Thunder%20Food/docs/DEPLOYMENT_DELIVERY.md)**
    *   ขั้นตอนการติดตั้งระบบขึ้นสู่ Production (Vercel/Netlify)
    *   ขั้นตอนการย้ายระบบและรัน Schema บนฐานข้อมูล Supabase สำหรับการผลิต
    *   รายการตรวจสอบความถูกต้องก่อนส่งมอบงานจริง (Production-Ready Release Checklist)
    *   คู่มือการตั้งค่าสิทธิ์ของผู้ดูแลระบบเพื่อส่งมอบรหัสผ่านและช่องทางการจัดการให้กับลูกค้าอย่างปลอดภัย

5.  **[คู่มือลิขสิทธิ์ซอฟต์แวร์และข้อตกลงทางกฎหมาย (LICENSE.md & LEGAL_TERMS.md)](file:///D:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/Project%20Thunder%20Food/docs/LEGAL_TERMS.md)**
    *   สัญญาอนุญาตใช้งานแบบมีสิทธิ์เด็ดขาด (Proprietary Software License) ภายใต้ลิขสิทธิ์ของ **ARMUXUI**
    *   กฎหมายพิทักษ์สิทธิ์การคุ้มครองซอฟต์แวร์ (พ.ร.บ. ลิขสิทธิ์ พ.ศ. 2537, พ.ร.บ. คอมพิวเตอร์ พ.ศ. 2550/2560, ประมวลกฎหมายแพ่ง)
    *   พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และข้อปฏิเสธความรับผิดชอบทางแพลตฟอร์ม (Disclaimers)

---

⚡ **Project Thunder Food** ถูกออกแบบและเขียนโค้ดอย่างพิถีพิถัน ภายใต้มาตรฐานการเขียนโปรแกรมระดับสากล เพื่อเป็นแอปพลิเคชันที่สามารถขยายขนาด (Scalable) ปลอดภัย (Secure) และพร้อมสำหรับการทำตลาดจริงในฐานะสตาร์ทอัพยุคใหม่!
