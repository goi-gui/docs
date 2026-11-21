---
title: "CarouselItem"
---

One card in a [Carousel](/components/carousel/): a rounded surface that clips its child,
darkens the bottom for a label and takes a press with a ripple.

[All components](/components/)

<p align="center">
  <img src="/img/components/carouselitem-light.png" alt="CarouselItem in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/carouselitem-dark.png" alt="CarouselItem in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
CarouselItem {
	width:  180
	height: 200
	label:  "Recent highlights"

	Image {
		src: "goi://images/cover.jpg"
		fit: cover
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the title at the bottom left, over the scrim; white unless `labelColor` says otherwise |
| `supporting` | string | a smaller line below the label |
| `labelColor` | color | the label's colour; white by default |
| `supportingColor` | color | the supporting line's colour; white at 80% by default |
| `radius` | number | the card's corner radius; 28 by default |
| `ripple` | bool | press feedback; on by default on a card with an `onClick` |

`CarouselItem` takes children like `Stack`: an undeclared child fills the card,
and a `Positioned` child anchors itself inside it.

## Behaviour

- The child is clipped to the card's rounded corners, so an `Image` with
  `fit: cover` fills it without square corners showing.
- A label or supporting line adds a dark gradient at the bottom, so the text
  stays readable over a picture. The scrim and the label paint above the child.
- The card ripples from the pointer when it has an `onClick`, the same feedback
  a button gives.
- Inside a `Carousel` the card fills the strip's height, and the width it
  declares is the width it takes while it leads. A card that is not leading is
  `shrink` of that width (70% by default); the next card grows back to full as
  it comes in. Without a declared width it takes the 180dp card default. An
  `Image` or other child with no size fills the card.

## From Go

```go
card := w.MustByID[*ui.CarouselItem]("card")
card.Label.Set("Last month")
```

Every element also accepts the [common properties](/components/#common-properties).
