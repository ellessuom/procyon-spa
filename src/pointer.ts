// Last pointer position in NDC (-1..1) and when it last moved — mouse and touch alike.
export const pointer = { x: 0, y: 0, at: -Infinity }

// Where the spotlight is currently aimed (world units); the mark tilts toward it.
export const focus = { x: 0, y: 0 }

const track = (e: PointerEvent) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1
  pointer.y = -(e.clientY / innerHeight) * 2 + 1
  pointer.at = performance.now()
}
addEventListener('pointermove', track)
addEventListener('pointerdown', track)
