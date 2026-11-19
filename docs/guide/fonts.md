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
the failures. This form gives each file its own family name.

## One family, several files

A family with weight and italic files uses the Google Fonts naming convention:

```text
assets/fonts/
  Nunito-Regular.ttf
  Nunito-Italic.ttf
  Nunito-Medium.ttf
  Nunito-SemiBold.ttf
  Nunito-Bold.ttf
  Nunito-BoldItalic.ttf
  Nunito-ExtraBold.ttf
  Nunito-Black.ttf
```

Register the pattern once:

```go
if err := app.LoadFontFamily("Nunito", "fonts/Nunito-*.ttf"); err != nil {
	return err
}
```

For several families, use one map:

```go
if err := app.LoadFontFamilyMany(map[string]string{
	"Nunito": "fonts/Nunito-*.ttf",
	"Inter":  "fonts/Inter-*.ttf",
}); err != nil {
	return err
}
```

Every valid pattern loads even when another one fails; the errors are joined.

The design keeps one `fontFamily` and picks the file with `fontWeight` and
`fontStyle`:

```goi
Text {
	text:       "Nunito Bold"
	fontFamily: "Nunito"
	fontWeight: 700
}

Text {
	text:       "Nunito Bold Italic"
	fontFamily: "Nunito"
	fontWeight: 700
	fontStyle:  italic
}
```

The pattern is an assets-relative glob, so `fonts/Nunito-*.ttf` picks every
static file. The style suffix accepts `Regular`, `Thin`, `ExtraLight`, `Light`,
`Medium`, `SemiBold`, `Bold`, `ExtraBold`, `Black`, any of those with `Italic`,
and `Italic` alone. If the exact weight is absent, the nearest one in the family
is used. A family loaded with `LoadFont` has one face for every weight; use
`LoadFontFamily` when the files differ.

## Variable fonts

One variable font file can cover every weight:

```go
if err := app.LoadVariableFont("Nunito", "fonts/Nunito[wght].ttf", nil); err != nil {
	return err
}
```

`fontWeight` drives the `wght` axis; `axes` pins any other axis, for example
`"wdth": 90` or `"opsz": 14`. The `axes` map does not control `wght`.
`fontStyle: italic` slants the upright face: `ital` and `slnt` are not driven
separately. For real italic files, use `LoadFontFamily` instead.

The file must have a `wght` axis. A static file is rejected instead of being
registered as a variable font. If the font's outlines cannot be read, the call
returns an error rather than drawing blank text.

Calling any of these after the window is up also works: the next frame draws
with the new face.

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

- `LoadVariableFont` maps `fontWeight` to `wght`; extra axes are fixed per call.
  Italic is synthetic, so a variable font's `ital`/`slnt` axis is not used.
- A variable font needs a `wght` axis; a static file is an error. Some CFF2
  variable fonts have outlines the parser cannot read and return an error too.
- Synthetic bold is not applied. A single `LoadFont` face therefore draws every
  weight the same; use `LoadFontFamily` for static files or `LoadVariableFont`
  for a weight axis.
- Icons keep Material Symbols whatever the family; a `Text` with an `icon` on
  it still draws the icon font.
- A family added after a window has drawn reshapes the visible text on the next
  frame; text that was already in the atlas is re-rasterized under the new
  family's tag.
