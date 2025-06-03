export function playNotificationSound() {
  const audio = new Audio('/notification/notification.mp3');
  audio.play().catch((e) => {
    console.warn("Audio playback failed:", e);
  });
}
