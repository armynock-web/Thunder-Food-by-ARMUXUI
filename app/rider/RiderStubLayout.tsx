'use client'
// BUG-RS01: This MUST be 'use client' because useRouter is a client hook.
// Each stub page.tsx that imports this MUST also be 'use client' (added inline).
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StubLayoutProps {
  title: string
  titleEn: string
  emoji: string
  children?: React.ReactNode
}

export default function RiderStubLayout({ title, titleEn, emoji, children }: StubLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#1c1c1e] relative">
      <div className="bg-[#2c2c2e] px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-[#3c3c3e] rounded-xl flex items-center justify-center hover:bg-[#4c4c4e] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{titleEn}</p>
            <h2 className="text-white font-bold text-xl">{title}</h2>
          </div>
        </div>
      </div>
      <div className="px-6 py-8">
        {children || (
          <div className="bg-[#2c2c2e] rounded-3xl p-8 text-center border border-white/5">
            <span className="text-5xl mb-4 block">{emoji}</span>
            <p className="text-white font-bold text-lg">ฟีเจอร์นี้กำลังพัฒนา</p>
            <p className="text-gray-400 text-sm mt-2">Coming soon in the next version</p>
          </div>
        )}
      </div>
    </div>
  )
}
