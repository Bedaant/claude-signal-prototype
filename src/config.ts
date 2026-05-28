// In production, set VITE_API_URL to your Render backend URL
// Example: https://claude-signal-backend.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function getUserId(): string {
  try {
    let id = localStorage.getItem('signal_user_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('signal_user_id', id);
    }
    return id;
  } catch {
    // Fallback for private browsing mode where localStorage throws
    return 'user_' + Math.random().toString(36).substring(2, 15);
  }
}
