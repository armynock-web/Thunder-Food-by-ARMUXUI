# 🛠️ คู่มือมาตรฐานการเขียนโค้ดและพัฒนา (Development & Coding Standards)

เพื่อให้โค้ดของแอปพลิเคชัน **Project Thunder Food** มีความสะอาด เป็นระเบียบ อ่านง่าย ปลอดภัยสูงสุด และทำงานร่วมกันในทีมพัฒนาระดับโปรได้อย่างไร้รอยต่อ เอกสารนี้จึงได้กำหนดแนวทางปฏิบัติและข้อตกลงในการเขียนโค้ด (Coding Conventions) ไว้ดังนี้

---

## 1. 🏷️ ข้อตกลงการตั้งชื่อ (Naming Conventions)

การกำหนดชื่อในทุกส่วนของโปรเจคต้องเป็นไปตามหลักการสะกดที่ชัดเจนและจำแนกประเภทได้ง่าย:

*   **โฟลเดอร์และไฟล์คอมโพเนนต์ (UI Components):**
    *   ใช้ตัวอักษรพิมพ์ใหญ่ตัวแรกเสมอแบบ **PascalCase** (เช่น `OrderCard.tsx`, `RestaurantList.tsx`)
    *   ไฟล์ที่เป็นตัวช่วยให้ใช้แบบ **camelCase** (เช่น `formatCurrency.ts`, `validatePhone.ts`)
*   **ไฟล์ของระบบ App Router (Next.js):**
    *   ใช้โครงสร้างตามข้อกำหนดของ Next.js เสมอ (เช่น `page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`)
*   **โค้ด JavaScript/TypeScript:**
    *   **ตัวแปรและฟังก์ชัน:** ใช้รูปแบบ **camelCase** (เช่น `const totalAmount = 150`, `function calculateDeliveryFee()`)
    *   **อินเทอร์เฟซและคลาส:** ใช้รูปแบบ **PascalCase** (เช่น `interface UserProfile`, `class OrderService`)
    *   **ค่าคงที่ส่วนกลาง:** ใช้รูปแบบ **UPPER_SNAKE_CASE** (เช่น `const DEFAULT_DELIVERY_FEE = 40`)
*   **ฐานข้อมูล (Database Schema):**
    *   **ชื่อตาราง คอลัมน์ และประเภทประเภทข้อมูล (Enums):** ใช้รูปแบบ **snake_case** และสะกดด้วยตัวพิมพ์เล็กเสมอ (เช่น ตาราง `menu_categories`, คอลัมน์ `is_available`, ประเภท Enum `user_role`)
    *   **ชื่อฟังก์ชัน SQL และทริกเกอร์:** ใช้รูปแบบ **snake_case** (เช่น `handle_new_user()`, `on_auth_user_created`)

---

## 2. 📘 มาตรฐานการเขียน TypeScript

แอปพลิเคชันนี้ทำงานบนภาษา TypeScript แบบเข้มงวด (Strict Mode) เพื่อความปลอดภัยของข้อมูลและช่วยลดข้อผิดพลาดตั้งแต่ขั้นตอนเขียนโค้ด:

*   **หลีกเลี่ยงการใช้ `any`:** ห้ามใช้งานประเภทข้อมูลแบบ `any` ในทุกกรณี ให้ระบุประเภทอย่างชัดเจน หรือใช้ `unknown` แทนหากไม่ทราบโครงสร้างข้อมูลที่แน่นอน
*   **ใช้งาน Path Aliases:** ในการดึงไฟล์ภายนอกเข้ามาใช้งาน (Importing) ให้ใช้สัญลักษณ์ระบุตำแหน่งสัมบูรณ์ที่กำหนดไว้ใน `tsconfig.json` แทนการอ้างอิงโฟลเดอร์ถอยกลับไปมาหลายชั้น (เช่น `../../../../`):
    ```typescript
    // ❌ ห้ามทำแบบนี้
    import { createClient } from '../../utils/supabase/client'
    
    // ✅ ทำแบบนี้แทน (ปลอดภัยและอ่านง่ายกว่า)
    import { createClient } from '@/utils/supabase/client'
    ```
*   **ความสมบูรณ์แบบของ Type Safety ในฐานข้อมูล:**
    ทุกคำสั่งดึงข้อมูลต้องผูกกับอินเทอร์เฟซ `Database` จาก `@/types/supabase` เสมอ เพื่อให้การพิมพ์คำสั่งค้นหามีการตรวจสอบชื่อตารางและชื่อคอลัมน์ล่วงหน้า (IntelliSense) ป้องกันปัญหาการพิมสะกดคอลัมน์ในคำสั่ง SQL ผิดพลาด:
    ```typescript
    import { createClient } from '@/utils/supabase/client'
    import { Database } from '@/types/supabase'

    const supabase = createClient()
    
    // ไคลเอนต์จะทราบทันทีว่าตาราง 'restaurants' มีคอลัมน์อะไรและเป็นประเภทข้อมูลใด
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, is_open')
    ```

---

## 3. ⚛️ แนวปฏิบัติของ React 19 และ Next.js 16 (App Router)

การแบ่งแยกขอบเขตการทำงานระหว่างฝั่งเซิร์ฟเวอร์และฝั่งไคลเอนต์เป็นหัวใจของการเพิ่มประสิทธิภาพความเร็วของแอปพลิเคชัน:

### 3.1 การเลือกใช้ Server Components vs Client Components
*   **Server Components (เป็นค่าเริ่มต้น):** 
    *   ใช้สำหรับหน้าเว็บแสดงผลทั่วไปและหน้าเพจหลักในการดึงข้อมูล (Data Fetching)
    *   การดึงข้อมูลต้องทำผ่าน `createServerClient` เพื่อการแคชหน้าเว็บที่ทรงประสิทธิภาพและมีความปลอดภัย
*   **Client Components (ระบุ `'use client'` ที่บรรทัดแรกสุด):**
    *   ใช้สำหรับชิ้นส่วนคอมโพเนนต์ที่จำเป็นต้องมีการทำงานโต้ตอบกับลูกค้า มีการผูกสถานะ (`useState`, `useEffect`) หรือใช้งาน APIs ของเบราว์เซอร์ (เช่น ประวัติตะกร้าอาหาร, การกดรับงานของไรเดอร์, การขยับพิกัดพอยเตอร์บนแผนที่)
    *   **แนวทางปฏิบัติที่ดี:** พยายามออกแบบให้ Client Components มีขนาดเล็กที่สุดเท่าที่จะทำได้ แล้วดึงไปประกอบใน Server Component หลัก

### 3.2 การจัดการฟอร์มและการตรวจสอบข้อมูล (Form Handling & Validation)
การตรวจสอบความถูกต้องของข้อมูล (Validation) ต้องทำอย่างเคร่งครัดทั้งฝั่งหน้าบ้าน (Client) เพื่อตอบสนองที่ไหลลื่น และหลังบ้าน (Server) เพื่อความปลอดภัยสูงสุด:
*   ใช้การผสานพลังระหว่าง **React Hook Form** และ **Zod Validation Schema**
*   **ตัวอย่างโครงสร้างโค้ดฟอร์มที่ได้มาตรฐาน:**
    ```typescript
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import * as z from 'zod'

    // 1. กำหนดโครงสร้างข้อมูลด้วย Zod
    const loginSchema = z.object({
      email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
      password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
    })

    type LoginFormValues = z.infer<typeof loginSchema>

    // 2. เรียกใช้งานฟอร์มภายในคอมโพเนนต์
    export function LoginForm() {
      const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
      })

      const onSubmit = async (values: LoginFormValues) => {
        // ประมวลผลลัพธ์
      }

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          {/* ส่วนที่เหลือ */}
        </form>
      )
    }
    ```

### 3.3 การจัดการการกลายพันธุ์ของข้อมูล (Data Mutations via Server Actions)
*   การเพิ่ม แก้ไข หรือลบข้อมูลใดๆ บนหน้าเว็บ ควรทำงานผ่าน **Next.js Server Actions** (`'use server'`) เพื่อขจัดความจำเป็นในการสร้างจุดเชื่อมต่อ API (REST API Endpoints) จำนวนมากในโปรเจค
*   Server Actions จะต้องทำการรับและตรวจทานค่าที่ส่งมาจากผู้ใช้เสมอ และต้องทำการเคลียร์แคชของหน้าเว็บที่ได้รับผลกระทบผ่านคำสั่ง `revalidatePath` เพื่อให้หน้าเว็บโหลดข้อมูลใหม่ล่าสุดทันที

---

## 4. 🗃️ แนวทางปฏิบัติการผสานระบบ Supabase และความปลอดภัย

ความปลอดภัยของฐานข้อมูลต้องได้รับการดูแลอย่างแน่นหนาตั้งแต่ระดับพัฒนาจนถึงขึ้นใช้งานจริง:

*   **เปิดใช้งานและบังคับใช้นโยบาย RLS (Row-Level Security) ทุกตาราง:**
    *   ห้ามเขียนโค้ดเขียนทับหรือยกเลิกการทำงาน RLS ในระดับโปรดักชัน
    *   เมื่อมีการสร้างตารางฐานข้อมูลใหม่ ต้องเขียนคำสั่ง `alter table public.ตารางใหม่ enable row level security;` ร่วมอยู่ใน Migration เสมอ
*   **การดึงข้อมูลจาก Supabase บนฝั่งเซิร์ฟเวอร์:**
    *   ให้สร้างฟังก์ชันเรียกใช้ไคลเอนต์เฉพาะจุดผ่านคำสั่ง `await createClient()` ที่นำเข้าจาก `@/utils/supabase/server` ทุกครั้ง
*   **ยกเลิกการสมัครสมาชิกเรียลไทม์เมื่อไม่ใช้งาน (Unsubscribe on Unmount):**
    *   การฟังเสียงอัปเดตแบบ Real-time บน Client Component ต้องเคลียร์การทำงานทุกครั้งที่เปลี่ยนหน้าเพื่อหลีกเลี่ยงปัญหาหน่วยความจำรั่วไหล (Memory Leaks):
    ```typescript
    useEffect(() => {
      const supabase = createClient()
      const channel = supabase
        .channel('order-updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
          // ดำเนินการอัปเดตสถานะใน UI
        })
        .subscribe()

      // 🧹 คลีนอัพแชนเนลเมื่อไม่ได้ใช้เพจนี้แล้ว
      return () => {
        supabase.removeChannel(channel)
      }
    }, [])
    ```

---

## 5. 🎨 มาตรฐานการสไตล์และระบบการออกแบบ (Styling & Design System)

แอปพลิเคชันได้รับการออกแบบให้ออกมาหรูหรา สวยสะดุดตา และประทับใจผู้ใช้งานตั้งแต่แรกเห็น (Premium Design):

*   **การออกแบบที่ยืดหยุ่นและรองรับมือถือ (Mobile-First Dynamic Layout):**
    *   เนื่องจากผู้สั่งอาหารและไรเดอร์ใช้งานผ่านโทรศัพท์มือถือเป็นหลัก หน้าเว็บทุกหน้าต้องเขียนสไตล์ด้วยหลักการ Mobile-First เสมอ (เขียนโค้ดสำหรับหน้าจอเล็กสุดแล้วค่อยใช้ prefix เช่น `md:`, `lg:` ขยายขนาดไปยังเดสก์ท็อป)
*   **การคัดสรรโทนสีที่หรูหรา (Curated Color Harmony):**
    *   หลีกเลี่ยงการใช้สีสดของแม่สีตรงๆ (เช่น สีแดงจัด เขียวจัด น้ำเงินจัด)
    *   เลือกใช้โทนสีที่มีความนุ่มลึก ทันสมัย และให้ความรู้สึกพรีเมียม (เช่น ใช้งาน Slate หรือ Zinc สีเข้มสำหรับพื้นหลัง Dark Mode, สีส้มทองวอร์มทองสำหรับปุ่มจุดเด่น (Accent Colors) เช่นสีส้มอำพัน Amber หรือสีส้มพระอาทิตย์ขึ้น Sunrise)
*   **เอฟเฟกต์ปฏิสัมพันธ์ย่อย (Micro-animations & Hover States):**
    *   ทุกปุ่มกด การตอบสนองของเมาส์สัมผัส (Hover) และรายการอาหาร ต้องใส่การหน่วงเวลาแบบลื่นไหล (`transition-all duration-300 ease-in-out`) เพื่อสร้างความรู้สึกหรูหราและมีมิติขณะใช้งาน
    *   นำกลไก **Glassmorphism** (พื้นหลังโปร่งแสงพร้อมการเบลอเบื้องหลัง `bg-white/10 backdrop-blur-md border border-white/20`) มาตกแต่งการ์ดและแถบเมนูในบางหน้าเพื่อสร้างเอกลักษณ์เฉพาะตัว

---

การปฏิบัติตามมาตรฐานการเขียนโค้ดและดีไซน์เหล่านี้อย่างเคร่งครัด จะช่วยป้องกันการเกิดข้อบกพร่องสะสม (Technical Debt) ทำให้แอปพลิเคชันมีความมั่นคง ปลอดภัย และสร้างความภาคภูมิใจให้กับทีมงานเมื่อส่งมอบงานคุณภาพให้กับลูกค้า!
