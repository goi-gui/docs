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
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | current value |
| `fontSize` | number | overrides the role's size |
| `weight` | number | overrides the role's weight |
| `color` | string | text colour role |
| `align` | enum | `start`, `center`, `end`; text alignment inside the box |
| `wrap` | bool | wrap at the node width |
| `role` | string | M3 type-scale role |
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

On `Text`, `shadow` shadows the glyphs rather than the box, borrowing CSS
`text-shadow`, so `shadow: -1 0 #000000, 0 1 #000000, 1 0 #000000, 0 -1 #000000`
outlines the letters. See [Shadows](../guide/shadows.md).

Every element also accepts the [common properties](../components.md#common-properties).
