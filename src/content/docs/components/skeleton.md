---
title: "Skeleton"
---

A placeholder for content that has not arrived: a rounded block with a highlight
band that sweeps across it. It stands in for a line of text, a card or a whole
list while the data loads, so the page keeps its shape instead of jumping.

[All components](/components/)

<p align="center">
  <img src="/img/components/skeleton-light.gif" alt="Skeleton in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/skeleton-dark.gif" alt="Skeleton in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Column {
	spacing: 8

	Skeleton {
		width:  320
		height: 16
	}

	Skeleton {
		width:  240
		height: 16
	}

	// A card: the radius is the common box property, and the sweep can stop.
	Skeleton {
		width:    320
		height:   120
		radius:   16
		animated: false
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `color` | color | the block's colour; defaults to `surfaceContainerHighest` |
| `highlight` | color | the band that sweeps across it; defaults to a lighter shade of `color` |
| `animated` | bool | the sweep; `false` draws the block still, which is what a screenshot or a reduced-motion build wants |

Size, radius and opacity are the common box properties: `width`, `height`,
`radius`, `radiusTop`/`radiusBottom` and the rest. Sizes smaller than the text
that will replace them keep the page from moving when the content arrives, which
is the point of the component.

The sweep is drawn from the frame clock, so it costs no timer and no goroutine,
and a hidden `Skeleton` stops drawing frames. One sweep takes 1.4s and the band is
a third of the width, so a column of blocks reads as one page loading.

## From Go

```go
sk := w.MustByID[*ui.Skeleton]("body")
sk.Color.Set(0xE7E0ECFF)
sk.Highlight.Set(0xFFFFFFFF)
sk.Animated.Set(false) // a still block, for a screenshot or a slow machine
```

The usual switch is to hide the placeholder and show the real node when the
data arrives, which is one property on each side of a `Stack`:

```go
sk.SetVisible(false)
w.MustByID[*ui.Column]("loaded").SetVisible(true)
```

Every element also accepts the [common properties](/guide/common-properties/).
