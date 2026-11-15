# Carousel

A horizontally scrolling row of cards.

[All components](../components.md)

<p align="center">
  <img src="/img/components/carousel-light.png" alt="Carousel in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/carousel-dark.png" alt="Carousel in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Carousel {
	spacing: 12

	Card {
		label:  "One"
		width:  200
		height: 120
	}

	Card {
		label:  "Two"
		width:  200
		height: 120
	}

	Card {
		label:  "Three"
		width:  200
		height: 120
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
carousel := w.MustByID[*ui.Carousel]("carousel")
carousel.Spacing.Set(16)
```

Every element also accepts the [common properties](../components.md#common-properties).
