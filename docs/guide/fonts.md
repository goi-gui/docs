# Fonts

A design names a font family; Go registers the file. The built-in Roboto is
always there, and anything else comes from `App.LoadFont`. Font files live in the
same `assets` directory as the design, so `fonts/Nunito.ttf` means
`assets/fonts/Nunito.ttf`.

## Registering a family

```go
app, err := ui.NewApp()
if err != nil {
	return err
}
defer app.Close()

if err := app.LoadFont("Nunito", "fonts/Nunito.ttf"); err != nil {
	return err
}

win, err := app.LoadWindow("ui/Main.goi")
```

`LoadFont` takes the name a design will write and a path inside the `assets`
directory. `goi run` reads the file from disk; `goi build` embeds it in the
binary, so the same call works in a release. The name is the handle, not the
font's own family name, so `app.LoadFont("Brand", "fonts/Brand.ttf")` is reached
with `fontFamily: "Brand"`.

For several files, use one map:

```go
if err := app.LoadFontMany(map[string]string{
	"Nunito Regular": "fonts/Nunito-Regular.ttf",
	"Nunito Bold":    "fonts/Nunito-Bold.ttf",
	"Nunito Italic":  "fonts/Nunito-Italic.ttf",
}); err != nil {
	return err
}
```

Every valid file is loaded even when one path fails; the returned error joins
the failures. Since one family is one face, give each weight or italic file its
own name, as above.

Calling either method after the window is up also works: the next frame draws
with the new face.

One file serves every weight. A single face cannot vary, so `fontWeight: bold`
on a custom family draws the same outlines as a regular run; register a family
per weight if you need the difference.

## Using it in a design

On the window, for every element that inherits it:

```goi
Window {
	fontFamily: "Nunito"

	Column {
		Text {
			text:       "Nunito"
			fontFamily: "Nunito"
		}

		Text {
			text:       "Roboto"
			fontFamily: "Roboto"
		}
	}
}
```

Roboto is built in, so the second line needs no `LoadFont`. Use `fontFamily` on
one element to override what it would inherit.

`fontFamily` is a common property, so it works on any element and a child
inherits the nearest one that set it. `Roboto` is always available without a
registration; a name that is neither Roboto nor registered falls back to Roboto
and logs one warning per family, so a typo is visible rather than silent. An
empty name simply inherits.

Measurement follows the same face the painter draws, so a wrapped paragraph
breaks where it is measured; a wide custom face changes a label's size, and
layout sees that.

## From Go

```go
text := w.MustByID[*ui.Text]("label")
text.SetFontFamily("Nunito")
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
