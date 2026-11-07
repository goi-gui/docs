# Text

One run of text at a Material 3 type-scale role.

[All components](../components.md)

## In a `.goi` file

```goi
Text {
	text: "Body copy"
	role: "bodyMedium"
	wrap: true
	width: 320
}

Text {
	text:   "Headline"
	role:   "displaySmall"
	shadow: 0 2 6 onSurfaceVariant
}

Text {
	text:            "Underlined link"
	fontStyle:       italic
	decoration:      underline
	decorationStyle: wavy
	decorationColor: primary
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | current value |
| `fontSize` | number | overrides the role's size |
| `weight` | number | overrides the role's weight; 100–900 |
| `fontWeight` | number or keyword | CSS spelling of `weight`: `normal`, `bold`, `bolder`, `lighter`, or a number; shares the same cell |
| `fontStyle` | enum | `normal`, `italic`; italic is synthesized, since Roboto italic is not embedded |
| `color` | string | text colour role |
| `align` | enum | `start`, `center`, `end`; text alignment inside the box |
| `wrap` | bool | wrap at the node width |
| `role` | string | M3 type-scale role |
| `decoration` | keywords | any of `underline`, `overline`, `line-through`, combined with spaces; `none` clears |
| `decorationStyle` | enum | `solid`, `wavy`, `dotted`, `double`, `dashed` |
| `decorationThickness` | number | stroke width in dp; the default follows the font size |
| `decorationColor` | color | stroke colour; defaults to the text colour |
| `selectable` | bool | pointer selection and Ctrl+C |
| `shadow` | shadow | text-shadow form: an offset copy of the glyphs per layer |

## From Go

```go
label := ui.MustByID[*ui.Text](w, "counter")
label.Text.Set(strconv.Itoa(n))
label.Role.Set("headlineMedium")

// Selectable body copy.
body := ui.MustByID[*ui.Text](w, "notes")
body.Selectable.Set(true)
```

`weight` and `fontWeight` are the same property under two names: `fontWeight`
adds the CSS keywords, and the last one written wins. `bolder` and `lighter`
step from the role's own weight to the next weight the embedded font actually
has, so they never land on a face the shaper lacks.

A decoration borrows CSS `text-decoration`: the strokes combine, and one style
applies to all of them.

On `Text`, `shadow` shadows the glyphs rather than the box, borrowing CSS
`text-shadow`, so `shadow: -1 0 #000000, 0 1 #000000, 1 0 #000000, 0 -1 #000000`
outlines the letters. See [Shadows](../guide/shadows.md).

Every element also accepts the [common properties](../components.md#common-properties).
