import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { FiArrowDown, FiArrowRight, FiMail } from 'react-icons/fi'
import { SiDiscord, SiInstagram, SiSteam, SiX, SiYoutube } from 'react-icons/si'
import { FLICKER, pose, tl } from './timeline'
import { go, setupSections } from './sections'
import { MARK, VIEW_H } from './Logo'

// Placeholders: swap in the real addresses.
const LINKS = [
  { label: 'Email', href: 'mailto:hello@procyonstudios.com', Icon: FiMail },
  { label: 'X', href: '#', Icon: SiX },
  { label: 'Instagram', href: '#', Icon: SiInstagram },
  { label: 'Discord', href: '#', Icon: SiDiscord },
  { label: 'YouTube', href: '#', Icon: SiYoutube },
  { label: 'Steam', href: '#', Icon: SiSteam },
]

function Notify() {
  const [noted, setNoted] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    // TODO: POST to endpoint — send new FormData(form).get('email') to the mailing-list backend.
    setNoted(true)
    setTimeout(() => {
      setNoted(false)
      form.reset()
    }, 3000)
  }
  return (
    <form className={`notify${noted ? ' is-noted' : ''}`} onSubmit={submit}>
      <label className="label" htmlFor="email">
        Get notified at launch
      </label>
      <div className="field">
        <input id="email" name="email" type="email" required placeholder="Email address" autoComplete="email" />
        <button type="submit" className="label">
          Notify me <FiArrowRight aria-hidden />
        </button>
        <p className="noted label" role="status">
          {noted ? 'You’re on the list' : ''}
        </p>
      </div>
    </form>
  )
}

export default function Overlay() {
  const root = useRef<HTMLElement>(null!)
  const slot = useRef<HTMLDivElement>(null!)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)

    // Section B's logo position comes from the DOM: centre the skull alone in #logo-slot (world units, camera z=8).
    const measure = () => {
      const r = slot.current.getBoundingClientRect()
      const k = VIEW_H / innerHeight
      pose.scale = Math.min((r.height * k) / MARK.h, (r.width * k) / MARK.w)
      pose.y = (innerHeight / 2 - (r.top + r.height / 2)) * k - MARK.cy * pose.scale
    }
    measure()
    addEventListener('resize', measure)
    document.fonts.ready.then(measure)

    // intro: corners and the scroll cue flicker in right after the wordmark
    const intro = gsap
      .timeline()
      .from(q('.corner'), { autoAlpha: 0, duration: 0.4, ease: FLICKER }, 0)
      .from(q('.cue'), { autoAlpha: 0, duration: 0.4, ease: FLICKER }, 0.25)
    tl.add(intro, 1.45)

    const cleanupSections = setupSections(root.current)
    return () => {
      removeEventListener('resize', measure)
      tl.remove(intro)
      cleanupSections()
    }
  }, [])

  return (
    <main ref={root} className="overlay">
      <h1 className="sr-only">Procyon Studios</h1>
      <div className="corners">
        <span className="corner">α CMi · PROCYON</span>
        <span className="corner">RA 07h 39m 18s · DEC +05° 13′ 30″</span>
      </div>

      <button type="button" className="cue label" onClick={() => go(1)}>
        Scroll <FiArrowDown aria-hidden />
      </button>

      <section className="b" aria-label="Stay tuned">
        <div ref={slot} id="logo-slot" />
        <div className="b-grid">
          <div>
            <p className="date label">Arriving Winter 2027</p>
            <h2 className="heading">
              <span className="heading-text">Something is being made</span>
              <span className="cursor" aria-hidden />
            </h2>
            <p className="description">
              <span className="brand">Procyon Studios</span> is a new independent game studio, currently at work on
              its first game.
            </p>
          </div>
          <div>
            <Notify />
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
        </div>
      </section>
    </main>
  )
}
