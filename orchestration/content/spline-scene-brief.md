# Spline Scene Creative Brief — GOLM Hero 3D Visual

Brief for a custom `.splinecode` scene to replace the generic Spline robot placeholder.
Authorised by D-013. The scene lives in the hero's right-side panel on the landing page.

**Status:** this is a pre-launch commission requirement (listed as an Open item in
`decisions.md`). The current placeholder (robot demo) must be replaced before launch.

---

## Context

GOLM builds custom operations and logistics software for niche businesses. The brand
is clean, modern, and product-forward. The hero copy (landing.md) is honest and direct —
no hype, no generic tech visuals. The scene should feel like it belongs to that story:
the idea of something being built to fit, assembled precisely, working in a way that
generic things don't.

**What the scene is NOT:**
- Not a robot. Not humanoid. Not generic "tech in a globe."
- Not dark-mode, not dramatic. This is a light, calm page.
- Not decoration for its own sake — it should feel conceptually tied to the product idea.

**What the scene IS:**
- Abstract, crafted, slightly industrial but precise.
- Calm, confident, not frenetic.
- The kind of thing a thoughtful B2B founder finds credible, not gimmicky.

---

## Brand constraints

| Property | Value |
|---|---|
| Primary accent | `#4F46E5` (indigo) |
| Background | Transparent or near-white (`#FFFFFF` / `#F8FAFC`) — must sit on a light hero |
| Text colour (if any) | `#0F172A` (dark slate) — avoid text in the scene |
| Secondary neutral | `#E2E8F0` (light slate border), `#94A3B8` (muted) |
| Accent glow | A soft indigo `#4F46E5` radial glow behind the scene (handled in CSS/framer-motion, not necessarily in Spline itself) |
| Typography in scene | None preferred. If any, use Inter or a clean geometric sans |

**Colour usage:** indigo as the accent on key elements (connector nodes, active surfaces,
highlights). The bulk of geometry should be white or very light neutral with subtle
depth via shadows and bevel. One or two indigo elements pop — not a sea of purple.

---

## Motion requirements

**Idle animation (always running):**
- Slow, continuous, non-looping or seamless-looping. ~0.3–0.5 rpm equivalent.
- Should feel like something alive and working, not spinning for the sake of spinning.
- Subtle enough that a visitor reading the copy left-of-hero isn't distracted.

**Cursor-reactive motion (D-013 spec):**
- Gentle parallax / tilt-follow: as the cursor moves, the scene rotates or elements shift
  slightly toward it. Amplitude: small (±5–10°). Spring/ease response — not snappy.
- The cursor-follow glow (indigo radial, CSS-handled with framer-motion) sits behind the
  Spline canvas. The scene itself only needs its cursor-tilt to compose naturally with it.
- On mobile: cursor interaction is absent; idle animation only.

**No click interactions required for v1.** Keep the interaction surface small.

---

## Performance budget (critical)

The scene is on a conversion funnel landing page. LCP is a real concern.

| Constraint | Target |
|---|---|
| `.splinecode` file size | **< 2 MB** strongly preferred; hard cap 3 MB |
| Initial load | Lazy-loaded (`React.lazy` + `<Suspense>`) — the rest of the page renders first |
| Above-the-fold LCP | Scene must NOT block LCP. The hero copy (text) is the LCP element. |
| Fallback | A static PNG or SVG of the scene's "best frame" shown during Spline load / on mobile where 3D is suppressed |
| Mobile behaviour | Consider rendering the static fallback image on mobile (`max-width: 768px`) and skipping the WebGL scene entirely to protect mobile LCP |
| Polygon budget | Keep geometry simple — abstract forms, not detailed meshes. Low-poly intentional style is fine and preferred. |

**Implementation note for frontend-agent (D-013):** the scene wraps in a
`<SplineScene>` client-only component, inside `React.lazy` + `<Suspense>`. The static
PNG fallback is the `<Suspense>` fallback. Spline runtime (`@splinetool/runtime`) is
already a peer dep of `@splinetool/react-spline`; no extra bundle steps.

---

## Scene concepts — ranked

### Concept 1 (RECOMMENDED) — Modular Assembly

**Motif:** A set of clean geometric modules — cubes, panels, connector nodes — that
gradually assemble or lock into a cohesive structure. Think: the pieces of a custom
system finding their precise fit.

**Conceptual connection:** custom software is built to fit *your* operation, not a
generic template. The assembly metaphor lands this directly without needing words.

**Geometry:** 6–10 discrete geometric pieces (rounded rectangles, minimal extrusions,
connector cylinders). Dominant material: white/off-white with subtle bevel depth. 2–3
pieces highlighted in indigo `#4F46E5`.

**Idle motion:** pieces hover in slight orbit around a central structure, as if slowly
locking in. Or: the assembled structure rotates lazily on a central axis.

**Cursor-reactive:** the whole assembly tilts subtly toward the cursor. Individual
pieces could respond with slightly different parallax depths (foreground pieces
move more, background less) to create a sense of 3D depth without complexity.

**Fallback still:** the fully-assembled structure at its most composed angle.

**Production notes for the designer:**
- Keep faces flat or minimally bevelled — simpler geometry = smaller file.
- Avoid particle systems or high-poly meshes.
- Light source: top-front, soft, single directional — consistent with a light page.
- No glass/refraction materials (GPU heavy). Use flat or semi-matte.

---

### Concept 2 — Precision Instrument / Measurement

**Motif:** Something that evokes measurement, calibration, or precision — a minimal
abstract instrument dial, a set of nested arcs (like a radar or readiness gauge),
or a simple circular form with a moving indicator.

**Conceptual connection:** the quiz output is a scored number (0–100). The visual
language of measurement — a gauge, a calibrated arc — reinforces "this is a precision
read on your business," not a generic questionnaire.

**Geometry:** 3–5 concentric arc forms, a central number or indicator element (without
literal text), subtle tick marks. Clean, precise, instrument-like.

**Colour:** mostly white/light neutral, with the active/filled arc in indigo. Could
tie to the Readiness Score's radial gauge shown on the results page — creating visual
continuity across the funnel.

**Idle motion:** arcs rotate at slightly different speeds; the indicator traces a slow
arc. Very calm, almost clock-like.

**Cursor-reactive:** the structure tilts and the indicator moves slightly toward cursor,
as if being calibrated.

**Trade-off:** less immediately "interesting" visually than Concept 1. Works best if
the score-gauge motif is also present on the results page (creates continuity). Lower
file size risk — simpler geometry.

---

### Concept 3 — Connected Flow / Graph

**Motif:** A sparse, clean node-and-edge graph — a handful of nodes (rounded geometric
forms) connected by lines, suggesting interconnected systems or data flowing through
a network. Could animate with subtle "pulse" along edges.

**Conceptual connection:** operations software connects workflows, people, and data that
were previously disconnected. The graph makes the "one system that fits how you work"
idea literal without being literal.

**Geometry:** 5–8 node spheres/cubes at varying scales, thin edge lines. Some nodes
in indigo; most in white. Edges in light slate.

**Idle motion:** nodes drift very gently in 3D space; edges stretch to follow.
Occasional "pulse" travels along an edge (a small indigo sphere slides along the line).

**Cursor-reactive:** nodes cluster slightly toward the cursor position; the overall
graph compresses and expands like a living network.

**Trade-off:** has the highest risk of looking "generic tech startup." The rendering
must be clean and minimal to avoid it. Pulse animations add complexity and potential
performance cost. Ranked third for that reason.

---

## Deliverable spec for the Spline designer

When commissioning, share this brief and request:

1. **Two `.splinecode` files** for Concept 1 and Concept 2 (top two ranked) so Dave
   can choose.
2. **One static PNG export** per concept at `800×800px` (for the fallback / OG image use).
3. **File size check:** confirm each `.splinecode` is under 2 MB before delivery.
4. **Idle loop:** confirm the idle animation loops cleanly with no visible seam.
5. **Cursor-reactive event:** the scene should export with a Spline `onMouseMove`-
   compatible event that drives the tilt, so the `react-spline` integration can pass
   mouse coordinates directly.
6. **Background:** transparent or `rgba(0,0,0,0)` — do NOT bake a background into the
   scene. The hero section background is handled by CSS.

---

## Integration checklist (for frontend-agent)

Once the `.splinecode` file is received:

- [ ] Place `.splinecode` in `public/spline/` (served as a static asset, not bundled)
- [ ] Confirm `@splinetool/react-spline` and `@splinetool/runtime` are in `package.json`
- [ ] Wrap in `client-only` boundary: `const SplineScene = dynamic(() => import(...), { ssr: false })`
- [ ] Wrap in `<Suspense fallback={<img src="/spline/hero-fallback.png" ... />}>`
- [ ] Add `framer-motion` cursor-follow glow: indigo `#4F46E5` radial gradient `<div>`
  behind the canvas, tracking `mousemove` with spring easing
- [ ] Test: LCP is the headline text, not the Spline canvas
- [ ] Test: mobile renders the static fallback PNG, not the WebGL scene (CSS or
  `useMediaQuery` guard at 768px)
- [ ] Test: file loads within 2 seconds on a simulated 4G connection (Lighthouse throttling)

---

## Open questions for Dave

1. **Commission path:** do you have a Spline designer in mind, or should we source via
   the Spline community / Upwork / Contra? Concept 1 (Modular Assembly) is clear enough
   to brief a junior Spline freelancer — it doesn't require a senior motion designer.
   Estimated effort: 4–8 hours of Spline work.

2. **Concept preference:** Concept 1 (assembly) vs. Concept 2 (measurement/gauge) is
   primarily a brand feel question. Concept 1 is more visually interesting and unique;
   Concept 2 has better conceptual continuity with the quiz score output. Your call.

3. **Fallback handling on mobile:** skip WebGL entirely on mobile (static PNG) vs. load
   a simpler version. Skipping entirely is the safer LCP choice — confirm this is the
   desired behaviour before the frontend-agent wires it.

4. **Timeline:** is this needed for the launch stream, or is the placeholder robot
   acceptable for the stream and the custom scene shipped post-stream? If post-stream,
   the placeholder stays and this brief is the commission spec to hand off after.
