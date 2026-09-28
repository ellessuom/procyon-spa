import * as THREE from 'three'

/** Ivory clearcoat for the 3D logo. Starts invisible; opacity and the warm glow are animated. */
export const createLogoMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: '#efe6cf',
    roughness: 0.38,
    metalness: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
    emissive: '#ffd9a0',
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0,
  })
