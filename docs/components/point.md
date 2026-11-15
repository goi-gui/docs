# Point

A marker on a [Map](map.md): a coordinate and whatever children the place needs.

[All components](../components.md)

<p align="center">
  <img src="/img/components/point-light.png" alt="Point in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/point-dark.png" alt="Point in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Map {
	width:  100%
	height: 360
	bbox:   [28.5, 40.8, 29.5, 41.4]

	Point {
		coordinate: [28.97, 41.01]

		IconButton {
			icon:    location_on
			variant: filled
		}
	}
}
```

The `Point`'s box is the size of its children, and its centre sits on the
projected coordinate. A pin icon, a badge or a small card all work.

## Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `coordinate` | list of numbers | — | `[lon, lat]`; with fewer than two numbers the marker is not drawn |

`Point` is a container, so it takes any child and lays them out like a `Stack`.
It is an overlay child of a Map: its `width` and `height` follow its children,
and `visible` is the usual way to keep a marker off the map until a place is
selected.

```goi
Point {
	visible:    bridge.HasPlace
	coordinate: bridge.Marker
	IconButton { icon: location_on }
}
```

## From Go

```go
p := w.MustByID[*ui.Point]("pin")
p.Coordinate.Set([]float64{28.97, 41.01})
p.SetVisible(true)
```
