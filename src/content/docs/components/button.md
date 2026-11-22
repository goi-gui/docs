---
title: "Button"
---

The ordinary Material 3 button. Five variants share one element, with a text
label that takes the same typography as [Text](/components/text/), an optional
icon at each end, and `$leading`/`$trailing` slots or children for a button that
needs more than a label.

[All components](/components/)

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/button-filled-light.png" alt="Button filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/button-filled-dark.png" alt="Button filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tonal</strong><br />
  <img src="/img/components/button-tonal-light.png" alt="Button tonal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/button-tonal-dark.png" alt="Button tonal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>elevated</strong><br />
  <img src="/img/components/button-elevated-light.png" alt="Button elevated in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/button-elevated-dark.png" alt="Button elevated in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/button-outlined-light.png" alt="Button outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/button-outlined-dark.png" alt="Button outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>text</strong><br />
  <img src="/img/components/button-text-light.png" alt="Button text in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/button-text-dark.png" alt="Button text in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

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
	leadingIcon:    check
	trailingIcon:   arrow_forward
	leadingIconSize:  24
	trailingIconSize: 20
	leadingIconColor:  theme.tertiary
	trailingIconColor: theme.error
	variant: filled
}

Button {
	role:       titleSmall
	fontSize:   18
	weight:     700
	fontStyle:  italic
	decoration: underline
	decorationStyle: wavy
	label:      "Styled label"
}

Button {
	width:  320
	height: 48

	$leading {
		Icon { icon: star color: theme.onPrimary }
	}

	$trailing {
		Icon { icon: favorite color: theme.onPrimary }
	}

	Text {
		text:  "Children replace the label"
		role:  labelLarge
		color: theme.onPrimary
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text, ignored when the button has children |
| `leadingIcon` | string | leading Material Symbols ligature; wins over `$leading` |
| `trailingIcon` | string | trailing Material Symbols ligature; wins over `$trailing` |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `filledTrailingIcon` | bool | fills only the trailing icon; `filledIcon` fills both slots |
| `leadingIconColor` | color | leading glyph colour; unset keeps `color` or the variant foreground |
| `trailingIconColor` | color | trailing glyph colour; unset keeps `color` or the variant foreground |
| `leadingIconSize` | number | leading glyph box; 0 is the 18dp default |
| `trailingIconSize` | number | trailing glyph box; 0 is the 18dp default |
| `variant` | enum | `filled` (default), `tonal`, `elevated`, `outlined`, `text` |
| `color` | color | label and icon colour; unset keeps the variant's own |
| `disabled` | bool | dims the element and blocks input |
| `role` | enum | M3 type-scale role for the label; `labelLarge` by default |
| `fontSize` | number | overrides the role's size |
| `weight` / `fontWeight` | number or keyword | overrides the role's weight; `fontWeight` also takes `normal`, `bold`, `bolder`, `lighter` |
| `fontStyle` | enum | `normal`, `italic` |
| `align` | enum | `start`, `center` (default), `end` |
| `wrap` | bool | wraps the label at the button's width |
| `truncate` | bool | one line, ended with `…` when it does not fit |
| `maxLines` | number | wraps and stops after this many lines |
| `decoration` | keywords | `underline`, `overline`, `line-through`, combined with spaces; `none` clears |
| `decorationStyle` | enum | `solid`, `wavy`, `dotted`, `double`, `dashed` |
| `decorationThickness` | number | stroke width in dp |
| `decorationColor` | color | stroke colour; defaults to the label colour |

The design can style the box itself: `background` (solid or a gradient),
`borderColor`, `borderThickness` and the per-side border properties, `radius` and
`shadow` replace the variant's own fill, outline, shape and elevation. The
common properties are listed once in
[Common properties](/guide/common-properties/).

## Slots and children

`$leading` and `$trailing` are named slots for a body at either end; several
elements in a slot become one centred column. `leadingIcon` and `trailingIcon`
win over the slot on their side, so an app can swap a custom body for the
built-in glyph without rebuilding the design.

Default children replace `label`: the label is ignored as soon as the button has
a visible child. The children are one horizontal run, centred as a group. Wrap
them in a `Row` or `Column` when the arrangement should be different, and give
the button a `width` when the children are wider than its label would make it.

## Text properties

The label uses the Text painter, so `role`, `fontSize`, `weight`/`fontWeight`,
`fontStyle`, `align`, `wrap`, `truncate`, `maxLines`, `decoration`,
`decorationStyle`, `decorationThickness`, `decorationColor` and the inherited
`fontFamily` behave as they do on a Text. `color` sets the label and both icons;
`leadingIconColor` and `trailingIconColor` override one glyph each.

## From Go

```go
btn := w.MustByID[*ui.Button]("save")
btn.OnClick(func(ui.ClickEvent) {
	btn.Label.Set("Saved")
	btn.Disabled.Set(true)
})
```

Every element also accepts the [common properties](/guide/common-properties/).
