import { useMemo } from 'react'
import { buildLogoGeometry } from './geometry'
import { randomWordThresholds } from './letters'
import { createLogoMaterial } from './material'

export type LogoParts = ReturnType<typeof useLogoParts>

/** Geometry, materials and letter thresholds for the 3D logo, built once. */
export function useLogoParts() {
  const { mark, letters } = useMemo(() => buildLogoGeometry(), [])
  const material = useMemo(() => createLogoMaterial(), [])
  // each letter gets its own material so it can flash on its own
  const letterMaterials = useMemo(() => letters.map(() => material.clone()), [letters, material])
  const wordThresholds = useMemo(() => randomWordThresholds(letters.length), [letters])
  return { mark, letters, material, letterMaterials, wordThresholds }
}
