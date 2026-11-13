# CircularProgress

A circular progress ring.

[All components](../components.md)

## In a `.goi` file

```goi
CircularProgress {
	value:  0.3
	width:  64
	height: 64
}

CircularProgress {
	value:  70
	min:    0
	max:    100
	width:  48
	height: 48
}
```

`variant: wavy` makes the arc a ribbon too: the ring's radius pulses as it goes
round, so the filled part reads as a wave over the plain track. The wave travels,
so the ring asks for the next frame while it is on screen.

```goi
CircularProgress {
	variant: wavy
	value:   0.65
}
```

The wave keeps itself inside the ring's box, so the default 48dp size needs no
height of its own. `thickness` sets the stroke: 4dp for a plain arc, 7dp for a
ribbon, and a stroke too wide for the box is narrowed to fit.

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `normal` (a plain arc, the default) or `wavy` (a ribbon) |
| `thickness` | number | stroke width; 0 keeps 4dp (plain) or 7dp (wavy) |
| `value` | number | current number |
| `min` | number | lowest value |
| `max` | number | highest value |
| `size` | enum | — (follows width and height) |

## From Go

```go
ring := ui.MustByID[*ui.CircularProgress](w, "ring")
app.Animate(&ring.Value, 0.9, 900*time.Millisecond, ui.Emphasized)
```

Every element also accepts the [common properties](../components.md#common-properties).
