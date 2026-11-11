# Audio

An audio player. It decodes with ffmpeg and plays through the default output
device; with `controls: true` it draws a compact bar with a play button, a
scrubber and the position.

[All components](../components.md)

## In a `.goi` file

```goi
Audio {
	id:       podcast
	width:    100%
	height:   64
	src:      "goi://assets/episode.mp3"
	controls: true
	volume:   0.8
}
```

`src` is a path inside the design's container (`goi://`, or a relative path the
app loaded), a path on the machine, or a URL ffmpeg can open: `http`/`https`
(including HLS), `rtmp`, `rtsp`, `srt`, `udp` and the rest.

## Interaction

With `controls: true` (the default) the element is one bar: a play/pause button,
a scrubber and the position. Clicking the button toggles playback, clicking the
track seeks, and the pointer over the bar shows the pointer cursor.

With `controls: false` the element keeps its box and draws nothing. That is what
a design that draws its own transport wants: point the buttons at the player by
id, and the same calls work from Go.

```goi
Audio {
	id:       podcast
	controls: false
}

Button {
	label:   "Play"
	icon:    play_arrow
	onClick: podcast.play()
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | container path, machine path, or a URL ffmpeg opens (HLS, RTMP, RTSP, SRT, UDP) |
| `controls` | bool | draw the built-in bar; `true` by default |
| `autoplay` | bool | start as soon as the element appears |
| `loop` | bool | restart at the end |
| `muted` | bool | play without sound |
| `volume` | number | 0 to 1; 1 by default |
| `startAt` | number | where playback begins, in seconds |
| `buffer` | number | how far ahead the decoder runs, in seconds; 1.5 by default, at most 10 |

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
podcast := ui.MustByID[*ui.Audio](w, "podcast")
app.PlayMedia(podcast)
app.SeekMedia(podcast, 12*time.Second)
app.SetMediaVolume(podcast, 0.5)
```

The state is on the node too: `Playing`, `Paused`, `Ended`, `Position`,
`Duration`, and `LoadErr`. `OnPlay`, `OnPause`, `OnEnd` and `OnSeeked` subscribe
to the changes, and a design spells those `onPlay`, `onPause` and `onEnd`.

## Live streams

An audio `src` may be a stream as well: `rtmp`, `rtsp`, `srt`, `udp` or an HLS
`http` URL. A network source with no length is treated as live — there is no
scrubber, `seek()` is ignored, and a dropped connection is reopened after a
second instead of ending the sound. `buffer` is how far ahead the device is fed,
so a live feed wants a second or less.

## Buffering

`buffer` is how many seconds of sound to keep ready, 1.5 by default and at most
10. The samples wait in the output device, not in a Go slice, so a two hour file
uses the same memory as a ten second one and a slow disk still plays smoothly.
`Audio.Buffered` reports how much is waiting.

## How it stays fast

- The decoder is an ffmpeg child process on its own goroutine, never the frame
  loop, so a slow decode cannot stall the window.
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

- A seek restarts the decoder at the new offset, which costs a moment.
- Multiple audio tracks and playback rate are not exposed yet.
- One track at a time: a second player pauses nothing, but both share the
  output device, so two at once means both are heard.
