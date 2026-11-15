# Geom

One polygon on a [Map](map.md): a ring of coordinates, a stroke and an optional
fill.

[All components](../components.md)

<p align="center">
  <img src="/img/components/geom-light.png" alt="Geom in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/geom-dark.png" alt="Geom in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Map {
	width:  100%
	height: 360
	bbox:   [28.5, 40.8, 29.5, 41.4]

	Geom {
		data:      [[28.97, 41.01], [29.06, 41.01], [29.06, 41.08]]
		lineColor: theme.primary
		fillColor: #6750a433
	}
}
```

One `Geom` is one polygon, so a `MultiPolygon` from a place API becomes one child
per part. A design usually builds them with a loop:

```goi
for _, g := range bridge.Geoms {
	Geom {
		data:      g.Data
		lineColor: theme.primary
		fillColor: #6750a433
	}
}
```

## Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `data` | list of pairs | — | one ring as `[[lon, lat], [lon, lat], …]`; the last point joins the first |
| `lineColor` | color | scheme `primary` | the stroke, 2dp wide |
| `fillColor` | color | — | fills the ring; use a translucent literal such as `#6750a433`, since a role is opaque |

Coordinates are GeoJSON order: longitude first. `Geom` is an overlay child of a
Map, so its own `width` and `padding` do not size or inset it; it covers the map
and projects its ring through the map's camera.

The fill is rasterized once per ring and colour in Mercator space, so panning and
zooming only move its quad. A ring is a single closed outline: a hole is a second
ring, which this property cannot express. For a boundary with holes, draw the
outer ring and a transparent inner one, or keep the polygon in an app that
rasterizes it itself.

## From Go

```go
g := w.MustByID[*ui.Geom]("district")
g.Data.Set([]ui.Coord{
	{28.97, 41.01}, {29.06, 41.01}, {29.06, 41.08},
})
g.LineColor.Set(0x6750a4ff)
g.FillColor.Set(0x6750a433)
```

`Data.Set` replaces the ring; the stroke and the fill are rebuilt on the next
paint.
