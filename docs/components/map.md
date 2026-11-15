# Map

A slippy map: raster tiles from OpenStreetMap by default, dragged with the
pointer and zoomed with the wheel, with boundaries, markers and routes drawn as
its children.

[All components](../components.md)

<p align="center">
  <img src="/img/components/map-light.png" alt="Map in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/map-dark.png" alt="Map in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Map {
	id:          city
	width:       100%
	height:      360
	radius:      16
	bbox:        [28.5, 40.8, 29.5, 41.4]
	attribution: "© OpenStreetMap contributors"

	Geom {
		data:      [[28.97, 41.01], [29.06, 41.01], [29.06, 41.08]]
		lineColor: theme.primary
		fillColor: #6750a433
	}

	Path {
		coordinates: [[28.97, 41.01], [29.06, 41.01], [29.06, 41.08]]
		lineColor:   theme.tertiary
	}

	Point {
		coordinate: [28.97, 41.01]
		IconButton { icon: location_on variant: filled }
	}
}
```

`bbox` frames a region, so a map opens where the design wants it; `center` and
`zoom` are the alternative when a box is not what you have. The repository's
`examples/map` searches PiriAPI and builds one `Geom` per returned polygon with a
`for` loop: `make map`.

## Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `tiles` | string | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | the tile URL template; `{z}`, `{x}` and `{y}` are replaced per tile, and `{s}` takes one of `a`, `b`, `c` |
| `attribution` | string | `© OpenStreetMap contributors` | the credit line in the corner; `""` hides it |
| `center` | string | — | `lat,lon`, the way every map URL writes a position |
| `zoom` | number | `2` | Web Mercator zoom, `0`..`19`; fractions are allowed |
| `bbox` | list | — | four numbers, `[west, south, east, north]` in degrees; while set it wins over `center` and `zoom` and the map refits whenever the box or the map's size changes |
| `reverseTileColors` | bool | `false` | inverts the tile RGB as it draws, for a dark scheme over a light raster service |
| `disablePan` | bool | `false` | dragging no longer moves the map |
| `disableZoom` | bool | `false` | the wheel no longer zooms the map, so it reaches the page behind it |

A map fills the width it is given, like a chart, and keeps a 220dp height until
the design sets one. The usual box is `width: 100%` with a `flex` or a `height`.

## Overlays

A Map takes three children, in paint order:

- [Geom](geom.md) — one filled and stroked polygon.
- [Path](path.md) — an open polyline.
- [Point](point.md) — a marker whose children are centred on a coordinate.

Coordinates are GeoJSON order wherever a list holds a pair: longitude first,
then latitude. `bbox` and `Point.coordinate` are `[lon, lat]`; a `Geom`'s `data`
is a list of `[lon, lat]` pairs, and a `Path`'s `coordinates` is the same
shape.

`Geom` and `Path` are overlay children, not content: layout gives them the whole
map box, so setting `width` or `padding` on them does nothing. A `Point` keeps the
size of its children and is moved to its projected coordinate when it paints.

## Interaction

- **Drag** pans. The press belongs to the map, so a scroll area under it does
  not also move.
- **Wheel** zooms around the point under the pointer, so the street you pointed
  at stays under it. A notch is half a level; a touchpad moves it smoothly. The
  direction is the reverse of a page scroll: a notch away from you zooms in.
- **Double click** (or a second press on the same spot within 300ms) zooms one
  level in, around the click. A drag between the two presses cancels it.
- **Pinch** on a trackpad or touchscreen applies the gesture's relative scale to
  the map under the pointer. SDL reports the scale but no position, so the
  pointer is the anchor.
- All of them write back to `center` and `zoom`, which is why reading them from
  Go tells you what the user is looking at.
- `disablePan` and `disableZoom` take the gestures away; a disabled pan lets a
  press fall through to the page, and a disabled zoom lets the wheel scroll it.
  A disabled zoom takes double-click and pinch with it.

## From Go

```go
m := w.MustByID[*ui.Map]("city")
m.SetView(41.0082, 28.9784, 13) // lat, lon, zoom
lat, lng, zoom := m.View()
m.BBox.Set([]float64{28.5, 40.8, 29.5, 41.4})

// One polygon from an API's [lon, lat] ring.
w.MustByID[*ui.Geom]("district").Data.Set(ring)

// A route as [lon, lat] pairs.
w.MustByID[*ui.Path]("route").Coordinates.Set([]ui.Coord{
	{28.97, 41.01}, {29.06, 41.01},
})
```

| Method | Notes |
|---|---|
| `SetView(lat, lng, zoom)` | moves the camera and writes it back to `center` and `zoom` |
| `View()` | the position and zoom on screen |
| `PanBy(dx, dy)` | moves the camera by a pointer delta, in logical pixels |
| `ZoomAt(x, y, delta)` | changes the zoom while keeping the point at `x`,`y` (map-local pixels) fixed |

The camera properties are the state, so a `Bind` that runs after a hot reload
keeps the view the user left, and a design that writes `zoom: app.zoom` still
works.

A list of polygons usually comes from the bridge, one loop row per polygon:

```goi
for _, g := range bridge.Geoms {
	Geom {
		data:      g.Data
		lineColor: theme.primary
		fillColor: #6750a433
	}
}
```

A bridge slice may feed a list property, so `g.Data` (a `[]float64`) is assigned
to `data` as it is. The same works for `Point.coordinate` from a `[]float64`.

## Tiles and attribution

The default endpoint is OpenStreetMap's, which is meant for light use and asks
for an identifying client, a credit line and caching. goi sends its own
`User-Agent`, keeps at most two tile downloads in flight and caches 128 decoded
tiles; the credit line is on unless the design clears it.

An app with real traffic should point `tiles` at its own tile server or a paid
provider:

```goi
Map {
	tiles:       "https://tiles.example.com/{z}/{x}/{y}.png"
	attribution: "© Example Maps"
}
```

Any XYZ raster service works. `{s}` is filled with `a`, `b` or `c` for services
that still spread tiles over subdomains. A tile that returns 404 is remembered
as missing and not requested again for the session.

Tiles need HTTP; that works on the desktop and in a wasm build through the
browser's `fetch`, where the tile host must allow cross-origin requests.
OpenStreetMap does.
