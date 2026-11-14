# Video

A video player. ffmpeg decodes the file behind the scenes and the frames go into
the same GPU atlas an image uses, so a video costs one texture and one draw like
any other picture.

[All components](../components.md)

## In a `.goi` file

```goi
Video {
	id:        clip
	width:     100%
	height:    320
	src:       "goi://assets/clip.mp4"
	fit:       contain
	controls:  true
	loop:      true
	volume:    0.8
	subtitles: "goi://assets/clip.srt"
}
```

`src` is a path inside the design's container (`goi://`, or a relative path the
app loaded), a path on the machine, or a URL ffmpeg can open: `http`/`https`
(including HLS and DASH), `rtmp`, `rtsp`, `srt`, `udp` and the rest.

## Interaction

With `controls: true` (the default) the element draws a bar along its bottom
edge: a play/pause button, a scrubber, and the position. Clicking the button
toggles playback, pressing or dragging the scrubber seeks, and the pointer over
the bar shows the pointer cursor. A drag moves the handle with the pointer and
seeks the decoder once, on release.

The bar **hides itself** three seconds after the pointer stops moving over the
picture, or three seconds after it leaves. Moving the pointer back over the video
— or pressing anywhere on it — brings it back and restarts the clock. A paused
player follows the same rule: the bar is chrome for a picture, not a permanent
overlay.

While the player is fetching the file or waiting for the decoder — a live stream
between segments included — a small circular-progress ring turns in the middle
of the picture, so a slow start reads as work rather than a still frame. It
takes `color`, and `variant: wavy` draws it as a ribbon too. It disappears as
soon as a frame is there.

`surfaceColor` is the bar's background and, while the player is fetching a file
or a live segment, the loading area behind the ring: an opaque colour replaces
the scrim, and an `#rrggbbaa` value keeps exactly the alpha it names. `color`
tints the scrubber's watched part and its handle, and the loading ring below. `variant: wavy` draws that played part as a moving sine ribbon with round
joins, and only while the video is playing: the wave travels, the handle
rides its end, and a paused video shows the normal bar. The part still ahead is
a dim flat track with no dim fill under the ribbon.

The handle is the slider's: a slim vertical pill rather than a dot. In every
state the watched part stops at the handle and the dim track starts after a 6dp
gap, so they never touch. The hit area grows to the wave's height in both
states.

The pointer itself hides with the bar while it rests on a video, so a watching
cursor does not sit on the film. Any movement brings it back; leaving the video
restores whatever cursor the element under it asks for.

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
| `src` | string | container path, machine path, or a URL ffmpeg opens (HLS, RTMP, RTSP, SRT, UDP) |
| `fit` | enum | `contain` (default), `cover`, `fill`; how the frame fills the box |
| `controls` | bool | draw the built-in bar; `true` by default |
| `autoplay` | bool | start as soon as the element appears |
| `loop` | bool | restart at the end |
| `muted` | bool | play without sound |
| `volume` | number | 0 to 1; 1 by default |
| `startAt` | number | where playback begins, in seconds |
| `buffer` | number | how far ahead the decoder runs, in seconds; 1.5 by default, at most 10 |
| `subtitles` | string | SRT file to draw over the picture; local path, `goi://` asset, or URL |
| `subtitleFontSize` | number | caption size in dp; 0 keeps the body size |
| `subtitleColor` | color | caption text colour; 0 keeps white |
| `subtitleFontWeight` | number | caption weight: a number, or `normal`, `bold`, `bolder`, `lighter` |
| `subtitleShadow` | shadow | text shadow behind the caption glyphs, e.g. `0 2 4 #000000cc` |
| `subtitleBackground` | color | plate behind each caption line; 0 keeps none |
| `audioTrack` | number | which audio stream to play, 0 being the first |
| `fullscreen` | bool | fill the window with the picture, above everything else |
| `controlsIconColor` | color | play/pause icon colour; 0 is white, since the bar sits over the picture |
| `controlsTextColor` | color | clock and LIVE label colour; 0 is white, since the bar sits over the picture |
| `controlsTrackColor` | color | scrubber track, played part and knob; 0 follows white and the scheme's primary |
| `variant` | enum | `normal` (a plain track and loading ring, the default) or `wavy` (both as a moving ribbon) |
| `color` | color | the scrubber's watched part and handle, and the loading ring; unset keeps white over the picture |
| `surfaceColor` | color | the bar's background, alpha included, and the loading area; unset keeps the translucent scrim |

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
| `audioTrack(0)` | pick an audio stream, 0 being the first |
| `fullscreen()` | fill the window with the video, and the window with the screen |
| `windowed()` | go back to the video's own box |
| `toggleFullscreen()` | flip between the two |

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
`Duration`, `Live`, `AudioTracks`, `Hardware`, and `LoadErr`. `OnPlay`, `OnPause`, `OnEnd` and `OnSeeked` subscribe
to the changes, and a design spells those `onPlay`, `onPause` and `onEnd`.

## Buffering

The player decodes a little ahead of the clock so a slow disk or a slow network
does not show as a stutter, and it never decodes the whole file:

- `buffer` is how many seconds of video to keep ready: 1.5 by default, clamped to
  10. Frames are queued, so the decoder blocks when the queue is full and the
  memory stays flat.
- The queue is also capped by bytes (64 MiB), so a 4K file at a large `buffer`
  still cannot fill RAM.
- Sound is held in the output device, about as far ahead as `buffer` asks (never
  more than 2 MiB), not in a Go slice.
- The unplayed part of the buffer shows on the scrubber as a lighter track behind
  the position, so a stall is visible before the picture stops.

`Video.Buffered` and `Audio.Buffered` report how much is waiting, in time.

## Control bar colours

The built-in bar follows the scheme unless the design recolours it. Three
properties cover its three parts, and a zero value keeps the theme's own colour:

```goi
Video {
	src:                "clip.mp4"
	controlsIconColor:  theme.primary
	controlsTextColor:  theme.onSurfaceVariant
	controlsTrackColor: theme.secondary
}
```

- `controlsIconColor` is the play/pause/replay glyph.
- `controlsTextColor` is the clock and the **LIVE** label.
- `controlsTrackColor` is the scrubber: the track, the buffered and played spans,
  and the knob, so a recoloured bar stays one piece.

The bar's own backdrop stays the scheme's scrim, because it has to read over any
frame. Its default ink is white rather than the scheme's `onSurface`: the light
theme draws near-black text, which would vanish into the scrim over a picture. An
`Audio` player keeps the scheme's ink, because its bar is a surface of its own.

## Subtitles

```goi
Video {
	id:        clip
	src:       "clip.mp4"
	subtitles: "clip.srt"
}
```

`subtitles` takes an SRT file — the format every subtitle editor writes. The
cues are parsed once and drawn over the picture, centered near the bottom, each
line on a dark scrim so it reads over a bright frame; the caption moves up when a
control bar is showing and drops back when it hides.

- A local path, a `goi://` asset from the design's container, and an `http(s)`
  URL all work.
- `<i>`, `<b>`, `<font>` and leftover ASS override codes are stripped, because
  the caption is drawn as one plain run.
- A damaged file does not stop the video: `SubtitleErr` says what went wrong and
  the picture plays on, with no captions.
- The text stays white on its scrim in every theme, because it sits on the
  picture and not on a surface.
- Changing `subtitles` at runtime (from Go or an expression) reloads the cues on
  the next frame.

Only SRT is read. `Video.RenderedSubtitles` is the file the loaded cues came
from, which is the same "did the design change it" check a `src` has.

### Styling the captions

The defaults are white text on a dark plate, because the caption sits on the
picture and not on a surface. A design can change all of it:

```goi
Video {
	src:                "clip.mp4"
	subtitles:          "clip.srt"
	subtitleFontSize:   26
	subtitleColor:      #fff59d
	subtitleFontWeight: bold
	subtitleShadow:     0 2 4 #000000cc
	subtitleBackground: #00000080
}
```

- `subtitleFontSize` is in dp; 0 keeps the body size.
- `subtitleFontWeight` takes a number or the CSS keywords `normal`, `bold`,
  `bolder` and `lighter`, the same ones `Text` accepts.
- `subtitleShadow` is a text shadow like `Text`'s `shadow`: `x y [blur
  [spread]] [colour]`.
- `subtitleBackground` paints a plate behind each line; 0 draws none, which is
  the default.
- `subtitleColor` is the glyph colour; 0 keeps white.

A zero value means "the default", so setting only the colour leaves the size,
weight and plate alone.

## Audio tracks

A file with several audio streams — a film with dubs — offers them as a choice.
`audioTrack: 1` picks the second stream, and `clip.audioTrack(1)` or
`app.SetMediaAudioTrack(clip, 1)` does the same at runtime.

The switch reopens only the sound: the picture keeps playing, and the device's
queue is flushed so a moment of the old language is not heard first. An index
past the last stream is clamped to the last one, so a design that names a track a
particular file lacks still plays.

`Video.AudioTracks` is how many streams the file carries, from the probe; a
design that draws its own track menu reads it to know what to offer.

## Hardware decoding

The decoder asks ffmpeg for hardware acceleration (`-hwaccel auto`), which picks
whatever the machine has: VideoToolbox on macOS, D3D11 on Windows, VAAPI or NVDEC
on Linux. Frames are downloaded to system memory for the RGBA canvas, so the rest
of the pipeline is unchanged.

Hardware decoding is an optimisation, never a requirement:

- If the device, the driver or the codec cannot be opened, the pump reopens the
  decoder in software before the first frame, so a player is never left blank.
- Once a file has fallen back, it stays in software until it is reopened, so a
  refusal is not retried every frame.
- `Video.Hardware` reports which one produced the picture.

## Live streams

Point `src` at a stream and it plays like a file, with the timeline bits that do
not exist removed:

```goi
Video {
	id:       camera
	src:      "rtsp://192.168.1.20/stream"
	fit:      contain
	autoplay: true
	muted:    true
	buffer:   0.5
}
```

A source is live when it is a network URL whose container reports no length,
which is what every RTSP camera, RTMP push and live HLS playlist says. Nothing
needs declaring; `Video.Live` reports the answer to Go.

What changes for a live feed:

- The bar keeps its play button but drops the scrubber: it shows a red dot and
  **LIVE** instead of a position and a length.
- `seek()` is ignored — there is no timeline to jump around in — and `startAt`
  has no meaning. `loop` is pointless, because a feed never reaches an end.
- `Position` counts how long this element has been playing, and `Duration` stays
  0.
- When the connection drops (a camera reboots, a network blips) the decoder is
  reopened after a second and the picture comes back, rather than the player
  reporting an end. A stream that never opened at all reports its error under
  `LoadErr` instead of retrying forever.
- The picture is paced by the feed, not by a fixed clock: the player speeds up a
  little while it has a deep cushion and slows down when the cushion runs low,
  so it settles at the rate the source really delivers. Pacing at the nominal
  rate drifts: a stream that reports 25 fps and delivers 23.5 drains the cushion
  a little every second until the picture freezes, and playing "as fast as
  frames arrive" shows a whole segment in half its duration and then stalls.
- An HLS feed is opened a few segments behind the live edge (`-live_start_index
  -3`), because sitting on the edge leaves nothing to play while the next
  segment is being written.
- A live feed decodes at the size it is drawn at, not twice it: its frames are
  what the buffer is made of, and half the bytes is twice the cushion.
- A dropped HTTP connection is reconnected by ffmpeg itself rather than waiting
  for the player to reopen it.
- Before the first frame the player gathers a cushion, so the first gap between
  segments is covered. Until then the box breathes like a loading image.

`buffer` is the latency knob: it is how many seconds of the feed are held ahead,
and a live player defaults to 4 seconds — the file default of 1.5 cannot cover
the gap between two HLS segments. Less means lower latency and a feed that
freezes more readily; more means a longer delay behind the source.

## Fullscreen

`fullscreen: true` (or `video.fullscreen()`) puts the picture over the whole
window, above every other element, and puts the window itself in fullscreen. The
element leaves its own box while it is there: the control bar moves to the bottom
of the screen, a click on the picture toggles playback, and **Escape** leaves.

`windowed()` and `fullscreen: false` put both back, restoring whatever fullscreen
state the design had set on the window. From Go:
`app.SetVideoFullscreen(clip, true)`.

## How it stays fast

- The decoder is an ffmpeg child process. It runs on its own goroutine, never on
  the frame loop, so a slow decode cannot stall the window.
- The decoder fills a small queue and blocks when it is full, so a slow machine
  skips frames instead of slowing the window, and memory stays flat.
- Frames are decoded near the size the box draws at (up to 2x), so a 4K file in
  a 480dp box does not decode 8 megapixels a frame.
- A pause stops the decoding and leaves the event loop free to sleep: an idle
  player costs nothing.
- Sound is pushed to the device a `buffer` ahead of playback, not decoded into
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
