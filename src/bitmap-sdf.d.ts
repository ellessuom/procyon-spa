declare module 'bitmap-sdf' {
  /** Signed distance field of an image: 1 - (distance / radius + cutoff), clamped to 0..1 (edge = 1 - cutoff). */
  export default function calcSDF(
    src: HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
    options?: { cutoff?: number; radius?: number; channel?: number },
  ): Float32Array
}
