---
title: "Scale"
---

Stretches the element and everything under it about its own centre, the way CSS
`scale` does. Layout ignores it: the box keeps its place, its siblings do not
move, and a clipped parent still clips the stretched content.

```goi
Column {
	scale: none // the default
}

Column {
	scale: 2 // both axes, twice as large
}

Column {
	scale: 50% // a percentage is a factor: 0.5
}

Column {
	scale: 2 0.5 // x stretches, y squashes
}

Column {
	scale: 200% 50% 200% // x, y and z
}
```

| Written | Same as |
|---|---|
| `2` | `2 2` |
| `50%` | `0.5` |
| `2 50%` | `2 0.5` |
| `200% 50% 200%` | `2 0.5 2` |

- One value scales both axes; two values are x and y; three add z.
- The renderer is flat, so z is kept and does not show. It is there so a CSS
  value moves over unchanged.
- Everything the element draws stretches with it: corners turn into ellipses
  under a non-uniform scale, glyphs and images stretch, and border widths follow
  the axis. That is the CSS behaviour, not a distortion the framework adds.
- Nested scales multiply: a `2` inside a `0.5` paints at its natural size, and
  the inner pivot follows the outer frame.
- A rotation and a scale on the same element apply scale first, then rotation,
  the order CSS's individual transform properties use.
- `scale` paints: changing it repaints without a re-layout, so it is cheap to
  animate from a tween.

```go
// A press that grows a card and eases it back.
app.Tween(160*time.Millisecond, ui.Standard, func(p float64) {
	card.SetScale(1+0.05*p, 1+0.05*p)
}).Then(160*time.Millisecond, ui.Standard, func(p float64) {
	card.SetScale(1.05-0.05*p, 1.05-0.05*p)
})
```

A scale about a corner rather than the centre is a `rotate` on the parent plus a
scale on the child, or a `translateX`/`translateY` that compensates: the pivot is
always the element's own centre.

Hit-testing follows the layout box, not the stretched picture, the same way
`rotate` is drawn without moving the press area. A control scaled up to be easier
to see still takes a press where it was laid out; give it the larger `width` and
`height` and scale it below 1 when the box itself should grow.
