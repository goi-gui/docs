# Tweens

A **tween** runs a function with eased progress from 0 to 1 over a duration. It
is how a goi app animates anything a property can hold: a sheet sliding in, a bar
growing, a colour's opacity, a `translateX`. There is no animation syntax in
`.goi`; a tween is Go, next to the state it animates.

```go
app.Tween(250*time.Millisecond, ui.Standard, func(p float64) {
	sheet.Height.Set(16 + 184*p)
})
```

`p` is the eased progress: 0 at the start, 1 at the end, and shaped in between by
the easing function.

## Animating one property

`Animate` is the common case: it reads the property's current value, so a second
call mid-flight continues from where it is rather than jumping:

```go
app.Animate(&panel.Width, 320, 300*time.Millisecond, ui.Emphasized)
```

It is `Tween` with the interpolation written out, and it returns the same stop
function.

## Easing

Three curves are built in:

| Easing | Shape | Use |
|---|---|---|
| `ui.Linear` | a straight line | a progress bar tied to real time |
| `ui.Standard` | fast start, soft landing | the default for a small move |
| `ui.Emphasized` | slow at both ends | a large change, such as a page or a sheet |

`Easing` is just `func(float64) float64`, so a custom curve is a function:

```go
snap := func(t float64) float64 { return t * t }
app.Tween(150*time.Millisecond, snap, func(p float64) {
	dot.Width.Set(16 + 8*p)
})
```

## Stopping and replacing

`Tween` returns a stop function. Calling it ends the tween without another call,
which is what a second press of the same button wants:

```go
var stop func()
play := func() {
	if stop != nil {
		stop()
	}
	dot.TranslateX.Set(-160)
	stop = app.Tween(400*time.Millisecond, ui.Emphasized, func(p float64) {
		dot.TranslateX.Set(-160 + 160*p)
	})
}
```

Keep the stop function in app state outside `Bind`: `Bind` runs again after a hot
reload, and a tween started in `Bind` belongs to the tree it was bound to.

## Driving several properties

One tween can drive as many properties as the animation needs, which keeps them
in step:

```go
app.Tween(300*time.Millisecond, ui.Standard, func(p float64) {
	card.Opacity.Set(p)
	frame.TranslateY.Set(12 * (1 - p)) // frame is a Positioned
})
```

Two tweens started together with the same duration and easing stay in step
because the clock is the frame loop's, not each tween's.

## Where it runs

A tween is created on the UI goroutine: inside `Bind`, or from another goroutine
through `app.Post`. Stop it there too. A running tween keeps the frame loop awake
by itself, so an app with nothing else moving still reaches 1 at the end.

`Prop.Set` is a no-op when the value does not change, so a tween that writes the
same value costs nothing. A change marks the node dirty and a frame follows; no
manual repaint call is needed.

## What to tween

- Any `float64` property: `Width`, `Height`, `Opacity`, a slider's `Value`, and
  a `Positioned`'s `TranslateX`/`TranslateY`. A `Rectangle` or a `Column` has no
  translate of its own; wrap it in a `Positioned` when it has to slide.
- A property that changes layout is `DirtyLayout`, so the frame re-lays out;
  paint-only properties such as opacity and translate cost less. Both are fine at
  UI sizes.
- Not a colour directly: `Prop[uint32]` has no interpolation. Fade `Opacity`, or
  step the colour yourself with a tween and `Set`.

## A worked example

A card that grows, fades and slides at once:

```go
app.Tween(320*time.Millisecond, ui.Emphasized, func(p float64) {
	card.Height.Set(96 + 120*p)
	card.Opacity.Set(0.4 + 0.6*p)
	frame.TranslateY.Set(16 * (1 - p))
})
```

The same shape is in the gallery's Motion page, where three dots travel the same
distance with the three easings side by side.

## See also

- [Motion](../components.md) — the gallery page that shows each easing.
- [syntax](../syntax.md) — expressions, which a tween can read.
