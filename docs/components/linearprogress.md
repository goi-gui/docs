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
instead of a flat bar, which is how the expressive style reads a percentage. The
wave travels, so the bar always asks for the next frame while it is on screen.

```goi
LinearProgress {
	variant: wavy
	value:   0.65
	width:   320
}
```

The filled part and the track never touch: a gap the width of the stroke
separates them, the track is only the part that is left, and both ends are
rounded. Nothing is drawn under the progress, and the stop indicator sits at the
end with its own small gap.

`thickness` sets the stroke: 4dp for a normal bar, 6dp for a ribbon. The height
follows it — a stroke is that tall, a ribbon is 1.75 times it, so the default
wavy bar is 10.5dp. A height the design pins is honored, and the wave scales down
to fit it. Both variants end the track with the stop indicator dot.

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `normal` (a flat bar, the default) or `wavy` (a ribbon) |
| `thickness` | number | stroke width; 0 keeps 4dp (normal) or 6dp (wavy) |
| `value` | number | current number |
| `min` | number | lowest value |
| `max` | number | highest value |

## From Go

```go
bar := ui.MustByID[*ui.LinearProgress](w, "upload")
app.Animate(&bar.Value, 1, 900*time.Millisecond, ui.Standard)
```

Every element also accepts the [common properties](../components.md#common-properties).
