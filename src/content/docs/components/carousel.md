---
title: "Carousel"
---

A horizontal strip of [CarouselItem](/components/carouselitem/) cards that snaps from one
card to the next.

[All components](/components/)

<p align="center">
  <img src="/img/components/carousel-light.png" alt="Carousel in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/carousel-dark.png" alt="Carousel in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Carousel {
	height: 200
	gap:    12

	CarouselItem {
		width: 180
		label: "Recent highlights"
		Image { src: "goi://images/cover.jpg" fit: cover }
	}

	CarouselItem {
		width: 180
		label: "La Familia"
		Image { src: "goi://images/family.jpg" fit: cover }
	}

	CarouselItem {
		width: 180
		label: "Festivals"
		Image { src: "goi://images/festival.jpg" fit: cover }
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `spacing` | number | gap between cards |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; card height inside the strip. `stretch` is the default, so cards fill the carousel's height |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the strip |
| `shrink` | number | width of a card that is not leading, as a share of its declared width; 0.7 by default, 1 for equal cards |
| `scrollSnapType` | enum | `mandatory` (default), `proximity` or `none`; `none` leaves the strip scrolling freely |

## Behaviour

- A card is a [CarouselItem](/components/carouselitem/). Its declared width is the width
  it takes while it leads the strip; an undeclared card is 180dp. The strip's
  height sets every card's height, so a row of cards lines up even when they
  hold different pictures.
- Every card that is not leading is `shrink` of that width, 70% by default. The
  leading card stays full while it scrolls away, and the card after it grows
  from the shrunk width to the full width as the strip moves, so the width
  change follows the drag and the fling. `shrink: 1` gives equal cards.
- The next card peeks in whenever the strip's width is not an exact multiple of
  the card width. That is what tells the reader there is more to scroll.
- A wheel notch, a drag or a fling settles on a card's leading edge
  (`scrollSnapType: mandatory`). Give the carousel `scrollSnapType: none` to
  keep a free offset.
- The strip scrolls horizontally like a `Row`: it clips its cards at the edges,
  and a drag that starts on a card scrolls instead of clicking it.

## From Go

```go
carousel := w.MustByID[*ui.Carousel]("carousel")
carousel.Spacing.Set(16)
carousel.ScrollToChild("last")
```

Every element also accepts the [common properties](/guide/common-properties/).
