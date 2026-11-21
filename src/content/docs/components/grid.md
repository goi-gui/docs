---
title: "Grid"
---

Places children in a fixed number of equal-width columns. `variant: normal` is
the grid of equal rows; `variant: masonry` packs children of different heights
into the shortest column, the way a pinboard does.

[All components](/components/)

<p align="center">
  <strong>normal</strong><br />
  <img src="/img/components/grid-normal-light.png" alt="Grid normal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/grid-normal-dark.png" alt="Grid normal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>masonry</strong><br />
  <img src="/img/components/grid-masonry-light.png" alt="Grid masonry in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/grid-masonry-dark.png" alt="Grid masonry in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Grid {
	columns: 3
	spacing: 12

	Card {
		label: "One"
	}

	Card {
		label: "Two"
	}

	Card {
		label: "Three"
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `columns` | number | number of equal-width columns |
| `variant` | enum | `normal` (default) fills row by row; `masonry` puts each child in the shortest column |

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## Masonry

```goi
Grid {
	columns: 3
	spacing: 12
	variant: masonry

	Card { label: "Short" height: 88 }
	Card { label: "Tall" height: 160 }
	Card { label: "Medium" height: 120 }
	Card { label: "Fits under Short" height: 96 }
}
```

Every child keeps its own height at the column width and goes to the column with
the least height so far, so a page of mixed cards has no ragged gaps. The grid's
own height with no `height` declared is its tallest column. A child's `width` is
capped at the column width, as in the normal grid; `crossAxisAlign` and
`mainAxisAlign` do not place anything in a masonry grid, because the packing
decides both axes.

## From Go

```go
grid := w.MustByID[*ui.Grid]("grid")
grid.Columns.Set(2)
```

Every element also accepts the [common properties](/guide/common-properties/).
