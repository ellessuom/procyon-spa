import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import markSvg from '../../assets/mark.svg?raw'
import wordSvg from '../../assets/wordmark.svg?raw'
import { MARK_DEPTH, WORD_DEPTH } from './constants'

const loader = new SVGLoader()

const shapesOf = (svg: string) =>
  loader.parse(svg.replaceAll('currentColor', '#fff')).paths.map((p) => SVGLoader.createShapes(p))

// bevelOffset = -bevelSize keeps the outline true, so the cut-outs in the bones and the Y stay open
const extrude = (shapes: THREE.Shape[], depth: number) =>
  new THREE.ExtrudeGeometry(shapes, {
    depth,
    curveSegments: 16,
    bevelEnabled: true,
    bevelThickness: 1.5,
    bevelSize: 0.7,
    bevelOffset: -0.7,
    bevelSegments: 4,
  }).translate(0, 0, -depth / 2)

/** The skull's pieces and one geometry per wordmark letter, extruded in logo.svg space. */
export function buildLogoGeometry() {
  const mark = shapesOf(markSvg).map((s) => extrude(s, MARK_DEPTH))
  const wordShapes = shapesOf(wordSvg)
  wordShapes.splice(4, 2, [...wordShapes[4], ...wordShapes[5]]) // the Y is two pieces (its cut)
  const letters = wordShapes.map((s) => extrude(s, WORD_DEPTH))
  return { mark, letters }
}
