const params = new URLSearchParams(location.search)

/** ?t=0.8 freezes the intro on that second (for screenshots). */
export const frozenAt = params.get('t')

// Dev ignores the OS setting so the intro can be worked on; ?reduced tests that path.
export const reducedMotion =
  params.has('reduced') || (!import.meta.env.DEV && matchMedia('(prefers-reduced-motion: reduce)').matches)
