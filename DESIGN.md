# Design Brief

## Direction

Premium Digital Marketing Agency — Professional multi-page platform showcasing marketing services with confident, elevated brand presence.

## Tone

Refined and confident; leveraging the agency's distinctive gold DM arrow brand as the primary design anchor with clean modern typography and generous whitespace.

## Differentiation

Gold accent color (H:65 amber) paired with DM Sans body font creates a branded system that reinforces the agency's identity through typography and color discipline, not decoration.

## Color Palette

| Token       | OKLCH         | Role                                |
| ----------- | ------------- | ----------------------------------- |
| background  | 0.98 0.01 80  | Primary surface; warm light base    |
| foreground  | 0.15 0.02 270 | Primary text; deep navy             |
| card        | 1.0 0 0       | Elevated surfaces; pure white       |
| primary     | 0.62 0.22 65  | Brand gold/amber accent             |
| secondary   | 0.2 0.03 270  | Deep navy; secondary hierarchy      |
| accent      | 0.62 0.22 65  | Interactive highlights; gold        |
| destructive | 0.55 0.22 25  | Error/danger states; coral red      |
| muted       | 0.92 0.01 270 | Subtle backgrounds; light gray      |

## Typography

- Display: Space Grotesk — Modern geometric sans for headings and hero text; conveys confidence and agency expertise.
- Body: DM Sans — Professional, minimal sans-serif; aligns with "Digital Marketing" branding identity.
- Scale: Hero `text-5xl md:text-7xl font-bold tracking-tight`, H2 `text-3xl md:text-4xl font-bold`, Label `text-sm font-semibold tracking-widest uppercase`, Body `text-base leading-relaxed`.

## Elevation & Depth

White card surfaces on warm-tinted background with premium shadows (`shadow-premium` for static, `shadow-hover` on interaction) create clear surface hierarchy without heavy effects.

## Structural Zones

| Zone    | Background              | Border               | Notes                                        |
| ------- | ----------------------- | -------------------- | -------------------------------------------- |
| Header  | `bg-card border-b`      | `border-border`      | White header with gold accent on logo/links  |
| Hero    | `bg-background`         | —                    | Warm background with centered gold accent   |
| Content | Alternating `bg-card` / `bg-background` | — | White cards on warm tinted sections          |
| Footer  | `bg-secondary border-t` | `border-border`      | Deep navy footer mirrored to header layout   |

## Spacing & Rhythm

Generous 2–3 section gaps (lg:gap-16) with 4–6 card padding create breathing room for premium feel. Micro-spacing: 12px section labels, 16px button padding, 8px icon-to-text gaps.

## Component Patterns

- Buttons: Gold primary (`bg-primary text-primary-foreground`), white/outline secondary, hover shadow elevation
- Cards: White background, `rounded-lg`, `shadow-premium`, gold `border-l` accent on service cards
- Badges: Uppercase label styling, gold background for highlights, secondary background for neutral states
- Links: Gold underline on hover via `border-b-2 border-primary` with `transition-smooth`

## Motion

- Entrance: Page sections animate `animate-fade-in` on viewport entry (0.4s ease-out)
- Hover: Card elevation via `shadow-hover` on `hover:shadow-hover`, button text color shift with `transition-smooth`
- Decorative: Subtle fade for image load, no bouncing or excessive animation

## Constraints

- No gradients on background; linear gradient only on accent/highlight elements
- All colors must be expressed as OKLCH variables; no hex or RGB literals
- Typography must maintain AA+ contrast on both light and dark modes
- Maximum 2 font families (Space Grotesk display, DM Sans body, monospace fallback)

## Signature Detail

Gold left border on service cards with premium shadow depth creates a distinctive design signature while reinforcing the agency's brand color and premium positioning.
