# Design System Specification: High-End Editorial Glassmorphism

## 1. Overview & Creative North Star: "The Luminous Observer"
This design system is built on the philosophy of **"The Luminous Observer."** It rejects the heavy, opaque "blockiness" of traditional mobile UI in favor of a weightless, atmospheric experience inspired by high-end optics. 

We move beyond the standard "glass card" trend by focusing on **tonal depth and optical realism.** Instead of a flat grid, the layout should feel like a series of suspended lenses. We use intentional asymmetry—such as oversized display typography paired with generous, "breathing" negative space—to break the template feel. The interface doesn't just sit on the screen; it inhabits a three-dimensional space of light and shadow.

---

## 2. Color Palette & The "No-Line" Philosophy
The palette is a sophisticated gradient of deep amethysts and cool lavenders, grounded by a near-black obsidian foundation.

### Core Tokens
- **Background:** `#131318` (The deep void behind the glass)
- **Primary:** `#cebdff` (Soft Lavender for high-action touchpoints)
- **Primary Container:** `#7d5adc` (Rich Royal Purple for depth)
- **Surface Tiers:** Use `surface_container_lowest` (#0e0e13) through `surface_container_highest` (#35343a) to define hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through:
1.  **Background Shifts:** Place a `surface_container_low` card against the `background` to create a natural edge.
2.  **Tonal Transitions:** Use subtle shifts in value rather than structural lines.
3.  **The Glass & Gradient Rule:** CTAs should never be flat. Use a linear gradient from `primary` to `primary_container` at a 135-degree angle to provide a "soul" and professional polish.

---

## 3. Typography: Editorial Authority
We utilize a dual-font approach to balance precision with character.

- **Display & Headlines (Manrope):** Chosen for its geometric purity. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. This creates an "Editorial" impact that feels curated, not templated.
- **Body & Labels (Inter):** A high-legibility sans-serif. Use `body-md` (0.875rem) for the majority of text. 
- **The Hierarchy Rule:** Create contrast by pairing `display-sm` headlines with `label-sm` metadata in all-caps with increased letter-spacing (0.05em). This "High-Low" pairing is a hallmark of premium fashion and tech aesthetics.

---

## 4. Elevation & Depth: The Layering Principle
True premium design is felt through the physics of the UI. Avoid traditional drop shadows.

### Stacking Tiers
Depth is achieved by "stacking" surface tokens. 
- **Level 0 (Base):** `background` (#131318).
- **Level 1 (Sections):** `surface_container_low` (#1b1b20).
- **Level 2 (Cards):** `surface_container_highest` (#35343a).

### Ambient Shadows
When an element must float (e.g., a Modal or FAB), use an **Ambient Shadow**:
- **Color:** A tinted version of `on_surface` (e.g., #e4e1e9) at 4%–8% opacity.
- **Blur:** Large values (20px–40px) to mimic natural, diffused light.

### Ghost Borders & Glassmorphism
- **The Ghost Border:** If containment is required for accessibility, use the `outline_variant` token at **15% opacity**. Never 100%.
- **Backdrop Blur:** All floating containers must utilize `backdrop-filter: blur(20px)`. This allows the rich purples of the background to bleed through, ensuring the UI feels integrated rather than "pasted on."

---

## 5. Signature Components

### Buttons
- **Primary:** Gradient from `primary` to `primary_container`. Radius: `full` (9999px). No border.
- **Tertiary (Glass):** Background: `on_surface` at 10% opacity. Backdrop-blur: 12px. This creates the signature "Apple Glass" look.
- **Padding:** Use spacing `3` (1rem) for vertical and `6` (2rem) for horizontal to ensure an elegant, elongated silhouette.

### Form Inputs
- **Style:** Understated and "Lens-like." 
- **Background:** `surface_container_highest` at 40% opacity. 
- **Active State:** Instead of a thick border, use a subtle "glow" by applying a 1px `outline` at 20% opacity and a soft lavender outer shadow.

### Cards & Lists
- **The Divider Ban:** Strictly forbid the use of horizontal divider lines. 
- **Separation:** Separate content using the spacing scale (e.g., `spacing.4` for vertical air) or by nesting a `surface_container_high` element inside a `surface_container_low` wrapper.
- **Radius:** Standardize on `xl` (3rem) for parent cards and `md` (1.5rem) for inner nested elements to create a rhythmic, concentric flow.

### Innovative Component: The "Aura" Chip
- A selection chip that has no background in its default state, but gains a soft, blurred lavender "aura" (glow) behind it when selected, rather than a solid fill.

---

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetry:** Place a large headline on the left and a small label on the far right to create a sophisticated, editorial balance.
- **Embrace Breathing Room:** Use `spacing.12` (4rem) between major sections to let the "Glass" breathe.
- **Color the Light:** Ensure shadows have a purple tint to match the `on_secondary_container` tone.

### Don’t:
- **Don’t use 100% Black:** Even in dark mode, use `surface_container_lowest` for the darkest elements to maintain a sense of "material."
- **Don’t Overlap Blurs:** Too many layers of `backdrop-filter` will kill performance and look "muddy." Limit glass layers to two deep.
- **Don’t use Standard Grids:** Avoid perfectly centered, boxy layouts. Shift elements slightly off-axis to create visual interest.