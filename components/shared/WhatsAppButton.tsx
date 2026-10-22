import { WhatsappLogoIcon } from '@phosphor-icons/react'
import { PERSONAL, UI_COPY } from '@/lib/data'

export default function WhatsAppButton() {
  return <a href={`https://wa.me/${PERSONAL.phone.replace(/\D/g, '')}?text=${encodeURIComponent(UI_COPY.whatsappMessage)}`} target="_blank" rel="noreferrer" aria-label={`${UI_COPY.whatsapp} ${PERSONAL.phone}`} title={UI_COPY.whatsapp} className="whatsapp-button"><WhatsappLogoIcon size={25} aria-hidden /></a>
}
