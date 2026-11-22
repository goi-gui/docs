---
title: "VerticalSlider"
---

A value control drawn as a vertical strip: the filled part runs from the bottom
to the handle, and the top is the maximum. It fits volume controls, zoom levels
and other tall settings where a horizontal slider would waste the page.

<p align="center">
  <strong>with an icon</strong><br />
  <img src="/img/components/verticalslider-light.png" alt="VerticalSlider with an icon above the handle in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/verticalslider-dark.png" alt="VerticalSlider with an icon above the handle in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>handle near the top</strong><br />
  <img src="/img/components/verticalslider-top-light.png" alt="VerticalSlider with the icon moved below the handle in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/verticalslider-top-dark.png" alt="VerticalSlider with the icon moved below the handle in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
VerticalSlider {
	id:     volume
	value:  0.65
	min:    0
	max:    1
	step:   0.05
	icon:   music_note
	width:  64
	height: 280
}
```

## The icon

`icon` takes a Material Symbols name. Without one the strip is just the track
and its handle. With one, the glyph sits in the unfilled cap above the handle.

When the value rises far enough that the cap is too short for the glyph, the
icon moves just below the handle into the filled part. It keeps its size in both
places instead of being squeezed into the shrinking cap. This is a paint-time
decision: changing `value` is a repaint, not a layout pass.

## Behaviour

- The bottom is `min` and the top is `max`.
- The handle floats between the unfilled cap and the filled part, with a gap on
  each side, so the three read as separate pieces.
- A press jumps to that position; a drag follows the pointer on the vertical
  axis.
- The arrow keys step a focused slider, Home and End jump to the ends, and
  Shift makes an arrow jump ten steps.
- `step` snaps every move; `0` is continuous.
- `radius` rounds the track's own ends; it defaults to 8dp. The handle keeps
  its own pill shape.
- `disabled` dims the track and blocks input.
- The default size is 64 by 280 when the design sets neither `width` nor
  `height`.

## From Go

```go
volume := w.MustByID[*ui.VerticalSlider]("volume")
volume.OnChangeValue(func(v float64) {
	fmt.Println("volume", v)
})
volume.Icon.Set("volume_up") // swap the glyph at run time
app.Animate(&volume.Value, 0.9, 700*time.Millisecond, ui.Standard)
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `icon` | string | a Material Symbols name, drawn above the handle or moved into the filled part when the cap is short; empty means none |
| `disabled` | bool | dims the element and blocks input |
| `value` | number | current number |
| `min` | number | value at the bottom |
| `max` | number | value at the top |
| `step` | number | snap interval; 0 means continuous |

Every element also accepts the [common properties](/guide/common-properties/).
