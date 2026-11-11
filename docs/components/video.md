# Video

A video player. ffmpeg decodes the file behind the scenes and the frames go into
the same GPU atlas an image uses, so a video costs one texture and one draw like
any other picture.

[All components](../components.md)

## In a `.goi` file

```goi
Video {
	id:       clip
	width:    100%
	height:   320
	src:      "goi://assets/clip.mp4"
	fit:      contain
	controls: true
	loop:     true
	volume:   0.8
}
```

`src` is a path inside the design's container (`goi://`, or a relative path the
app loaded), a path on the machine, or an `http`/`https` URL.

## Interaction

With `controls: true` (the default) the element draws a bar along its bottom
edge: a play/pause button, a scrubber, and the position. Clicking the button
toggles playback, clicking the track seeks, and the pointer over the bar shows
the pointer cursor.

With `controls: false` the element is only its picture. That is what a design
that draws its own transport wants: point the buttons at the player by id, and
the same calls work from Go.

```goi
Video {
	id:       clip
	controls: false
}

Button {
	label:   "Play"
	icon:    play_arrow
	onClick: clip.play()
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | container path, machine path, or `http`/`https` URL |
| `fit` | enum | `contain` (default), `cover`, `fill`; how the frame fills the box |
| `controls` | bool | draw the built-in bar; `true` by default |
| `autoplay` | bool | start as soon as the element appears |
| `loop` | bool | restart at the end |
| `muted` | bool | play without sound |
| `volume` | number | 0 to 1; 1 by default |
| `startAt` | number | where playback begins, in seconds |

## Methods

Both the design and Go drive the player through the same six operations.

| Method | Does |
|---|---|
| `play()` | start, or resume from the pause |
| `pause()` | stop the clock and the sound, keeping the position |
| `stop()` | rewind to the start and hold it there |
| `toggle()` | play a paused player, pause a playing one |
| `seek(seconds)` | jump to a position |
| `volume(0..1)` | set the volume |

From a design, a method is a handler call on the element's id:

```goi
Button {
	onClick: clip.seek(12)
}
```

From Go:

```go
clip := ui.MustByID[*ui.Video](w, "clip")
app.PlayMedia(clip)
app.SeekMedia(clip, 12*time.Second)
app.SetMediaVolume(clip, 0.5)
```

The state is on the node too: `Playing`, `Paused`, `Ended`, `Position`,
`Duration`, and `LoadErr`. `OnPlay`, `OnPause`, `OnEnd` and `OnSeeked` subscribe
to the changes, and a design spells those `onPlay`, `onPause` and `onEnd`.

## How it stays fast

- The decoder is an ffmpeg child process. It runs on its own goroutine, never on
  the frame loop, so a slow decode cannot stall the window.
- One frame is buffered and the decoder is held there until the painter takes
  it. A late frame is overwritten, never queued, so the picture does not drift
  behind the clock.
- Frames are decoded near the size the box draws at (up to 2x), so a 4K file in
  a 480dp box does not decode 8 megapixels a frame.
- A pause stops the decoding and leaves the event loop free to sleep: an idle
  player costs nothing.
- Sound is pushed to the device about 200ms ahead of playback, not decoded into
  memory up front, so a two hour file uses the same memory as a ten second one.

## Requirements

ffmpeg has to be on `PATH`, or `GOI_FFMPEG` has to point at the binary. It is a
single dependency that covers every container and codec a desktop app meets, and
it is packaged on Linux, macOS and Windows. An app without it still runs: the
player shows `LoadErr` in its box instead of failing the frame.

`ui.MediaAvailable()` reports whether a decoder was found, which is what a
settings page or a fallback message reads.

## Limits

- No hardware decoding: ffmpeg decodes in software. That is fine at the size a
  window draws, and it keeps the build free of per-platform video APIs.
- A seek restarts the decoder at the new offset, so it takes as long as the
  first frame does.
- Subtitles, multiple audio tracks and playback rate are not exposed yet.
