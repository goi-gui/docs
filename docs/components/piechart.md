# PieChart

One wedge per value of the first series, with an optional hole for a donut.

[All components](../components.md)

## In a `.goi` file

```goi
PieChart {
	id:          channels
	width:       260
	height:      240
	innerRadius: 0.55
	legend:      true
	values:      true
	startAngle:  -90
	categories:  "Direct, Search, Social, Email"

	ChartSeries {
		values: "42, 27, 18, 13"
	}
}
```

## Slices

The wedges read the **first** series only, and each category is one slice, so
`categories` is what names the legend and the tooltip. An app whose numbers move
fills the same picture from Go:

```go
pie := ui.MustByID[*ui.PieChart](w, "channels")
pie.SetData(ui.ChartData{
	Categories: []string{"Direct", "Search", "Social", "Email"},
	Series:     []ui.Series{{Values: []float64{42, 27, 18, 13}}},
})
```

Each slice takes the next colour from the scheme's accents. To fix them, set a
`Colors` list on the series from Go; a single `Color` on a `ChartSeries` — or
`Series.Color` in Go — paints the whole pie one colour.

A negative or zero value is skipped, so a gap in the data does not tilt the
others. The centre of a pie is not a slice: a press there picks nothing.

## Properties

| Property | Type | Notes |
|---|---|---|
| `innerRadius` | number | 0 (default) is a pie; 0.5 is a donut with half the radius open |
| `startAngle` | number | where the first wedge begins, in degrees; 0 is 12 o'clock |
| `legend` | bool | a key for the categories; off by default |
| `categories` | string | the labels along the value axis, comma-separated: `"Jan, Feb, Mar"`; empty falls back to numbers |
| `values` | bool | the value written inside each wedge; off by default |
| `grid` | bool | has no effect on a pie |
| `axis` | bool | has no effect on a pie |

The rest of the surface is the common box: `background`, `borderWidth`,
`borderColor`, `radius`, `padding` and the rest of the
[common properties](../components.md#common-properties).

## Events

A press fires `onSelect` with the point's index, and the hover reports through
`onHover` with the point under the pointer or `-1`:

```goi
bridge {
	onPick  func(index int)
	onHover func(index int)
}
```

```goi
PieChart {
	onSelect: bridge.onPick(event)
	onHover:  bridge.onHover(event)
}
```

## The data

`ChartData` and `Series` are shared by every chart, so the table on the
[LineChart](linechart.md#the-data) page applies here too. Hover, click, the
tooltip and `onSelect`/`onHover` work the same way on every kind.
