type ToastType = 'success' | 'error'

export function showToast(message: string, type: ToastType = 'success') {
  if (typeof document === 'undefined') return

  const existing = document.getElementById('kassa-toast')
  if (existing) existing.remove()

  // Keyframes faqat bir marta qo'shiladi (har chaqiruvda yangi <style> to'planmasin)
  if (!document.getElementById('kassa-toast-style')) {
    const style = document.createElement('style')
    style.id = 'kassa-toast-style'
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `
    document.head.appendChild(style)
  }

  const toast = document.createElement('div')
  toast.id = 'kassa-toast'
  toast.textContent = message
  // Ink (qora) — no-red dizayn. success/error matn bilan farqlanadi, rang bilan emas.
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status')
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #021B1A;
    color: white;
    padding: 12px 24px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 700;
    font-family: Satoshi, system-ui, sans-serif;
    z-index: 9999;
    white-space: nowrap;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    animation: toastIn 0.2s ease;
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2500)
}
