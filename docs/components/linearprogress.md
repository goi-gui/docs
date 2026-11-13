# LinearProgress

A horizontal progress bar.

[All components](../components.md)

## In a `.goi` file

```goi
LinearProgress {
	value: 0.65
}

LinearProgress {
	value: 30
	min:   0
	max:   100
}
```

`variant: wavy` draws the same progress as a ribbon: a wave along the track
instead of a flat bar, which is how the expressive style reads a percentage.

```goi
LinearProgress {
	variant: wavy
	value:   0.65
	width:   320
}
```

A wavy bar is a ribbon rather than a 4dp line, so it takes 16dp of height by
default; a height the design pins is honored, and the wave scales down to fit it.
Both variants end the track with the stop indicator dot.

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `normal` (a flat bar, the default) or `wavy` (a ribbon) |
| `value` | number | current number |
| `min` | number | lowest value |
| `max` | number | highest value |

## From Go

```go
bar := ui.MustByID[*ui.LinearProgress](w, "upload")
app.Animate(&bar.Value, 1, 900*time.Millisecond, ui.Standard)
```

Every element also accepts the [common properties](../components.md#common-properties).
