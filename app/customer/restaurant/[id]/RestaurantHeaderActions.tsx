"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { toggleFavorite } from "@/app/actions/customer";
import { useToast } from "@/components/ui/use-toast";
import { CartSheet } from "@/components/thunder/cart-sheet";

interface RestaurantHeaderActionsProps {
  restaurantId: string;
  restaurantName: string;
  initialIsFavorite: boolean;
}

export default function RestaurantHeaderActions({
  restaurantId,
  restaurantName,
  initialIsFavorite,
}: RestaurantHeaderActionsProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = await toggleFavorite(restaurantId, isFavorite);
    if (res.error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: res.error,
        variant: "destructive",
      });
    } else {
      const nextState = !isFavorite;
      setIsFavorite(nextState);
      toast({
        title: nextState ? "บันทึกร้านโปรดสำเร็จ!" : "ลบออกจากร้านโปรดแล้ว",
        description: nextState
          ? "ร้านนี้ถูกเพิ่มในลิสต์ร้านโปรดของคุณแล้ว"
          : "ร้านนี้ถูกลบออกจากลิสต์ร้านโปรดแล้ว",
        duration: 2000,
      });
    }
    setIsLoading(false);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: restaurantName,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "คัดลอกลิงก์สำเร็จ!",
        description: "คัดลอกลิงก์ร้านค้าลงในคลิปบอร์ดแล้ว คุณสามารถส่งต่อได้เลย",
        duration: 3000,
      });
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
      <Link
        href="/customer"
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 hover:bg-gray-50 active:scale-95 transition-transform"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div className="flex gap-2 items-center">
        {/* Favorite Button */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 duration-200 ${
            isFavorite
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Cart/Shopping Bag trigger using CartSheet */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-transform">
          <CartSheet />
        </div>
      </div>
    </div>
  );
}
