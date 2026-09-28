import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { motion } from 'motion/react'
import { FiMail } from 'react-icons/fi'
import { SiDiscord, SiInstagram, SiSteam, SiX, SiYoutube } from 'react-icons/si'
import { tl } from './timeline'

gsap.registerPlugin(SplitText)

// Placeholders: swap in the real addresses.
const LINKS = [
  { label: 'Email', href: 'mailto:hello@procyonstudios.com', Icon: FiMail },
  { label: 'X', href: '#', Icon: SiX },
  { label: 'Instagram', href: '#', Icon: SiInstagram },
  { label: 'Discord', href: '#', Icon: SiDiscord },
  { label: 'YouTube', href: '#', Icon: SiYoutube },
  { label: 'Steam', href: '#', Icon: SiSteam },
]

const spring = { type: 'spring', stiffness: 420, damping: 16 } as const

export default function Overlay() {
  const root = useRef<HTMLElement>(null!)

  // The page text is part of the same intro timeline, landing as the title card settles.
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const split = SplitText.create(q('.tagline'), { type: 'words,chars', mask: 'chars' })
    const intro = gsap
      .timeline()
      .from(split.chars, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.02 }, 0)
      .from(q('.date'), { autoAlpha: 0, y: 8, duration: 1, ease: 'power3.out' }, 0.5)
      .from(q('.socials li'), { autoAlpha: 0, y: 14, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.7)
      .from(q('.corner'), { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 1)
    tl.add(intro, 5.1)
    return () => {
      tl.remove(intro)
      split.revert()
    }
  }, [])

  return (
    <main ref={root} className="overlay">
      <h1 className="sr-only">Procyon Studios</h1>
      <div className="corners">
        <span className="corner">α CMi · PROCYON</span>
        <span className="corner">RA 07h 39m 18s · DEC +05° 13′ 30″</span>
      </div>
      <div className="bottom">
        <p className="tagline">Something is being made.</p>
        <p className="date">Arriving Winter 2027</p>
        <ul className="socials">
          {LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <motion.a
                href={href}
                aria-label={label}
                initial="rest"
                whileHover="hover"
                whileFocus="hover"
                whileTap="tap"
                variants={{ rest: { y: 0, scale: 1 }, hover: { y: -3, scale: 1.12 }, tap: { scale: 0.86 } }}
                transition={spring}
              >
                <motion.span
                  className="ring"
                  variants={{ rest: { scale: 0.5, opacity: 0 }, hover: { scale: 1, opacity: 1 }, tap: { scale: 1.25, opacity: 0 } }}
                  transition={spring}
                />
                <Icon aria-hidden />
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
