"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useNotification } from "./notification-popup";

// Synthesize a high-end, premium chime sound using browser Web Audio API
const playPremiumChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    
    // First note (warm D5 tone)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    gain1.gain.setValueAtTime(0, audioCtx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    // Second note (crystal A5 chime)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
    gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.08);
    gain2.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.35);
    
    osc2.start(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.55);
  } catch (e) {
    console.error("Audio Context playback failed:", e);
  }
};

export function GlobalRealtimeListener() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    async function setupRealtime() {
      // Get current session securely
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return;

      const userId = session.user.id;

      // Subscribe to public.notifications table updates for the logged in user
      channel = supabase
        .channel(`user-notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const newNotif = payload.new;
            if (newNotif) {
              // 1. Trigger gorgeous popup notification (will automatically play premium chime sound!)
              let notifType: "success" | "info" | "cart" = "info";
              if (newNotif.title?.includes("สำเร็จ") || newNotif.title?.includes("เสร็จ")) {
                notifType = "success";
              } else if (newNotif.title?.includes("สั่งซื้อ") || newNotif.title?.includes("ออเดอร์")) {
                notifType = "cart";
              }

              showNotification({
                type: notifType,
                title: newNotif.title || "การแจ้งเตือนจากระบบ ⚡",
                message: newNotif.body || "",
                duration: 5000,
              });

              // 3. Automatically refresh page components for seamless UX
              router.refresh();
            }
          }
        )
        .subscribe();
    }

    setupRealtime();

    // Listen for Auth changes to re-subscribe if user logs in/out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (channel) supabase.removeChannel(channel);
        setupRealtime();
      } else if (event === "SIGNED_OUT") {
        if (channel) {
          supabase.removeChannel(channel);
          channel = null;
        }
      }
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, [supabase, showNotification, router]);

  return null;
}
