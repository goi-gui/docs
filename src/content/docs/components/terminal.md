---
title: Terminal
---

A character-cell terminal with ANSI/VT100 colours, cursor movement, scrollback
and an alternate screen. The design gives it a box; the app attaches a tty with
`SetReader` and `SetWriter`.

[All components](/components/)

<p align="center">
  <img src="/img/components/terminal-light.png" alt="Terminal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/terminal-dark.png" alt="Terminal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Terminal {
	width:      720
	height:     400
	fontSize:   14
	scrollback: 5000
	padding:    10
	radius:     12
	background: #111318
	foreground: #e8e8e8
}
```

The content is left-aligned in a monospace face, so columns and rows line up.
The character grid follows the component's width and height; `scrollback` is
how many lines of history the wheel can reach, 1000 by default.

## Properties

| Property | Type | Notes |
|---|---|---|
| `fontSize` | number | cell text size; 13 by default |
| `scrollback` | number | history lines kept for the wheel; 1000 by default |
| `foreground` | color | default text colour; the theme's onSurface by default |

`background`, `padding`, `radius` and the other common box properties work as on
every element. The terminal uses the embedded **Maple Mono NF CN** face when the app is built
with the `terminal` tag (`all` includes it), and Roboto Mono otherwise. Maple
covers Latin, Greek, Cyrillic, Nerd Font icons and CJK in one OFL-licensed file,
so wide characters draw instead of a box. It is about 20 MB, which is why the
tag is opt-in. A design can still override `fontFamily`.

## From Go

```go
term := ui.MustByID[*ui.Terminal](w, "term")
term.SetReader(tty)
term.SetWriter(tty)
term.OnResize(func(size ui.TerminalSize) {
	pty.Setsize(tty, &pty.Winsize{
		Rows: uint16(size.Rows),
		Cols: uint16(size.Cols),
	})
})
term.SetWaiter(func() (int, error) {
	err := cmd.Wait()
	if cmd.ProcessState == nil {
		return -1, err
	}
	return cmd.ProcessState.ExitCode(), err
})
term.OnExit(func(exit ui.TerminalExit) {
	if exit.Err != nil {
		log.Print(exit.Err)
	}
	app.Quit()
})
```

`SetReader` starts a goroutine that feeds the parser and posts each chunk to the
UI thread; it ends when the reader ends.
`SetWriter` receives the bytes the user types. `Feed`/`FeedString` are there for
a test or a non-tty byte source, `WriteInput` sends text as if typed, and
`Grid`/`ScrollBy` read and move the view.

`OnExit` fires once when the reader passed to `SetReader` ends. A shell ends
there after the user types `exit` or presses Ctrl+D, so `app.Quit()` is the
usual handler; it runs on the UI goroutine. `TerminalExit.Err` is an unexpected
read error, and is nil for a normal end of stream; the EIO a Unix pty reports
when its child closes counts as normal. Set `SetWaiter` to have the terminal
wait for the process and fill `TerminalExit.Code` with its exit code. The
terminal calls that waiter once, so the app must not also call `Wait`; `Code`
is -1 when it is unknown or the process ended on a signal.

The `Terminal` component has no pty dependency. An app that wants a shell adds
one itself, usually [`creack/pty`](https://github.com/creack/pty), opens the
process with `StartWithSize`, and passes the returned file to both setters. The
[`examples/terminal`](https://github.com/goi-gui/examples/tree/main/terminal)
project is a complete shell window with resize and exit wiring.

## Reading the screen

`View` returns the visible grid with scrollback applied, which is what a
custom exporter, a test or a screenshot needs:

```go
view := term.View(term.Grid().Rows)
for _, row := range view.Lines {
	for _, cell := range row {
		// cell.R, cell.Comb, cell.Cont, cell.FG, cell.BG, cell.Link
	}
}
```

`TerminalView` also has `CursorRow`, `CursorCol`, `CursorOn`, `CursorBlink`,
`Cols` and `Rows`. A `TerminalCell` carries the rune, its combining marks, the
continuation flag of a wide character, a sixel bitmap in `Image`, an OSC 8
`Link`, the colours and the bold/faint/italic/underline/reverse/strike/hidden
flags. `term.Selection()` and `SelectedText(rows)` read the current cell
selection, and `ClearSelection` drops it.

`Feed`/`FeedString` parse bytes without a reader, `WriteInput` sends text as if
typed, `ScrollBy` moves the view and `ScrollLines` reports how much history is
above it. `Grid` is the measured column and row count, and `Fit` resizes the
grid when an app paints outside the normal flow. `Clear` empties the visible
screen and its scrollback, homes the cursor and drops the selection, leaving the
reader, writer, colours and terminal modes alone. On the alternate screen it
clears that screen; the main screen returns on exit, the way a terminal command
works.

## Behaviour

- Covers the common VT100/ANSI commands: cursor movement, erase, insert/delete,
  scrolling regions, save/restore, SGR colours (16, 256 and truecolour),
  bold/faint/italic/underline/reverse/strike, the alternate screen and cursor
  visibility. DEC modes include origin mode, the application cursor keys, a
  blinking cursor, save/restore (`1048`) and focus reporting (`1004`).
- Text is measured in cells: East Asian wide characters take two cells, and
  combining marks attach to the character before them.
- OSC 8 hyperlinks underline their cells; a click opens the target with the
  desktop, the same way a link in `Text` does.
- A sixel bitmap is decoded and drawn at the cursor cell, where a program put
  it. Images scroll with the line they were anchored to.
- Output that runs past the bottom scrolls into `scrollback`; the wheel over the
  terminal moves through it.
- Click the terminal to give it keyboard focus. Tab, Escape, the arrows and the
  control letters go to the shell, not to focus traversal or the app.
- Drag across cells to select; `Ctrl+Shift+C` copies and `Ctrl+Shift+V` pastes
  (Command on macOS). A bracketed-paste program receives the
  `200~`/`201~` wrapper it asked for.
- A program can enable the DEC mouse modes (`9`, `1000`, `1002`, `1003`) with
  the SGR (`1006`), UTF-8 (`1005`) or urxvt (`1015`) encoding; clicks,
  releases, drags and the wheel are then forwarded to it instead of selecting
  text.
- `OnResize` fires when the measured grid changes, which is where a pty's window
  size stays in sync with the box. `OnExit` fires when the reader ends, with
  the read error and, when a waiter is set, the process exit code; a shell that
  exits closes the window from the app's handler.

Every element also accepts the [common properties](/guide/common-properties/).
