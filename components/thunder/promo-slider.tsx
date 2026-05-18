"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
  image?: string;
  link?: string;
}

const defaultPromoSlides: PromoSlide[] = [
  {
    id: "1",
    title: "ส่วนลด 50%",
    subtitle: "สำหรับลูกค้าใหม่ ใช้โค้ด NEW50",
    buttonText: "สั่งเลย",
    bgColor: "bg-[#ffd709]",
    textColor: "text-gray-900",
    link: "/promotions",
  },
  {
    id: "2",
    title: "ฟรีค่าส่ง",
    subtitle: "เมื่อสั่งครบ 200 บาทขึ้นไป",
    buttonText: "ดูเพิ่มเติม",
    bgColor: "bg-[#0e0e0e]",
    textColor: "text-white",
    link: "/promotions",
  },
  {
    id: "3",
    title: "Flash Sale!",
    subtitle: "สั่งอาหารเวลา 12:00 - 14:00 น. วันนี้เท่านั้น",
    buttonText: "ช้อปเลย",
    bgColor: "bg-red-600",
    textColor: "text-white",
    link: "/promotions",
  },
];

export function PromoSlider() {
  const router = useRouter();
  const [slides, setSlides] = useState<PromoSlide[]>(defaultPromoSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  // Fetch banners dynamically from Supabase
  useEffect(() => {
    async function fetchBanners() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching banners:", error);
          return;
        }

        if (data && data.length > 0) {
          const mappedSlides = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || "",
            buttonText: item.button_text || "สั่งเลย",
            bgColor: item.bg_color || "bg-[#ffd709]",
            textColor: item.text_color || "text-gray-900",
            image: item.image_url || undefined,
            link: item.link_url || "/promotions",
          }));
          setSlides(mappedSlides);
        }
      } catch (err) {
        console.error("Catch error fetching banners:", err);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md font-thai"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <div
              onClick={() => {
                if (slide.link) {
                  router.push(slide.link);
                }
              }}
              className={cn(
                "pl-12 pr-12 pt-6 pb-6 h-40 flex flex-col justify-between relative bg-cover bg-center overflow-hidden transition-all duration-300 cursor-pointer hover:brightness-95 active:scale-[0.99] transition-transform font-thai select-none",
                !slide.image && slide.bgColor
              )}
              style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
            >
              {/* Overlay for background images to guarantee readability */}
              {slide.image && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0" />
              )}

              <div className={cn("relative z-10 font-thai", slide.textColor, slide.image && "text-white")}>
                <h3 className="text-2xl font-black tracking-tight drop-shadow-sm font-thai">{slide.title}</h3>
                <p className="text-xs opacity-90 mt-1 font-medium font-thai leading-snug drop-shadow-sm">{slide.subtitle}</p>
              </div>

              <Button
                variant={slide.image ? "default" : "secondary"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slide.link) {
                    router.push(slide.link);
                  }
                }}
                className={cn(
                  "w-fit font-black relative z-10 transition-transform duration-200 hover:scale-105 active:scale-95 shadow-sm font-thai",
                  slide.image && "bg-[#ffd709] text-gray-900 hover:bg-[#ffd709]/95"
                )}
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all duration-200 hover:scale-105 active:scale-95 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all duration-200 hover:scale-105 active:scale-95 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentSlide === index
                ? "w-6 bg-[#ffd709]"
                : "w-1.5 bg-background/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
