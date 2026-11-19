# IconButton

A square button that holds only an icon.

[All components](../components.md)

<p align="center">
  <strong>standard</strong><br />
  <img src="/img/components/iconbutton-standard-light.png" alt="IconButton standard in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/iconbutton-standard-dark.png" alt="IconButton standard in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/iconbutton-filled-light.png" alt="IconButton filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/iconbutton-filled-dark.png" alt="IconButton filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tonal</strong><br />
  <img src="/img/components/iconbutton-tonal-light.png" alt="IconButton tonal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/iconbutton-tonal-dark.png" alt="IconButton tonal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/iconbutton-outlined-light.png" alt="IconButton outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/iconbutton-outlined-dark.png" alt="IconButton outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
IconButton {
	icon: favorite
}

IconButton {
	icon:     favorite
	variant:  filled
	selected: true
}

IconButton {
	icon:    favorite
	variant: tonal
}

IconButton {
	icon:    favorite
	variant: outlined
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `icon` | string | leading Material Symbols ligature |
| `iconColor` | color | overrides the glyph colour; zero keeps the variant's foreground |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `variant` | enum | `standard` (default), `filled`, `tonal`, `outlined` |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |

## From Go

```go
star := w.MustByID[*ui.IconButton]("star")
star.OnClick(func(ui.ClickEvent) {
	on := !star.Selected.Get()
	star.Selected.Set(on)
	if on {
		star.Icon.Set("star")
	} else {
		star.Icon.Set("star_border")
	}
})
```

`iconColor` tints only the glyph. The container, border and state layer keep the
colour the variant gives them.

Every element also accepts the [common properties](../components.md#common-properties).
