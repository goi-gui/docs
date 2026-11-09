# Rotate

Turns the element and everything under it about its own centre, the way CSS
`rotate` does. Layout ignores it: the box keeps its place, its siblings do not
move, and a clipped parent still clips the turned content.

```goi
Column { rotate: none }          // default
Column { rotate: 90deg }
Column { rotate: 0.25turn }
Column { rotate: 1.57rad }
Column { rotate: 100grad }

Column { rotate: x 90deg }       // about the x axis
Column { rotate: y 0.25turn }
Column { rotate: z 1.57rad }

Column { rotate: 1 1 1 90deg }   // about a vector
```

- An angle may use `deg`, `rad`, `turn` or `grad`. `goifmt` writes it back in
  degrees, which is the same value.
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
