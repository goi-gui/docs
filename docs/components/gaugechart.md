# GaugeChart

One value as an arc against its range, with the number in the middle: uptime,
disk usage, a score out of 100.

[All components](../components.md)

## In a `.goi` file

```goi
GaugeChart {
	id:     uptime
	width:  320
	height: 260
	max:    100

	ChartSeries {
		label:  "Uptime"
		values: "99.4"
	}
}
```

The series holds the one number a gauge shows; a design declares it like any
other chart's data, and an app whose value moves replaces it with `SetData`:

```go
gauge := ui.MustByID[*ui.GaugeChart](w, "uptime")
gauge.SetData(ui.ChartData{
	Series: []ui.Series{{Label: "Uptime", Values: []float64{99.4}}},
})
```

Only the first value of the first series is read: a gauge shows one number.

## How it reads

The track is a 240-degree arc with the gap at the bottom, and the filled part is
that share of the sweep. The number sits in the middle, in `headlineSmall`, and
is always written, because it is the point of the shape.

## Properties

| Property | Type | Notes |
|---|---|---|
| `textColor` | color | every label the chart writes: axis ticks, categories, values, the legend, the gauge number; unset follows the scheme |
| `gridColor` | color | the value lines, a radar's rings and spokes, the gauge's track; unset follows the scheme |
| `min`, `max` | number | the ends of the scale; `0` means "from zero to the value" |
| `startAngle` | number | degrees; `0` centres the gap at the bottom |

The rest of the surface is the common box: `background`, `borderWidth`,
`borderColor`, `radius`, `padding` and the rest of the
[common properties](../components.md#common-properties).

## Events

A press fires `onSelect` with `0`, so a design can treat the gauge like any other
selectable element:

```goi
bridge {
	onPick func(index int)
}

GaugeChart {
	onSelect: bridge.onPick(event)
}
```
