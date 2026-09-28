import * as THREE from 'three'
import calcSDF from 'bitmap-sdf'
import markSvg from '../../assets/mark.svg?raw'
import { CUTOFF, CX, CY, RADIUS, RES, SPAN } from './constants'

/** The skull as a signed distance field (bitmap-sdf), so the shader can morph a circle into it. */
export function skullField() {
  const canvas = Object.assign(document.createElement('canvas'), { width: RES, height: RES })
  const ctx = canvas.getContext('2d')!
  const k = RES / SPAN
  ctx.setTransform(k, 0, 0, k, -(CX - SPAN / 2) * k, -(CY - SPAN / 2) * k)
  for (const [, attrs] of markSvg.matchAll(/<path([^>]*)>/g)) {
    const d = /\sd="([^"]+)"/.exec(attrs)?.[1]
    if (d) ctx.fill(new Path2D(d), attrs.includes('evenodd') ? 'evenodd' : 'nonzero')
  }
  const field = calcSDF(canvas, { cutoff: CUTOFF, radius: RADIUS, channel: 3 }) // alpha keeps AA edges exact
  const pixels = Uint8Array.from(field, (v) => v * 255)
  const tex = new THREE.DataTexture(pixels, RES, RES, THREE.RedFormat)
  tex.minFilter = tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}
