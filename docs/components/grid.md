# Grid

Places children in a fixed number of equal-width columns. `variant: normal` is
the grid of equal rows; `variant: masonry` packs children of different heights
into the shortest column, the way a pinboard does.

[All components](../components.md)

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
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

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
grid := ui.MustByID[*ui.Grid](w, "grid")
grid.Columns.Set(2)
```

Every element also accepts the [common properties](../components.md#common-properties).
