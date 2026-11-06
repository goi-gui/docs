---
title: Keyboard input
sidebar_label: Keyboard
---

# Keyboard input

`Window.OnKey` subscribes to key presses. It fires for every press in the
window, whether or not a text field has focus, and it does not consume the event:
the focused field still receives the key and the framework's own editing
shortcuts still run.

```go
off := w.OnKey(func(e ui.KeyEvent) {
	if e.Key == ui.KeyEscape {
		closeDrawer()
	}
})
defer off() // unsubscribe
```

`OnKey` belongs in `Bind`, so it is registered again after every hot reload.

## The event

```go
type KeyEvent struct {
	Key  ui.Key
	Mods ui.Mods
}
```

| `Mods` field | Meaning |
|---|---|
| `Shift` | Shift is held |
| `Ctrl` | Ctrl is held |
| `Alt` | Alt is held |
| `Super` | the platform's Super/Command key is held |
| `Control()` | the platform's primary shortcut modifier: Ctrl elsewhere, Super on macOS |

```go
w.OnKey(func(e ui.KeyEvent) {
	if e.Mods.Control() && e.Key == ui.KeyEnter {
		submit()
	}
	if e.Mods.Shift && e.Key == ui.KeyTab {
		focusPrevious()
	}
})
```

## Keys

| Constant | Key |
|---|---|
| `ui.KeyEscape` | Escape |
| `ui.KeyEnter` | Enter |
| `ui.KeyTab` | Tab |
| `ui.KeyBackspace` | Backspace |
| `ui.KeyDelete` | Delete |
| `ui.KeyLeft`, `ui.KeyRight` | arrow keys |
| `ui.KeyUp`, `ui.KeyDown` | arrow keys |
| `ui.KeyHome`, `ui.KeyEnd` | Home and End |
| `ui.KeyNone` | a key the framework does not name |

Editing shortcuts that use letters are handled inside text fields and are not
part of this list.

## Text input is separate

`OnKey` reports non-text keys. Typed characters are committed to the focused
text field as text, with IME composition handled by the field, so a handler that
wants the current value should read it rather than rebuild it from key events:

```go
field := ui.MustByID[*ui.TextField](w, "search")
field.OnEdit(func(value string) { filter(value) })
field.OnSubmit(func(value string) { search(value) })
```

`OnSubmit` runs on Enter. Use it instead of comparing `KeyEnter` in `OnKey`
when the key should act on the focused field.

## Focus and editing

Text fields and other focusable elements share one focus per window:

- Tab and Shift+Tab move focus between them.
- Left/Right/Home/End move the caret; Ctrl+Left/Right move by word.
- Shift extends the selection, Ctrl+A selects all.
- Ctrl+C, Ctrl+X and Ctrl+V copy, cut and paste.
- Backspace and Delete remove around the caret; Ctrl+Backspace/Delete remove a
  whole word.
- Escape clears a static text selection.

These run before and independently of `OnKey`, which is why `OnKey` is safe for
window-level actions such as closing a drawer, a dialog or a page.
