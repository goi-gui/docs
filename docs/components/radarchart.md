# RadarChart

One polygon per series over a spoke per category, for comparing several shapes
at a glance: which product scores better on speed, design and support.

[All components](../components.md)

## In a `.goi` file

```goi
RadarChart {
	id:     satisfaction
	width:  100%
	height: 260
	legend: true
	points: true
}
```

The numbers come from Go, the way every chart takes them:

```go
radar := ui.MustByID[*ui.RadarChart](w, "satisfaction")
radar.SetData(ui.ChartData{
	Categories: []string{"Speed", "Design", "Support", "Price"},
	Series: []ui.Series{
		{Label: "2025", Values: []float64{70, 62, 55, 80}},
		{Label: "2026", Values: []float64{82, 74, 71, 76}},
	},
})
```

## How it reads

The first category sits at 12 o'clock and the rest run clockwise. Each series
is a closed polygon whose corners sit at `(value - min) / (max - min)` of the way
out along their spoke, with a light wash inside it so two overlapping series stay
apart.

The scale always includes zero, because on a radar the distance from the centre
is the value: a range that started at 60 would draw a full-size polygon for a
difference of ten.

## Properties

| Property | Type | Notes |
|---|---|---|
| `grid` | bool | one ring per value tick; `true` by default |
| `axis` | bool | the spokes and the category names; `true` by default |
| `legend` | bool | a key for the series along the top; off by default |
| `categories` | string | the labels along the value axis, comma-separated: `"Jan, Feb, Mar"`; empty falls back to numbers |
| `values` | bool | the value written next to each corner; off by default |
| `points` | bool | a dot at each corner; `true` by default |
| `min`, `max` | number | pin the value scale; `0` means "follow the data" |

The rest of the surface is the common box: `background`, `borderWidth`,
`borderColor`, `radius`, `padding` and the rest of the
[common properties](../components.md#common-properties).

## Events

Hovering picks the nearest corner and shows a tooltip; clicking fires `onSelect`
with the category's index:

```goi
bridge {
	onPick func(index int)
}

RadarChart {
	onSelect: bridge.onPick(event)
}
```

A click on the legend hides that series instead, the same way it does on every
other chart.
