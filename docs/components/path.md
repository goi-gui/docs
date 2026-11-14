# Path

An open polyline on a [Map](map.md), one stroke through its coordinates.

[All components](../components.md)

## In a `.goi` file

```goi
Map {
	width:  100%
	height: 360
	bbox:   [28.5, 40.8, 29.5, 41.4]

	Path {
		coordinates: [[28.97, 41.01], [29.06, 41.01], [29.06, 41.08]]
		lineColor:   theme.tertiary
	}
}
```

A `Path` is not closed: the first and last points are not joined unless the
design repeats the first point. Its children are not used; draw one `Path` per
line.

## Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `coordinates` | list of pairs | — | one `[lon, lat]` per point |
| `lineColor` | color | scheme `primary` | the stroke, 2dp wide |

Coordinates are GeoJSON order: longitude first. `Path` is an overlay child of a
Map, so its own `width` and `padding` do not size or inset it.

## From Go

```go
route := ui.MustByID[*ui.Path](w, "route")
route.Coordinates.Set([]ui.Coord{
	{28.97, 41.01},
	{29.06, 41.01},
	{29.06, 41.08},
})
route.LineColor.Set(0x6750a4ff)
```
