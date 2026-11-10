# Fonts

A design names a font family; Go supplies the file. The built-in Roboto is
always there, and anything else comes from `App.LoadFont`.

## Registering a family

```go
app, err := ui.NewApp()
if err != nil {
	return err
}
defer app.Close()

inter, err := os.ReadFile("assets/Inter.ttf")
if err != nil {
	return err
}
if err := app.LoadFont("Inter", inter); err != nil {
	return err
}

win, err := app.LoadWindow(ui.DirFS("ui"), "Main.goi")
```

`LoadFont` takes the name a design will write and the font bytes; a
`//go:embed` asset works the same way. The name is the handle, not the font's
own family name, so `app.LoadFont("Brand", data)` is reached with
`fontFamily: "Brand"`.

Calling it after the window is up also works: the next frame draws with the new
face.

One file serves every weight. A single face cannot vary, so `fontWeight: bold`
on a custom family draws the same outlines as a regular run; register a family
per weight if you need the difference.

## Using it in a design

On the window, for every element that inherits it:

```goi
Window {
	fontFamily: "Inter"

	Column {
		Text { text: "Everything here is Inter" }
	}
}
```

On one element, to override what it would inherit:

```goi
Text {
	text:       "Example"
	fontFamily: "Inter"
}
```

`fontFamily` is a common property, so it works on any element and a child
inherits the nearest one that set it. An unknown or empty name falls back to
Roboto rather than drawing nothing, so a design is still readable when the app
forgot to load the font.

Measurement follows the same face the painter draws, so a wrapped paragraph
breaks where it is measured; a wide custom face changes a label's size, and
layout sees that.

## From Go

```go
text := ui.MustByID[*ui.Text](w, "label")
text.SetFontFamily("Inter")
```

`SetFontFamily("")` hands the element back to its parent's family.

## Limits

- One face per family: no variable-font axes, no per-weight files, no synthetic
  bold.
- Icons keep Material Symbols whatever the family; a `Text` with an `icon` on
  it still draws the icon font.
- A family added after a window has drawn reshapes the visible text on the next
  frame; text that was already in the atlas is re-rasterized under the new
  family's tag.
