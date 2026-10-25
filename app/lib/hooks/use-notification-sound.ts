// useNotificationSound — plays the public mp3 on each new real-time notification
import { useCallback, useEffect, useRef } from "react";

// Served from frontend/public (React Router serves public/ at root)
const SOUND_URL = "/dragon-studio-notification-sound-effect-372475.mp3";

export function useNotificationSound(volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  // Preload after mount (client-only — never construct Audio during SSR)
  useEffect(() => {
    const el = new Audio(SOUND_URL);
    el.preload = "auto";
    el.volume = volume;
    audioRef.current = el;
    // Browsers block audio before first gesture — unlock on first interaction
    const unlock = () => {
      unlockedRef.current = true;
      el.load();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      el.pause();
      audioRef.current = null;
    };
  }, [volume]);

  // Restart + play; no-ops (never rejects) when blocked or not yet unlocked
  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el || !unlockedRef.current) return;
    try {
      el.currentTime = 0;
      void el.play().catch(() => {});
    } catch {
      // Autoplay blocked — silent by design
    }
  }, []);

  return { play };
}
