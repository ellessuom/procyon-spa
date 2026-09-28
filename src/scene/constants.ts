import * as THREE from 'three'

export const CAMERA_Z = 8
export const CAMERA_FOV = 35

/** Visible world height at z = 0, i.e. how many world units the viewport is tall. */
export const VIEW_H = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))
