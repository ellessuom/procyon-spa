# Procyon Studios

Coming-soon site for [Procyon Studios](https://prcyn.com), an independent game studio.

A glitchy intro morphs a circle into the studio's skull mark, which then turns into a 3D logo. One scroll, swipe or key press jumps to the "stay tuned" section.

**Stack:** React 19, [React Three Fiber](https://r3f.docs.pmnd.rs) + drei + postprocessing, [GSAP](https://gsap.com) (timelines, SplitText, Observer), Vite, TypeScript.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run format
npm run build    # type-check + production build to dist/
```

Debug URL param: `?t=0.8` freezes the intro at that second (handy for screenshots).

## How it's put together

```
src/
├── animation/    GSAP timelines + the shared `anim` state they write (framework-free)
├── navigation/   A ↔ B section state and input (wheel, touch, keys)
├── scene/        R3F canvas content: lighting, post effects, 3D logo, shader morph
├── overlay/      DOM layer: corners, scroll cue, section B, notify form, socials
├── styles/       global CSS partials, imported in cascade order by index.css
└── assets/       logo SVGs (logo.svg is the source artwork)
```

GSAP timelines write plain numbers into `animation/state.ts`, and the R3F `useFrame` hooks read them every frame. React never re-renders during the animation.

## Deploy

Every push to `main` runs lint and build, then deploys `dist/` to GitHub Pages (`.github/workflows/deploy.yml`). The site is served at https://prcyn.com.
