# Button

The ordinary Material 3 button. Five variants share one element.

[All components](../components.md)

## In a `.goi` file

```goi
Button {
	label: "Filled"
}

Button {
	label:   "Tonal"
	variant: tonal
}

Button {
	label:   "Outlined"
	variant: outlined
}

Button {
	label:   "Text"
	variant: text
}

Button {
	label:   "Elevated"
	variant: elevated
}

Button {
	label:   "Save"
	icon:    check
	variant: filled
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | `filled` (default), `tonal`, `elevated`, `outlined`, `text` |
| `color` | color | label and icon colour; unset keeps the variant's own |
| `disabled` | bool | dims the element and blocks input |

The design can style the box itself: `background` (solid or a gradient),
`borderColor`, `borderWidth` and the per-side border properties, `radius` and
`shadow` replace the variant's own fill, outline, shape and elevation. The
common properties are listed once in
[Common properties](../components.md#common-properties).

## From Go

```go
btn := ui.MustByID[*ui.Button](w, "save")
btn.OnClick(func(ui.ClickEvent) {
	btn.Label.Set("Saved")
	btn.Disabled.Set(true)
})
```

Every element also accepts the [common properties](../components.md#common-properties).
