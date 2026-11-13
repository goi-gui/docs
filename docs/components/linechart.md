# LineChart

One line per series through the points, with the value axis drawn behind it.

[All components](../components.md)

## In a `.goi` file

A design writes its own data: `categories` names the points and one `ChartSeries`
child holds one line.

```goi
LineChart {
	id:         revenue
	width:      100%
	height:     240
	legend:     true
	points:     true
	smooth:     true
	categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

	ChartSeries {
		label:  "2025"
		values: [12, 18, 15, 24, 21, 29]
	}

	ChartSeries {
		label:  "2026"
		values: [16, 22, 19, 28, 26, 34]
		color:  tertiary
	}
}
```

`ChartSeries` is data, not a node: the builder turns the children into the
chart's `Series` and drops them from the tree, so their `id`s are not registered
and layout and paint never see them.

An app whose numbers move fills the chart from Go instead, and that replaces what
the file declared:

```go
line := ui.MustByID[*ui.LineChart](w, "revenue")
line.SetData(ui.ChartData{
	Categories: []string{"Jan", "Feb", "Mar", "Apr", "May", "Jun"},
	Series: []ui.Series{
		{Label: "2025", Values: []float64{12, 18, 15, 24, 21, 29}},
		{Label: "2026", Values: []float64{16, 22, 19, 28, 26, 34}},
	},
})
```

Call it from `Bind` or `App.Post`. `SetData` also clears the hover, so a reload
does not leave a tooltip pointing at a value that is gone.

## The data

`ChartSeries` is the design-side entry, one per line, bar group or pie ring:

| Property | Type | Notes |
|---|---|---|
| `label` | string | the legend and tooltip name; empty draws no name |
| `values` | list | one number per category: `[12, 18, 9]`; a short list reads as zero. An item may be a variable (`bridge.jan`) or an expression |
| `color` | color | paints that series; a theme role such as `theme.tertiary` follows the scheme, a literal is fixed, and unset takes the scheme's next accent |
| `colors` | list | one colour per slice: `[theme.primary, customColor.brand, #c62828]`. A pie reads it per wedge; other kinds take `color` for the whole series |

The checker rejects a value that is not a number, so a typo is a diagnostic
rather than a bar of zero.

From Go, `ChartData` is the whole picture:

| Field | Type | Notes |
|---|---|---|
| `Categories` | `[]string` | one label per point along the value axis, left to right |
| `Series` | `[]Series` | one line per entry |
| `Series[i].Label` | `string` | the legend and tooltip name; empty draws no name |
| `Series[i].Values` | `[]float64` | one value per category; a short list reads as zero |
| `Series[i].Color` | `color` | paints that line; unset takes the scheme's next accent |
| `Series[i].ColorRole` | `string` | a theme role for the line, which `ChartSeries` fills in so it follows the scheme |
| `Series[i].Colors` | `[]color` | per-point colours, which a pie uses per slice |

A category with no label falls back to its number, so a `Categories` list that is
shorter than `Values` still reads.

## Interaction

Hovering moves a highlight to the nearest point and shows a tooltip with the
category, the series and the value. Clicking fires `onSelect` with the point's
index, and the clicked point keeps a ring so the choice stays visible.

With `legend: true` the key along the top is clickable: a press there hides the
series (dimming its entry) and a second press shows it again. The value scale
narrows to the series that are left, and the last visible one stays on so the
plot never goes blank. From Go the state is `Hidden []bool` on the chart, and
`SeriesHidden(i)`/`ToggleHidden(i)` read and flip one entry.

A design wires the two events like any other:

```goi
bridge {
	onPick  func(index int)
	onHover func(index int)
}

LineChart {
	onSelect: bridge.onPick(event)
	onHover:  bridge.onHover(event)
}
```

From Go, the state is on the node:

| Field | Type | Notes |
|---|---|---|
| `HoverSeries`, `HoverIndex` | `int` | the point under the pointer, or `-1` |
| `SelectedSeries`, `SelectedIndex` | `int` | the last clicked point, or `-1` |

`OnHoverPoint(func(index int))` and `OnSelect(func(index int))` subscribe from Go.

## Properties

| Property | Type | Notes |
|---|---|---|
| `grid` | bool | value lines behind the series; `true` by default |
| `axis` | bool | the value labels on the left and the categories below; `true` by default |
| `legend` | bool | a key for the series along the top; off by default |
| `categories` | list | the labels along the value axis: `["Jan", "Feb", "Mar"]`; empty falls back to numbers |
| `textColor` | color | every label the chart writes: axis ticks, categories, values, the legend, the gauge number; unset follows the scheme |
| `gridColor` | color | the value lines, a radar's rings and spokes, the gauge's track; unset follows the scheme |
| `values` | bool | the value written next to each point; off by default |
| `points` | bool | a dot at each value; `true` by default |
| `smooth` | bool | a Catmull-Rom curve instead of straight segments |
| `min`, `max` | number | pin the value scale; `0` means "follow the data" |
| `color` | color | the line colour when the data names none |

The rest of the surface is the common box: `background`, `borderWidth`,
`borderColor`, `radius`, `padding` and the rest of the
[common properties](../components.md#common-properties).

## A line from Go

`SetData` is the normal path. A single value can be changed in place when the
rest of the data is already right:

```go
line := ui.MustByID[*ui.LineChart](w, "revenue")
data := line.Data
data.Series[0].Values[5] = 41
line.SetData(data)
```
