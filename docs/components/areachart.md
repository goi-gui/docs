# AreaChart

A line chart with the space under each line filled, which reads as a total
rather than a trend.

[All components](../components.md)

## In a `.goi` file

```goi
AreaChart {
	id:      costs
	width:   100%
	height:  240
	stacked: true
	legend:  true
}
```

## A stack

`stacked: true` shows the total of the series, with each band filled down to the
series under it:

```go
area := ui.MustByID[*ui.AreaChart](w, "costs")
area.SetData(ui.ChartData{
	Categories: []string{"Jan", "Feb", "Mar"},
	Series: []ui.Series{
		{Label: "Hosting", Values: []float64{4, 5, 6}},
		{Label: "People", Values: []float64{8, 9, 8}},
	},
})
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `grid` | bool | value lines behind the series; `true` by default |
| `axis` | bool | the value and category labels; `true` by default |
| `legend` | bool | a key for the series; off by default |
| `categories` | string | the labels along the value axis, comma-separated: `"Jan, Feb, Mar"`; empty falls back to numbers |
| `textColor` | color | every label the chart writes: axis ticks, categories, values, the legend, the gauge number; unset follows the scheme |
| `gridColor` | color | the value lines, a radar's rings and spokes, the gauge's track; unset follows the scheme |
| `values` | bool | the value written at each point; off by default |
| `points` | bool | a dot at each value |
| `smooth` | bool | a curve instead of straight segments |
| `stacked` | bool | add the series and fill each band down to the one below it |
| `min`, `max` | number | pin the value scale; `0` follows the data |

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
AreaChart {
	onSelect: bridge.onPick(event)
	onHover:  bridge.onHover(event)
}
```

## The data

`ChartData` and `Series` are shared by every chart, so the table on the
[LineChart](linechart.md#the-data) page applies here too. Hover, click, the
tooltip and `onSelect`/`onHover` work the same way on every kind.
