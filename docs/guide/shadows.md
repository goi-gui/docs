---
title: Shadows
---

# Shadows

`shadow` draws a CSS-style shadow. On `Text` it shadows the glyphs, the way
`text-shadow` does; on every other element it shadows the box, the way
`box-shadow` does. The property name is the same, so a design reads the same
wherever it sits.

```goi
Text {
	text:   "Example"
	shadow: 2 2 5 #000000
}

Card {
	label:  "Raised"
	shadow: 0 4 12 2 #00000026
}
```

A shadow paints outside the element's box, so it never changes layout: no
sibling moves and no parent grows.

On a component that already has an M3 elevation — a `Button`, a `Card` — an
explicit `shadow` replaces that elevation instead of drawing on top of it.
`shadow: none` is the way to remove it.

## The syntax

One shadow is `x y [blur [spread]] [color] [inset]`, in that order. Only the two
offsets are required.

| Part | Meaning |
|---|---|
| `x y` | the offset in logical pixels; negative values are allowed |
| `blur` | how far the edge fades; `0` is a hard edge |
| `spread` | how much the shape grows before it is blurred (box only); negative shrinks it |
| `color` | a `#rrggbb` literal, a theme role such as `primary`, or left out |
| `inset` | paints inside the shape instead of behind it (box only) |

When the colour is left out, the scheme's shadow colour is used, so a dark theme
does not get a black smudge on a black page.

## Text

A text shadow is an offset copy of the whole run, softened by `blur`. Because it
follows the glyphs, it works the way `text-shadow` does: a hard copy with no
blur outlines the letters, and four hard copies in a ring fake a border.

```goi
Text {
	text:   "Soft"
	shadow: 1 1 3 onSurfaceVariant
}

Text {
	text:   "Outlined"
	shadow: -1 0 #000000, 0 1 #000000, 1 0 #000000, 0 -1 #000000
}
```

`spread` and `inset` have no meaning for glyphs and are ignored there.

## Boxes

A box shadow starts from the element's own shape: a `Card` keeps its M3 corners,
a `Button` stays a pill, and an explicit `radius` wins over both. That keeps a
shadow matching the box it belongs to without repeating the radius.

```goi
Rectangle {
	width:      200
	height:     100
	background: theme.surfaceContainerHigh
	radius:     16
	shadow:     0 8 24 4 #00000033
}

Rectangle {
	width:      200
	height:     100
	background: theme.primary
	radius:     16
	// A hard ring, like a focus outline, plus a pressed-in panel.
	shadow:     0 0 0 3 #ff0000, 0 4 12 #000000 inset
}
```

`inset` mirrors CSS: the shadow is drawn inside the box, with the offset moving
the hole it fades from. Use it for a sunken field, a pressed button or a photo
frame.

## Several shadows

Layers are separated by commas and painted in order, so the first one is on top.
This is how a shadow, a glow and a ring combine without extra elements:

```goi
Rectangle {
	width:      240
	height:     120
	radius:     16
	background: theme.surfaceContainerHigh
	shadow:     0 1 2 #00000026, 0 8 24 4 #0000001f, 0 0 0 1 primary
}
```

`shadow: none` removes the shadow, which is useful when a value is toggled from
Go.

## From Go

The property takes the same layers:

```go
card.SetShadow(ui.Shadow{X: 0, Y: 4, Blur: 12, Spread: 2, Color: 0x00000026})
card.ClearShadow()
```

Call it from `Bind`, which runs again after every hot reload: the design's own
`shadow:` wins on the next save.

## Differences from CSS

The model is CSS's, with the parts this framework does not have dropped.

- There is no `spread` for text, and `inset` is a box idea only; both are
  ignored on `Text`.
- The text blur is a Gaussian rasterized per glyph and cached in the glyph atlas,
  so a shadow does not cost extra quads or shader taps. A blur past 40px is
  capped, because past that the text is unreadable anyway.
- The colour axis is the theme: a role name follows the scheme, which CSS has no
  notion of.
- A shadow never affects layout. A parent that clips its children is the only
  thing that can cut it off, so a shadow on a scrolled row is trimmed at the
  viewport edge, exactly as CSS would trim it.
