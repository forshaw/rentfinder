type Listener = () => void;

let listeners: Listener[] = [];

/**
 * ✅ Subscribe to events
 * Returns a function to unsubscribe
 */
export function subscribe(callback: Listener) {
  listeners.push(callback);

  // ✅ RETURN CLEANUP FUNCTION
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

/**
 * ✅ Notify all listeners
 */
export function notifyAll() {
  listeners.forEach((cb) => cb());
}
