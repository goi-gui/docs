# Rotate

Turns the element and everything under it about its own centre, the way CSS
`rotate` does. Layout ignores it: the box keeps its place, its siblings do not
move, and a clipped parent still clips the turned content.

```goi
Column {
	rotate: none // the default
}

Column {
	rotate: 90deg // an angle alone turns about the z axis
}

Column {
	rotate: x 90deg // about the x axis
}

Column {
	rotate: 1 1 1 90deg // about a vector
}
```

An angle may be written four ways; they are the same value, and `goifmt` writes
it back in degrees.

| Written | Same as |
|---|---|
| `90deg` | 90 degrees |
| `0.25turn` | one quarter turn |
| `1.57rad` | 1.57 radians, about 90 degrees |
| `100grad` | 100 gradians |

- A vector form is exactly three numbers and an angle; `1 1 90deg` is a typo and
  the parser reports it.
- Nested rotations compose: an inner 45° inside an outer 90° turns 135°, and the
  inner pivot follows the outer frame.
- The renderer is two-dimensional, so only a turn about the z axis (an angle
  alone, or the `z` form) shows as a rotation. An `x`, `y` or vector rotation is
  accepted and kept, but not projected.
- `rotate` paints: changing it repaints without a re-layout.

From Go the same value is `SetRotation`:

```go
card.SetRotation(45)                 // degrees, about z
card.SetRotation(90, [3]float64{1, 0, 0}) // about the x axis
```
