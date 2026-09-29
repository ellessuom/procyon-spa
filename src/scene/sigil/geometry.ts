import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import glyphsSvg from '../../assets/sigil-glyphs.svg?raw'
import { GLYPH, GLYPH_STROKE, R_MID } from './constants'

const stroke = SVGLoader.getStrokeStyle(GLYPH_STROKE, '#fff', 'round', 'round')

/**
 * One flat stroked geometry per glyph in sigil-glyphs.svg, already placed on the unit ring:
 * glyph i at angle i / n from the bottom, its top pointing at the centre (so the visible lower half reads upright).
 */
export function buildGlyphs() {
  const paths = new SVGLoader().parse(glyphsSvg).paths
  return paths.map((path, i) => {
    // all of a glyph's strokes go into one buffer, each appended after the last (offset in vertices, 3 numbers each)
    const vertices: number[] = []
    for (const sub of path.subPaths) {
      const offset = vertices.length / 3
      SVGLoader.pointsToStrokeWithBuffers(sub.getPoints(), stroke, undefined, undefined, vertices, [], [], offset)
    }
    const k = GLYPH / 24
    return new THREE.BufferGeometry()
      .setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      .center() // on its own box, so the grid position in the SVG doesn't matter
      .scale(k, -k, 1) // SVG y points down
      .translate(0, -R_MID, 0)
      .rotateZ((i / paths.length) * Math.PI * 2)
  })
}
