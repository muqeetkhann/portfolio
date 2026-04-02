import { PERSONAL } from '@/lib/data'

const whatsappNumber = PERSONAL.phone.replace(/\D/g, '')
const whatsappMessage = encodeURIComponent('Hi Muqeet, I found your portfolio and would like to discuss a project.')

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp at ${PERSONAL.phone}`}
      className="fixed bottom-[max(1rem,calc(1rem+env(safe-area-inset-bottom)))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_40px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 sm:right-6"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.61 2 2.2 6.41 2.2 11.83c0 1.74.46 3.43 1.32 4.93L2 22l5.4-1.42a9.8 9.8 0 0 0 4.63 1.18h.01c5.42 0 9.83-4.41 9.83-9.83 0-2.63-1.02-5.11-2.82-7.02Zm-7.02 15.19h-.01a8.12 8.12 0 0 1-4.14-1.14l-.3-.18-3.2.84.85-3.12-.2-.32a8.15 8.15 0 0 1-1.25-4.35c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.4a8.1 8.1 0 0 1 2.39 5.76c0 4.5-3.67 8.17-8.17 8.17Zm4.48-6.12c-.25-.13-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.8.98-.15.17-.3.19-.55.07-.25-.12-1.08-.4-2.05-1.28-.76-.68-1.28-1.53-1.43-1.79-.15-.25-.02-.39.11-.52.12-.12.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.07-.12-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.07-.68.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.42 1.44.54.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z" />
      </svg>
    </a>
  )
}
