# Flex

A container whose axis is a property: `direction: row` lays its children out the
way a `Row` does, `direction: column` the way a `Column` does.

[All components](../components.md)

<p align="center">
  <img src="/img/components/flex-light.png" alt="Flex in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/flex-dark.png" alt="Flex in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Flex {
	direction: row
	spacing:   12

	Rectangle { width: 40 height: 40 radius: 8 background: theme.primary }
	Rectangle { width: 40 height: 40 radius: 8 background: theme.secondary }
	Rectangle { width: 40 height: 40 radius: 8 background: theme.tertiary }
}

Flex {
	direction: column
	spacing:   12

	Rectangle { width: 160 height: 24 radius: 8 background: theme.primary }
	Rectangle { width: 160 height: 24 radius: 8 background: theme.secondary }
}
```

The axis is read like any other property, so an expression can flip it with the
window instead of duplicating the children:

```goi
Flex {
	direction: window.width < 700 ? "column" : "row"
	spacing:   12

	// …
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `direction` | enum | `row` (default) or `column`; which axis the children run along |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the axis |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the axis |

Everything else is a Row's or Column's: `flex` on a child shares the leftover
space along the axis, a child's `alignSelf` overrides the cross alignment, and
the box accepts the common sizing, padding, border and scrolling properties. A
Flex is a `Row` or a `Column` at paint time, so a design can swap one for the
other without changing how the page looks.

## From Go

```go
actions := w.MustByID[*ui.Flex]("actions")
actions.Direction.Set("column") // and "row" again on a wide window
```

Every element also accepts the [common properties](../components.md#common-properties).
