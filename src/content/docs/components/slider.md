---
title: "Slider"
---

A continuous value control with three shapes: a standard slider, one that
fills out from a center value, and a range with two handles. It runs
horizontally by default and can be turned vertical, with an optional icon at
each end.

[All components](/components/)

<p align="center">
  <strong>standard</strong><br />
  <img src="/img/components/slider-standard-light.png" alt="Slider standard in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-standard-dark.png" alt="Slider standard in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>centered</strong><br />
  <img src="/img/components/slider-centered-light.png" alt="Slider centered in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-centered-dark.png" alt="Slider centered in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>range</strong><br />
  <img src="/img/components/slider-range-light.png" alt="Slider range in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-range-dark.png" alt="Slider range in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>end icons</strong><br />
  <img src="/img/components/slider-icons-light.png" alt="Slider with a leading and trailing icon in light mode" style="max-width:80%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-icons-dark.png" alt="Slider with a leading and trailing icon in dark mode" style="max-width:80%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>vertical</strong><br />
  <img src="/img/components/slider-vertical-light.png" alt="Vertical slider with an icon at each end in light mode" style="max-width:20%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-vertical-dark.png" alt="Vertical slider with an icon at each end in dark mode" style="max-width:20%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>showTooltip</strong><br />
  <img src="/img/components/slider-tooltip-light.png" alt="Slider value tooltip in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/slider-tooltip-dark.png" alt="Slider value tooltip in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Slider {
	value: 0.4
	min:   0
	max:   1
	width: 320
}

Slider {
	value: 40
	min:   0
	max:   100
	step:  10
}

Slider {
	variant: centered // fills out from 0.5
	value:   0.7
	min:     0
	max:     1
}

Slider {
	variant: centered
	center:  0.25
	value:   0.7
	min:     0
	max:     1
}

Slider {
	variant: range
	value:   20
	end:     70
	min:     0
	max:     100
	step:    5
}

Slider {
	showTooltip: true // the value above the handle, while hovered or dragged
	value:       0.4
	min:         0
	max:         1
}

Slider {
	orientation:  vertical
	value:        0.6
	min:          0
	max:          1
	leadingIcon:  volume_mute
	trailingIcon: volume_up
}

Slider {
	variant:      range
	value:        20
	end:          80
	min:          0
	max:          100
	leadingIcon:  brightness_low
	trailingIcon: brightness_high
}
```

## Shapes

- `standard` (default) fills from the minimum to the handle.
- `centered` fills between the handle and `center`. Without a `center`, it is
  the midpoint of `min` and `max`, so a value above the middle fills right of
  it and a value below fills left. A stop dot sits at each end.
- `range` has two handles: `value` is the low one and `end` the high one. The
  fill runs between them, with a stop dot at each end. A press moves whichever
  handle is nearer, and the two cannot cross. The arrow keys move the handle
  the pointer last took, so a keyboard user can adjust either.

`step` snaps every handle, and `disabled` dims the track and blocks input
without changing the shape.

## Orientation

`orientation: horizontal` is the default. `orientation: vertical` swaps the
axes: the track runs bottom to top, `min` is at the bottom and `max` at the top,
and the arrow keys, Home and End follow the same value order. The natural size
is 200×44 horizontally and 44×200 vertically; set `width` or `height` when the
design needs another.

## End icons

`leadingIcon` is the icon at the left end of a horizontal slider or the bottom
end of a vertical one; `trailingIcon` is the right or top end. Either can be
empty. `leadingIconColor` and `trailingIconColor` override the theme's glyph
colour, which otherwise follows the part the icon sits on: the inactive track's
`onSecondaryContainer` or the filled track's `onPrimary`.

The icons sit in the unfilled cap at their end. When a handle comes close
enough that the cap can no longer hold the glyph plus its padding, the icon
moves just inside the filled part at the same size, never squeezed. A range
slider can show an icon at each end, and each one moves with its own handle.

The common `radius` property rounds the track's outer ends; without it the
track is a capsule, or an 8dp rounded strip when it carries icons.

## Value tooltip

`showTooltip: true` puts the handle's value in a small bubble above it while the
pointer is over the slider or a drag is in progress. A range slider names the
handle nearest the pointer, and the grabbed one while dragging, so the bubble
always shows the number that is about to change. It is off by default, and a
disabled slider shows nothing.

## From Go

```go
vol := w.MustByID[*ui.Slider]("volume")
vol.OnChangeValue(func(v float64) {
	fmt.Println("volume", v)
})
app.Animate(&vol.Value, 0.9, 700*time.Millisecond, ui.Standard)

rangeSlider := w.MustByID[*ui.Slider]("price")
rangeSlider.OnRange(func(lo, hi float64) {
	fmt.Println("price", lo, "to", hi)
})
rangeSlider.SetRange(20, 60)     // clamps to min/max and keeps the pair in order
rangeSlider.Range()              // lo, hi
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `standard` (default), `centered`, `range` |
| `orientation` | enum | `horizontal` (default) or `vertical` |
| `leadingIcon` | string | Material Symbols name at the left or bottom end; empty means none |
| `trailingIcon` | string | Material Symbols name at the right or top end; empty means none |
| `leadingIconColor` | color | overrides the leading glyph colour; zero follows the theme |
| `trailingIconColor` | color | overrides the trailing glyph colour; zero follows the theme |
| `disabled` | bool | dims the element and blocks input |
| `value` | number | current number; the low value of a range |
| `end` | number | high value of a range slider |
| `center` | number | value a centered slider fills from; the midpoint when unset |
| `min` | number | lowest value |
| `max` | number | highest value |
| `step` | number | snap interval; 0 means continuous |
| `showTooltip` | bool | shows the value above the handle while hovered or dragged; off by default |

Every element also accepts the [common properties](/guide/common-properties/).
