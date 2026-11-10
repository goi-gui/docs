# Slider

A continuous value control with three shapes: a standard slider, one that
fills out from a center value, and a range with two handles.

[All components](../components.md)

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

## From Go

```go
vol := ui.MustByID[*ui.Slider](w, "volume")
vol.OnChangeValue(func(v float64) {
	fmt.Println("volume", v)
})
app.Animate(&vol.Value, 0.9, 700*time.Millisecond, ui.Standard)

rangeSlider := ui.MustByID[*ui.Slider](w, "price")
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
| `disabled` | bool | dims the element and blocks input |
| `value` | number | current number; the low value of a range |
| `end` | number | high value of a range slider |
| `center` | number | value a centered slider fills from; the midpoint when unset |
| `min` | number | lowest value |
| `max` | number | highest value |
| `step` | number | snap interval; 0 means continuous |

Every element also accepts the [common properties](../components.md#common-properties).
