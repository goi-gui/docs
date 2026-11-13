# BarChart

One bar per value, grouped by series or stacked on top of each other.

[All components](../components.md)

## In a `.goi` file

```goi
BarChart {
	id:     sales
	width:  100%
	height: 240
	legend: true
	values: true
}
```

## Groups and stacks

With two series the bars pair up inside a category. `stacked: true` puts them in
one bar and `horizontal: true` turns the whole chart on its side, which is what
long category names want:

```goi
BarChart {
	horizontal: true
	height:     320
	legend:     true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `grid` | bool | value lines behind the bars; `true` by default |
| `axis` | bool | the value and category labels; `true` by default |
| `legend` | bool | a key for the series; off by default |
| `categories` | list | the labels along the value axis: `["Jan", "Feb", "Mar"]`; empty falls back to numbers |
| `textColor` | color | every label the chart writes: axis ticks, categories, values, the legend, the gauge number; unset follows the scheme |
| `gridColor` | color | the value lines, a radar's rings and spokes, the gauge's track; unset follows the scheme |
| `values` | bool | the value written above each bar |
| `stacked` | bool | stack the series in one bar instead of grouping them |
| `horizontal` | bool | run the bars left to right, with the categories down the side |
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
BarChart {
	onSelect: bridge.onPick(event)
	onHover:  bridge.onHover(event)
}
```

## The data

`ChartData` and `Series` are shared by every chart, so the table on the
[LineChart](linechart.md#the-data) page applies here too. Hover, click, the
tooltip and `onSelect`/`onHover` work the same way on every kind.
