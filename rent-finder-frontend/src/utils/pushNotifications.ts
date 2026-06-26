/**
 * Request browser permission for notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

/**
 * Subscribe the browser to push AND send the subscription to backend
 */
export async function subscribeToPush(
  userId: number
): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;

  // Reuse existing subscription if present
  let subscription = await registration.pushManager.getSubscription();

  //This is required to prevent multiple subscriptions if user clicks "Enable" multiple times
  if (subscription) {
    await subscription.unsubscribe(); // ✅ REMOVE OLD ONE
    subscription = null;
  }


  if (!subscription) {
    const VAPID_PUBLIC_KEY =
      "BH0n8GTMnc1_Fphr8axmlRTNTJNB8cqVA8nLSfDxCKS8c77eFZW0PQB7WOPODQAOwTcqsFTkrwlNTd45pFz9tec"; // ✅ Your public key

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  // ✅ Send subscription to backend
  await fetch("http://localhost:3000/api/push/subscribe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({
    userId,
    subscription,
  }),
});

  return subscription;
}

/**
 * Required utility for Push API
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}