# ScatterChart

One dot per value, with no line between them, for showing how a set of points
sits against a scale.

[All components](../components.md)

## In a `.goi` file

```goi
ScatterChart {
	id:     latency
	width:  100%
	height: 240
	points: true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `grid` | bool | value lines behind the dots; `true` by default |
| `axis` | bool | the value and category labels; `true` by default |
| `legend` | bool | a key for the series; off by default |
| `categories` | string | the labels along the value axis, comma-separated: `"Jan, Feb, Mar"`; empty falls back to numbers |
| `textColor` | color | every label the chart writes: axis ticks, categories, values, the legend, the gauge number; unset follows the scheme |
| `gridColor` | color | the value lines, a radar's rings and spokes, the gauge's track; unset follows the scheme |
| `points` | bool | draw the dots; `true` by default |
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
ScatterChart {
	onSelect: bridge.onPick(event)
	onHover:  bridge.onHover(event)
}
```

## The data

`ChartData` and `Series` are shared by every chart, so the table on the
[LineChart](linechart.md#the-data) page applies here too. Hover, click, the
tooltip and `onSelect`/`onHover` work the same way on every kind.
