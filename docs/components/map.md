# Map

A slippy map: raster tiles from OpenStreetMap by default, dragged with the
pointer and zoomed with the wheel, with a GeoJSON boundary drawn over it.

[All components](../components.md)

## In a `.goi` file

```goi
Map {
	id:          city
	width:       100%
	height:      360
	radius:      16
	bbox:        [28.5, 40.8, 29.5, 41.4]
	geom:        "goi://districts.geojson"
	lineColor:   theme.primary
	fillColor:   #6750a433
	attribution: "© OpenStreetMap contributors"
}
```

`bbox` frames a region, so a map opens where the design wants it; `center` and
`zoom` are the alternative when a box is not what you have. The repository's
`examples/map` runs this shape with a GeoJSON asset next to it: `make map`. `geom` takes GeoJSON
text inline or the path of an asset that holds it, so a boundary file stays a
file.

## Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `tiles` | string | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | the tile URL template; `{z}`, `{x}` and `{y}` are replaced per tile, and `{s}` takes one of `a`, `b`, `c` |
| `attribution` | string | `© OpenStreetMap contributors` | the credit line in the corner; `""` hides it |
| `center` | string | — | `lat,lon`, the way every map URL writes a position |
| `zoom` | number | `2` | Web Mercator zoom, `0`..`19`; fractions are allowed |
| `bbox` | list | — | four numbers, `[west, south, east, north]` in degrees; while set it wins over `center` and `zoom` and the map refits whenever the box or the map's size changes |
| `geom` | string | — | GeoJSON text, or the path of an asset (`goi://…`) or file that holds it |
| `lineColor` | color | scheme `primary` | paints the boundary stroke and its vertex dots |
| `fillColor` | color | — | fills the polygons; use a translucent literal such as `#6750a433`, since a role is opaque |
| `reverseTileColors` | bool | `false` | inverts the tile RGB as it draws, for a dark scheme over a light raster service |
| `disablePan` | bool | `false` | dragging no longer moves the map |
| `disableZoom` | bool | `false` | the wheel no longer zooms the map, so it reaches the page behind it |

A map fills the width it is given, like a chart, and keeps a 220dp height until
the design sets one. The usual box is `width: 100%` with a `flex` or a `height`.

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

## The boundary layer

`geom` accepts anything GeoJSON calls a geometry, plus the `Feature`,
`FeatureCollection` and `GeometryCollection` wrappers, so a file from a GIS
export usually works as it is. Coordinates are GeoJSON order — longitude, then
latitude:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[28.97, 41.01], [29.06, 41.01], [29.06, 41.08], [28.97, 41.01]]]
  }
}
```

`Polygon` and `MultiPolygon` draw their rings as outlines (an inner ring reads as
a hole in the outline), `LineString` and `MultiLineString` draw open paths, and
`Point` and `MultiPoint` draw dots. Everything is stroked in the scheme's
`primary`, 2dp wide, with a dot at each vertex; there is no fill, because a
semi-transparent fill over street tiles is harder to read than an outline.

The geometry is parsed once per value, so a per-frame paint does not re-read the
JSON. A `geom` that fails to parse draws nothing; `Map.GeomError()` in Go says
why.

## From Go

```go
m := ui.MustByID[*ui.Map](w, "city")
m.SetView(41.0082, 28.9784, 13) // lat, lon, zoom
lat, lng, zoom := m.View()

// A boundary an app computed: a GeoJSON geometry, Feature or collection.
m.Geom.Set(geoJSON)          // GeoJSON text, parsed on the next paint
m.SetGeometry(boundary)       // ui.MapGeometry, e.g. an API's coordinates
m.BBox.Set([]float64{28.5, 40.8, 29.5, 41.4})
```

| Method | Notes |
|---|---|
| `SetView(lat, lng, zoom)` | moves the camera and writes it back to `center` and `zoom` |
| `View()` | the position and zoom on screen |
| `PanBy(dx, dy)` | moves the camera by a pointer delta, in logical pixels |
| `SetGeometry(g)` | draws a boundary that already exists as `ui.MapGeometry` coordinates, with no JSON round trip |
| `ZoomAt(x, y, delta)` | changes the zoom while keeping the point at `x`,`y` (map-local pixels) fixed |
| `Geometry()` | the parsed `geom`, or nil |
| `GeomError()` | why the last `geom` did not parse |

The camera properties are the state, so a `Bind` that runs after a hot reload
keeps the view the user left, and a design that writes `zoom: app.zoom` still
works.

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
