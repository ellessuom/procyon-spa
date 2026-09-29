# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Coming-soon site for Procyon Studios, live at https://prcyn.com. The repo is public. It uses React 19, React Three Fiber, drei, postprocessing, GSAP, Vite and TypeScript.

## Commands

```sh
npm run dev      # http://localhost:5173
npm run lint     # ESLint (CI runs this)
npm run format   # Prettier: no semicolons, single quotes, 120 cols
npm run build    # tsc type-check + vite build → dist/ (CI runs this)
```

There are no tests. `?t=0.8` in the URL freezes the intro at that second, which is useful for screenshots.

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`) after lint and build pass.

## Architecture

**Animation data flow.** Everything that animates is a plain number on the `anim` object in `src/animation/state.ts`. GSAP timelines write these values, and R3F `useFrame` hooks read them every frame to update three.js objects, materials and shader uniforms. React never re-renders during the animation. To add an animated property:

1. Add a field to `anim`.
2. Tween it in a timeline.
3. Read it in a `useX` hook's `useFrame`.

Hooks that mutate three.js objects in `useFrame` use `/* eslint-disable react-hooks/immutability */`, because this mutation is expected in R3F.

**Two timelines, both module singletons in `src/animation/`:**

- `introTimeline` plays once on mount, from `startIntro()` in `Scene.tsx`. A glitchy circle spins and morphs into the skull, then cuts to the 3D mark, then the wordmark letters glitch in. The overlay's DOM tweens are attached to it later, from `useOverlayAnimations`.
- `sectionsTimeline` is the A ↔ B jump. It is played forward to reach B and **reversed** to return to A, so the choreography only has to be written once. It is built from the overlay's DOM using `gsap.utils.selector` and SplitText, and all of section B starts hidden with `autoAlpha: 0`.

**Navigation.** There is no native scroll. `useSectionNavigation` uses GSAP Observer (wheel and touch) plus keydown to call `goToSection`. `goToSection` ignores input until the intro finishes and while a jump is running. `sectionForKey` lets keys behave normally in inputs, and lets Space press a focused button or link.

**Positions come from the DOM.** In section B, the 3D skull is placed inside the empty `#logo-slot` div. `useLogoSlot` measures the div in pixels, converts that to world units with `VIEW_H`, and writes the result to `pose`. `useLogoAnimation` interpolates between the section A fit and `pose` using `anim.section`. To move the logo in B, change the CSS for `#logo-slot`, not the scene code.

**Logo assets.** `mark.svg` (the skull) and `wordmark.svg` share the coordinate space of `logo.svg`: 330 × 488, with y pointing down. `scene/logo/constants.ts` maps that space to world units using the scale `S`. The SVGs are imported with `?raw` and used in three places:

- SVGLoader extrudes them into the 3D logo (`scene/logo/geometry.ts`), with one mesh and material per letter.
- The skull is rasterised into a signed distance field with `bitmap-sdf` for the circle-to-skull shader morph (`scene/morph/`).
- They are inlined as the no-WebGL `<Canvas fallback>` in `App.tsx`.

**Post effects.** Post effects live in `scene/effects/`. A permanent thin chromatic aberration is part of the look, and `anim.aberration` and `anim.glitchFx` add to it.

**Email sign-up.** The Notify form is our own UI. `useNotifyForm` posts it to Kit's public form endpoint: no API key, and no Kit embed or styling. Kit answers 200 even when it doesn't add the subscriber, so check the JSON `status`:

- `"success"` means the subscriber was added.
- `"quarantined"` means Kit's bot guard flagged the sign-up, and the visitor must pass a reCAPTCHA at the returned `url`. We show that as a link that opens in a new tab.

Headless browsers are always quarantined, so automated tests never create a real subscriber. The form also has a honeypot field: when a bot fills it, the form shows success and sends nothing.

**CSS.** `styles/index.css` imports the partials in cascade order, and the order matters. `.crt` is a full-screen DOM overlay placed above the canvas.

**Vite.** `vite.config.ts` pre-bundles deep and CommonJS imports (for example `gsap/*`, `three/addons/*`, `bitmap-sdf` and `react-icons/*`). When you add a new import of that kind, add it to `optimizeDeps.include`, or the first dev load returns 404s.

## Conventions

- Files stay short (about 80 lines or fewer). Components only compose JSX. Per-frame and effect logic goes in `useX` hooks next to the component, and pure math goes in plain `.ts` modules. Use the existing feature folders: `animation/`, `navigation/`, `scene/{logo,morph,effects}`, `overlay/{hooks,notify,socials}` and `styles/`.
- Prefer library effects (drei, @react-three/postprocessing, GSAP plugins such as SplitText, Observer and RoughEase) over hand-written ones. Write custom code only where no library fits, such as the morph shader. `FLICKER` in `animation/eases.ts` is the shared glitch ease.
- The site deliberately **ignores `prefers-reduced-motion`**. The owner chose this, so don't add reduced-motion handling back unless asked.
- These placeholders are known and still need fixing: in `overlay/socials/links.ts` the social links are `#` and the email is a placeholder.
