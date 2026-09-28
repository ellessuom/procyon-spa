import type { IconType } from 'react-icons'
import { FiMail } from 'react-icons/fi'
import { SiDiscord, SiInstagram, SiSteam, SiX, SiYoutube } from 'react-icons/si'

// Placeholders: swap in the real addresses.
export const SOCIAL_LINKS: { label: string; href: string; Icon: IconType }[] = [
  { label: 'Email', href: 'mailto:hello@procyonstudios.com', Icon: FiMail },
  { label: 'X', href: '#', Icon: SiX },
  { label: 'Instagram', href: '#', Icon: SiInstagram },
  { label: 'Discord', href: '#', Icon: SiDiscord },
  { label: 'YouTube', href: '#', Icon: SiYoutube },
  { label: 'Steam', href: '#', Icon: SiSteam },
]
