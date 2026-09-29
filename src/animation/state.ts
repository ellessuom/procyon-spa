// Every animated value lives here. GSAP writes, the scene reads each frame.
export const anim = {
  vis: 0, // glitch shape visibility
  morph: 0, // 0 = circle, 1 = skull
  spin: Math.PI * 2.5, // radians left to spin (1.25 turns → 0)
  distort: 1, // noise wobble on the circle
  fill: 0, // 0 = ring outline, 1 = filled
  glitch: 0, // slice jitter + RGB split on the shape
  solid: 0, // 3D mark
  hot: 0, // warm glow on the 3D mark right after the cut
  aberration: 0, // extra full-screen RGB split on top of the permanent thin one
  letters: Array.from({ length: 14 }, () => ({ p: 0 })), // PROCYON + STUDIOS
  section: 0, // 0 = A (logo centred), 1 = B (skull only, small, top-centre)
  word: 1, // wordmark shown; drops to 0 (letters glitch out) on the way to B
  glitchFx: 0, // 1 = full-canvas glitch tearing (during the A ↔ B jump)
  sigil: 0, // the sigil ring's two border lines
  glyphs: Array.from({ length: 24 }, () => ({ p: 0 })), // the ring's glyphs, one per path in sigil-glyphs.svg
}

/** Where the logo sits in section B, in world units — measured from the DOM (#logo-slot) by useLogoSlot. */
export const pose = { y: 1.5, scale: 0.5 }
