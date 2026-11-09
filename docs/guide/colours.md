# Colours

Every colour a `.goi` file writes follows CSS. That is deliberate: CSS colours
are the thing a designer and a browser both already know, so a design tool's
palette, a stylesheet and a goi file agree on paper.

A colour goes anywhere the schema says `color`: `Text.color`,
`Rectangle.background`, `borderColor`, `decorationColor`, `scrollbarColor`, a
shadow's colour, and so on.

[All components](../components.md)

## The four ways to name a colour

| Form | Example | Follows the theme? |
|---|---|---|
| A theme role | `theme.primary` | yes |
| A CSS name | `white`, `tomato`, `rebeccapurple` | no, it is a literal |
| A CSS function | `"rgb(42, 123, 155)"`, `"hsl(200 40% 50%)"` | no |
| A hex literal | `#3b82f6`, `#38f`, `#3b82f680` | no |
| An app colour | `customColor.brand` | as the app defines it |

The first is the one to reach for in a design: it is the only form that follows
the light/dark scheme, so one design serves both. The rest are literals, which
is what a deliberate accent or a screenshot colour wants.

```goi
Column {
	Text {
		text:  "themed"
		color: theme.primary
	}

	Text {
		text:  "themed"
		color: theme.onSurfaceVariant
	}

	Text {
		text:  "literal"
		color: white
	}

	Text {
		text:  "brand"
		color: customColor.brand
	}
}
```

## CSS names

All 148 CSS colour names work, bare or quoted. The list is the CSS Color Module
Level 4 one, including the synonyms: `grey` and `gray`, `aqua` and `cyan`,
`fuchsia` and `magenta`, plus `rebeccapurple`.

A bare word is tried as a CSS keyword first and only then as a theme role. That
order is what makes `color: white` a literal rather than an undefined name, and
it costs nothing: no Material role is spelled like a CSS keyword.

## CSS functions

`rgb()`, `rgba()`, `hsl()` and `hsla()` are written the way CSS writes them, in
either spelling:

```goi
Text { text: "legacy" color: "rgb(42, 123, 155)" }
Text { text: "modern" color: "rgb(42 123 155 / 50%)" }
Text { text: "alpha"  color: "rgba(42, 123, 155, 0.5)" }
Text { text: "hue"    color: "hsl(200 40% 50%)" }
```

A function is quoted, because `.goi` would otherwise read the parentheses as an
expression. Channels may be percentages, and the alpha is `0`–`1` or a
percentage.

## Gradients

`background` takes a CSS gradient:

```goi
Column {
	background: "linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)"
}

Column {
	background: "radial-gradient(circle, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)"
}
```

- **linear** runs along an angle. `0deg` points up and `90deg` points right, as
  in CSS; `to right`, `to bottom left` and the other direction words work too,
  and the default is `to bottom`.
- **radial** runs out from the box's centre to its farthest corner. `circle`,
  `ellipse`, `closest-side` and the other size words are accepted, and the
  element's own box is the circle.
- A stop may carry a position (`0%`, `50%`, `100%`, or `0`–`1`). A stop without
  one is spread evenly between its neighbours, and the ends default to 0% and
  100%.
- The box keeps its `radius` and its `borderColor`/`borderWidth`, drawn on top of
  the fill.
- Only `background` takes a gradient. A gradient on `color` or `borderColor` is a
  checker error: it fills a box, not a stroke or a glyph.

A gradient is a whole value, so write it quoted. A theme role inside a gradient
is not resolved; use a literal there, because a gradient is parsed once from the
string rather than re-resolved per theme.

## Rotating a colour

No: colours do not rotate. But `rotate` is CSS's too, so a turned card keeps its
gradient, its border and its radius:

```goi
Column {
	width:      120
	height:     80
	radius:     8
	background: "linear-gradient(90deg, #2a7b9b, #57c785)"
	rotate:     45deg
}
```

See [syntax](../syntax.md#rotate) for every rotate form.

## See also

- [Theming](theming.md) — the scheme, and how to build one.
- [Custom colours](custom-colors.md) — colours the app defines in Go.
- [syntax](../syntax.md#colours-and-gradients) — the terse reference table.
