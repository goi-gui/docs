# AspectRatio

Sizes its box from a ratio: the parent gives the width and the height follows, or
the other way round in a row. It is the element for a picture or a video panel
that must keep its shape whatever the window does.

[All components](../components.md)

## In a `.goi` file

```goi
Column {
	width: 320

	AspectRatio {
		aspectRatio: 1.7777 // 16:9
		radius:      12
		background:  surfaceContainerHigh
	}
}

Row {
	height: 200

	AspectRatio {
		aspectRatio: 2
		Image { src: "goi://cover.jpg" fit: cover }
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `aspectRatio` | number | width divided by height; `1.7777` is 16:9, `1` is a square |

## How the box is decided

- In a `Column` (or any vertical flow) the parent gives the width, and the
  height is `width / aspectRatio`.
- In a `Row` the cross axis is the height, so the width is
  `height * aspectRatio`.
- A declared `width` or `height` wins for its own axis, and the other follows the
  ratio, so `AspectRatio { width: 300 aspectRatio: 1.5 }` is 300 by 200.
- With neither axis declared and no width to take, the parent's height decides.

Children fill the box, laid out like a `Stack`, so one picture or one overlay
layer is the usual child. The ratio drives layout only: the element does not
clip, and a child larger than the box paints outside it unless a `ClipRRect` or
`width`/`height` says otherwise.

## From Go

```go
box := ui.MustByID[*ui.AspectRatio](w, "cover")
box.Ratio.Set(1.5)
```

Every element also accepts the [common properties](../components.md#common-properties).
