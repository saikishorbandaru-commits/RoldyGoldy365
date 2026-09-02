// Subtle Haptic Feedback Helper using navigator.vibrate()
export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | number = 'light'
) {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    if (typeof type === 'number') {
      navigator.vibrate(type);
      return;
    }

    switch (type) {
      case 'light':
        // Subtle 15ms tap for button clicks & toggles
        navigator.vibrate(15);
        break;
      case 'medium':
        // 35ms pulse for adding to cart
        navigator.vibrate(35);
        break;
      case 'heavy':
        // Distinct double pulse for orders & critical actions
        navigator.vibrate([40, 30, 40]);
        break;
      case 'success':
        // Joyful ascending pulse pattern for deal locked & trial booked
        navigator.vibrate([25, 30, 45]);
        break;
      case 'warning':
        // Double alert pulse
        navigator.vibrate([60, 40, 60]);
        break;
      default:
        navigator.vibrate(20);
        break;
    }
  } catch {
    // Graceful fallback if device/browser disables vibration
  }
}
