import { useLogoSlot } from './hooks/useLogoSlot'
import NotifyForm from './notify/NotifyForm'
import Socials from './socials/Socials'

/** Section B: the 3D skull is placed in #logo-slot; the copy and sign-up sit at the bottom. */
export default function StayTuned() {
  const slot = useLogoSlot()

  return (
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
            <span className="brand">Procyon Studios</span> is a new independent game studio, currently at work on its
            first game.
          </p>
        </div>
        <div>
          <NotifyForm />
          <Socials />
        </div>
      </div>
    </section>
  )
}
