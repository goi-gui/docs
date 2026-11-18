---
title: Async work
sidebar_label: Async work
---

# Async work and `App.Post`

The UI is a normal single-threaded loop. `Bind` and every event handler run on
the UI goroutine, and the frame loop reads property cells while it lays out and
paints. Property cells are not locked: changing one from another goroutine races
the frame and can corrupt what the painter sees.

When a background goroutine — a fetch, a file read, a decoder, a worker pool —
has a result and the UI should show it, hand the update back with
[`App.Post`](https://pkg.go.dev/github.com/goi-gui/goi/ui#App.Post):

```go
win.Bind(func(w *ui.Window) error {
	label := w.MustByID[*ui.Text]("status")

	go func() {
		text, err := fetchStatus()
		app.Post(func() {
			if err != nil {
				label.Text.Set("could not load")
				return
			}
			label.Text.Set(text)
		})
	}()
	return nil
})
```

`Post` queues the function and wakes the event loop. The frame loop runs the
queue in FIFO order on the UI goroutine, so the update lands between frames, not
in the middle of one. `Prop.Set` already marks the tree dirty and schedules the
next frame; do not call a repaint function from inside the posted closure.

## Rules of thumb

- Touch the tree, a property cell, `ui.SetData`, `ui.SetHandler`, a window method
  or `app.SetLanguage` only from a `Bind`/handler callback or from `App.Post`.
- `App.Post` is safe from any goroutine, and safe before `app.Run`; the closure
  runs once the loop is ready.
- Keep the closure small. Do the I/O and parsing before posting, then move only
  the result into the UI.
- A posted closure runs once. If the work can finish after the window closes,
  check the state you need inside the closure instead of assuming it still
  exists.
- Posting `nil` is a no-op, and posts keep their order relative to each other.

The framework itself follows the same split: image decoding, remote fetches and
video frames are prepared off the UI goroutine and their results arrive through
`App.Post`. That is why a large image does not drop a frame.
