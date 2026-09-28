import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { FiMail } from 'react-icons/fi'
import { SiDiscord, SiInstagram, SiSteam, SiX, SiYoutube } from 'react-icons/si'
import { FLICKER, tl } from './timeline'

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

const RGB_SPLIT = '-3px 0px 0px rgba(0, 229, 255, 0.85), 3px 0px 0px rgba(255, 40, 90, 0.85)'
const RGB_NONE = '0px 0px 0px rgba(0, 229, 255, 0), 0px 0px 0px rgba(255, 40, 90, 0)'

export default function Overlay() {
  const root = useRef<HTMLElement>(null!)

  // The page text glitches in as part of the same intro timeline, right after the wordmark.
  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    const split = SplitText.create(q('.tagline'), { type: 'chars' })
    const intro = gsap
      .timeline()
      .from(split.chars, { autoAlpha: 0, duration: 0.01, stagger: { each: 0.018, from: 'random' } }, 0)
      .fromTo(q('.tagline'), { textShadow: RGB_SPLIT }, { textShadow: RGB_NONE, duration: 0.6, ease: FLICKER }, 0.05)
      .from(q('.date'), { autoAlpha: 0, duration: 0.3, ease: FLICKER }, 0.3)
      .from(q('.socials li'), { autoAlpha: 0, duration: 0.3, ease: FLICKER, stagger: 0.04 }, 0.4)
      .from(q('.corner'), { autoAlpha: 0, duration: 0.4, ease: FLICKER }, 0.5)
    tl.add(intro, 1.45)
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
              <a href={href} aria-label={label}>
                <Icon aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
