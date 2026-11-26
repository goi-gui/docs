---
title: ".goi syntax"
---

A `.goi` file describes a design. Go code attaches behaviour; the file holds no
logic. A design may be one file or several: a file can import fragments and pass
them values.

```goi
// line comment
/* block comment */

Window {
	id:         main
	title:      "Counter"
	width:      480
	height:     320
	background: #1b1d22

	Column {
		padding:        16
		spacing:        8
		crossAxisAlign: center

		Text {
			id:   label
			text: "0"
			role: displayLarge
		}

		Button {
			id:    inc
			label: "Increase"
			leadingIcon:  add
		}
	}
}
```

## Splitting a design across files

A file may start with its `import` lines, one `props` block and its
declarations, before its root element. An import may leave the element name to
the file's base name:

```goi
import "./Sidebar.goi"

Window {
	Sidebar {}
}
```

An explicit alias still works when another name reads better:

```goi
import Inbox "./Sidebar.goi"

Window {
	Inbox {}
}
```

With no alias, the base name without `.goi` is the element name. A name that is
not an identifier is folded into one — `my-card.goi` becomes `MyCard` — and a
purely numeric name gets a `File` prefix (`123.goi` becomes `File123`).

A path may also start at the asset container root, the `assets` directory
`goi.yaml` names, instead of the importing file:

```goi
import "goi://shared/Other.goi"
import "../parts/Card.goi"
```

`goi://shared/Other.goi` is `assets/shared/Other.goi` from every file. A path
with no scheme is relative to the importing file, so `../parts/Card.goi` can
reach another directory as long as it stays inside the container. The editor
completes both forms: container paths from the assets root, relative paths from
the file. Auto import writes the container form and searches the whole assets
directory, not just the file's folder; it is offered in element completion and
as a quick fix on the unknown-element diagnostic.

`props` declares the typed values the fragment expects, the way Go
declares a field; the fragment reads them as `props.Name`:

```goi
// Sidebar.goi

props {
	Title    string
	Subtitle string
}

Column {
	width: 280

	Text {
		text: props.Title
		role: "titleLarge"
	}

	Text {
		text: props.Subtitle
		role: "bodySmall"
	}
}
```

```goi
// Main.goi

import Sidebar "./Sidebar.goi"

Window {
	Column {
		Sidebar {
			Title: "Inbox"
			width: 300
		}
	}
}
```

- The import path is relative to the **importing file** and must stay inside the
  asset container. Fragments may import fragments; a cycle is an error.
- `Sidebar { }` is replaced by the fragment's root element, so the fragment
  decides its own layout and the instance places it like any other child.
- A prop is `Name Type`, with no default: a prop the instance leaves out is the
  **type's zero value** (`""`, `0`, `false`, `#00000000`); a slice, a map and a
  handler have no literal zero, so a fragment that reads one needs the instance
  to pass it, and the checker says so, so a fragment never
  has to guard for a missing value.
- The type is written the way Go writes it: a primitive, a slice (`[]Ticket`), a
  map (`map[string]int`), a handler (`func(id string)`) or a declared `type`.
- A slice prop is walked like a bridge list: `for i, row := range props.Rows`.
  The instance passes a bridge list — `List { Rows: bridge.Tickets }` — whose
  type must match the declaration.
- A handler prop is called like a bridge handler: `onClick:
  props.OnOpen(row.ID)`. The instance passes a handler — `Row { OnOpen:
  bridge.OnOpen }` — and `event` is not available inside the fragment, because
  the fragment decides what it passes.
- The language server completes a call site: inside `Counter { … }` it offers the
  props that fragment declares (with their Go types), the properties its root
  lets the instance override, and the slots it fills; the value after a prop
  completes like the declared type. Hover explains both the alias and the prop.
- A fragment can take a value and a handler from the same bridge in one call:
  `Count: bridge.Step OnStep: bridge.onStep`. The fragment shows the value and
  calls the handler, and never mentions `bridge` itself; see
  `Counter.goi` in the examples module.
- An instance property whose name is a prop sets that prop. Any other property
  is applied to the fragment root, replacing the fragment's own value of the same
  name. So `Sidebar { width: 300 }` overrides the fragment's width.
- `id` is the one shared name: a fragment that declares an `id` prop takes the
  instance's `id:` as that value, so instance-id scoping is off for it. Declare
  a different prop name when the instance needs its ids namespaced.
- A fragment's root may be any element; only the file a program loads must be a
  `Window`. That is checked when the app loads, so the editor and `goicheck`
  accept any root and a page split out of a window can be opened on its own.
- `props.Name` is only valid inside the file that declares it. The entry file has
  nothing to fill it in, so it is an error there; a name the block does not
  declare is an error too, with a "did you mean" hint.
- A prop's declared type is checked against every property it feeds.

### Passing children and slots

A fragment can take `$children` and named slots as well as props. The [Fragments
guide](/guide/fragments/#passing-children) has the syntax, the props rules and
how ids are scoped to an instance.

### Conditional blocks

`if`, `else if`, `else` and `switch` choose which elements show. See
[Conditional](/guide/conditionals/), including the value form `conditional { … }`.

### Loops

`for _, item := range bridge.Items` repeats elements. See [Loops](/guide/loops/).

### Declarations: values and handlers

A design declares its `bridge` values, handlers and `type` rows before the root
element. [Bridge](/guide/bridge/) covers the declarations, `SetData`,
`SetHandler` and the type table.

## Grammar

```text
File      = { Import | Props | Bridge | Shape } Element EOF
Import    = "import" Ident String [";"]
Props     = "props" "{" { Decl } "}"
Bridge    = ("bridge" | "data") "{" { Decl } "}"
Shape     = ("type" | "data") Ident "{" { Decl } "}"
Decl      = Ident Type [";"]
Type      = Primitive | "[]" Type | "map" "[" Ident "]" Type
          | "func" "(" [ Ident Type { "," Ident Type } ] ")"
Primitive = "bool" | "string" | "color" | Go numeric types | Ident
Element   = Ident "{" { Member } "}"
Member    = Property | Element | If | For | Switch
          | "$" Ident [ "{" { Member } "}" ]
If        = "if" Value "{" { Member } "}"
            { "else" "if" Value "{" { Member } "}" }
            [ "else" "{" { Member } "}" ]
For       = "for" [ Ident [ "," Ident ] ":=" ] "range" Value "{" { Member } "}"
Switch    = "switch" Value "{" { "case" Value { "," Value } ":" { Member } }
            [ "default" ":" { Member } ] "}"
Property  = Ident ":" ( Value | EventHandler ) [";"]
Shadow    = "none" | ShadowLayer { "," ShadowLayer }
ShadowLayer = Number Number [ Number [ Number ] ] [ Color | Ident ] [ "inset" ]
EventHandler = Ident ":" ("bridge" | "data" | "props") "." Ident
               "(" [ Value { "," Value } ] ")"
Value     = String | Number | Bool | Color | Ident | Map | Call | Expression
Call      = "formatf" "(" Value { "," Value } ")"
Map       = "{" [ MapEntry { "," MapEntry } [","] ] "}"
MapEntry  = Ident ":" Value
Expression = Or [ "?" Value ":" Value ]
Or         = And { "||" And }
And        = Equality { "&&" Equality }
Equality   = Compare { ("==" | "!=") Compare }
Compare    = Sum { ("<" | "<=" | ">" | ">=") Sum }
Sum        = Term { ("+" | "-") Term }
Term       = Unary { ("*" | "/" | "%") Unary }
Unary      = ("!" | "-") Unary | Factor
Factor     = Percentage | Number | String | Bool | Color | Ident
           | Ident "." Ident | "(" Expression ")"
Percentage = Number "%"
```

Newlines are not tokens. A member is a property when the identifier is followed
by `:` and a child element when it is followed by `{`, so `Name: value` and
`Name { ... }` can be written on one line or across many. The one exception is
`shadow`, whose layers end at the line break, because its parts are written as
juxtaposed tokens rather than one literal. A declared type is
`Name Type`, with no colon: the colon is what tells a property from a
declaration. A function call appears either as an event property's whole value
(the bridge handler) or as the `formatf` builtin inside a `Value`.

## Literals

| Form | Type | Notes |
|---|---|---|
| `"text"` | string | one line; `\" \\ \n \t \r \uXXXX` escapes; `\uD83D\uDE00` surrogate pairs work |
| `!"line\nline"!` | string | a block that spans lines, with no escapes; see [Multi-line strings](#multi-line-strings) |
| `hello` | identifier | used for enums and `id`; also accepted where a string is expected |
| `480`, `32.5`, `-1` | number | one numeric type everywhere (`float64`) |
| `true`, `false` | bool | |
| `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` | color | alpha defaults to `ff`; `"#rrggbb"` quoted also works |
| `white`, `rebeccapurple` | color | any of the 148 CSS colour names, written bare or quoted |
| `"rgb(42, 123, 155)"`, `"rgba(42, 123, 155, .5)"` | color | CSS `rgb()`/`rgba()`; the modern `rgb(42 123 155 / 50%)` form works too |
| `"hsl(200 40% 50%)"` | color | CSS `hsl()`/`hsla()` |
| `linear-gradient(90deg, red, blue 60%)` | color | CSS gradient fill, quoted or unquoted; stops may be `%`, `dp` or a bare length; `background` only, see [Colours and gradients](#colours-and-gradients) |
| `theme.surfaceContainerHigh` | color role | a theme name, so it follows light/dark; any role in the M3 scheme |
| `red / 50`, `#411f89 / 50`, `theme.primary / 50` | color with opacity | any colour form takes `/ 0-100` alpha; see [Colours](/guide/colours/#opacity) |
| `customColor.myBrand` | custom color | a name the app defines with `Window.SetCustomColor`; an undefined one warns and falls back to `onSurface` |
| `90deg`, `x 90deg`, `1 1 1 90deg` | rotate | the `rotate` property only: CSS form, see [Rotate](#rotate) |
| `2`, `50%`, `2 0.5`, `200% 50% 200%` | scale | the `scale` property only: CSS form, see [Scale](#scale) |
| `2 2 5 #000000 inset` | shadow | the `shadow` property only: CSS form, a colour variable as `theme.<role>` or `customColor.<name>`; `none` clears it, see [Shadows](/guide/shadows/) |
| `responsive { base: 8 md: 16 }` | modifier | responsive value, one entry per breakpoint; see [Responsive values](#responsive-values) |
| `conditional { bridge.isWide: 20 default: 10 }` | modifier | first true condition picks the value, `default` is the fallback; see [Conditional values](#conditional-values) |
| `state { default: red hover: blue }` | modifier | one value per interaction state; see [State values](#state-values) |
| `[1, 2, 3]`, `["Jan", "Feb"]` | list | a property whose value is a list, such as a chart's `categories`, `values` or `colors`; a trailing comma is allowed, see [Lists](#lists) |

## Multi-line strings

A string that spans lines is written between `!"` and `"!`:

```goi
Markdown {
	text: !"# Title

		A paragraph with **bold** words.

		- one
		- two
			- nested"!
}
```

The block's indentation is stripped, which is what lets the document keep the
indentation of the element around it. The base is the whitespace that starts the
line the closing `"!` sits on, and it is removed from every line after the first;
the first line stays as written right after `!"`. A line indented further keeps
the difference, so a nested list stays nested.

Put the closing `"!` after the last line of text, or alone on a line indented like
the rest: on its own line it adds a final newline to the value, at the end of the
text it does not. Either way the base is that line's indentation.

Nothing is unescaped in this form, because a document is not source code: a
backslash stays a backslash. Any string property accepts it — a `Markdown`'s
`text`, a `Code`'s `text`, a `Text`'s `text` — and goifmt writes a value with a
line break back this way, one line per source line, each lined up under the
column the first line's text starts at, so the block reads as one column however
the properties around it are padded.

## Lists

A few properties take a list instead of one value. A chart is the case today:
`categories` names the points, and one `ChartSeries` child carries a series'
`values` and its `colors`.

```goi
PieChart {
	categories: ["Direct", "Search", "Social"]
	textColor:  theme.onSurface

	ChartSeries {
		values: [42, 27, 18]
		colors: [theme.primary, theme.tertiary, #c62828]
	}
}
```

The square brackets hold ordinary values, separated by commas. A trailing comma
is allowed, so a long list reads like Go's. What an item may be is the property's
own rule: a number for `values`, a string or bare word for `categories`, a colour
or a `theme.` role for `colors`.

An item may also be a variable or an expression, so one number of a series, or
one slice's colour, can come from Go while the rest stays in the file:

```goi
PieChart {
	categories: [bridge.firstLabel, "Search", "Social"]

	ChartSeries {
		values: [bridge.direct, 27, 18]
		colors: [theme.primary, theme.tertiary, customColor.accent]
	}
}
```

`bridge.` names a value the app set with `ui.SetData`, `app.` and `window.` are
the usual globals, and a conditional (`bridge.wide ? 40 : 12`) works too. A list
with one of those is re-read every frame, and the chart rebuilds its data when a
resolved value changed; a list of plain literals is written once.

A role always carries its namespace. A bare word is a CSS colour name (`red`,
`rebeccapurple`) or, when the scheme owns it, a diagnostic that names the form
to write: `theme.primary`. Lists are stricter only in reporting it earlier.

## Colours and gradients

A colour is a theme role (`theme.primary`), a CSS literal (a name, `rgb()`/`hsl()`
or a hex value), or an app-defined name (`customColor.brand`). The first follows
light and dark; the rest are fixed. A gradient is a colour value and belongs on
`background`; `backdropBlur` takes the same shape with blur radii as stops. Only
`background` takes a colour gradient.

```goi
Column {
	background: linear-gradient(90deg, theme.primary, customColor.brand 80%)
}
```

The full rules, including the 148 CSS names, gradient stops and the checker
diagnostics, are on [Colours](/guide/colours/).

## Rotate

`rotate` is CSS `rotate`: `90deg`, `0.25turn`, `x 90deg`, or `1 1 1 90deg`;
`none` clears it. Layout ignores it and a nested turn composes. Only the z-axis
turn is projected by the flat renderer.

See [Rotate](/guide/rotate/) for the forms and the Go setter.

## Scale

`scale` is CSS `scale`: `2`, `50%`, `2 0.5`, or `200% 50% 200%`; `none` clears
it. Layout ignores it, everything the element draws stretches, and a scale
applies before a rotation on the same element.

See [Scale](/guide/scale/) for the worked example and the Go setter.

## Elements

| Element | Children | Properties beyond the common set |
|---|---|---|
| `Window` | yes | `title`, `theme` (`light`, `dark`, or a name the app registered), `themeTransition`, `titleBar` (`system`, `custom`), `resizable`, `minimizable`, `maximizable`, `minimized`, `maximized`, `fullscreen` (all bool; `disableResize` is the older inverse of `resizable`) |
| `Column` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `Row` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `Flex` | yes | `direction` (`row`, `column`), and the Row/Column layout properties: `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `TitleBar` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign`; a press that misses its clickable children moves the window |
| `Stack` | yes | `crossAxisAlign`, `mainAxisAlign` |
| `ClipRRect` | yes | `crossAxisAlign`, `mainAxisAlign`; clips its children to its rounded box |
| `Hero` | yes | `tag`, `duration`; a shared element that flies to the same tag on another page (see [Hero](/components/hero/)) |
| `GestureDetector` | yes | `onDoubleTap`, `onLongPress`, `onPanStart`, `onPanUpdate`, `onPanEnd`, `onMouseEnter`, `onMouseMove`, `onMouseLeave`; lays children out like a `Stack` |
| `Positioned` | yes | `left`, `top`, `right`, `bottom`, `translateX`, `translateY` |
| `Wrap` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `Grid` | yes | `columns`, `variant` (`normal`, `masonry`), `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `AspectRatio` | yes | `aspectRatio` (width / height); the parent gives the width and the height follows, or the height in a row and the width follows |
| `Rectangle` | no | — |
| `Image` | no | `src` (`goi://` container, a machine path, or an `http(s)` URL), `fit` (`cover`, `contain`, `fill`), `crossfadeSrc`, `paused`, `loop`, `lazy`; see [Image](/components/image/) |
| `SVG` | no | `src` (same three forms), `fit` (`contain`, `cover`, `fill`), `color` (replaces the document's `currentColor`), `crossfadeSrc`, `paused`, `loop`, `lazy`; see [SVG](/components/svg/) |
| `Code` | no | `text`, `language`, `showCopy`, `variant`; see [Code](/components/code/) |
| `Terminal` | no | `fontSize`, `scrollback`, `foreground`; see [Terminal](/components/terminal/) |
| `WebView` | no | `src`, `html`, `baseURL`, `userAgent`, `zoom`, `transparent`, `devtools`; a native web view, see [WebView](/components/webview/) |
| `Mermaid` | no | `data`; see [Mermaid](/components/mermaid/) |
| `Map` | yes | `tiles`, `attribution`, `center`, `zoom`, `bbox`, `reverseTileColors`, `disablePan`, `disableZoom`; see [Map](/components/map/) |
| `Geom` | no | `data`, `fillColor`, `lineColor`; see [Geom](/components/geom/) |
| `Point` | yes | `coordinate`; see [Point](/components/point/) |
| `Path` | no | `coordinates`, `lineColor`; see [Path](/components/path/) |
| `Text` | no | `text`, `fontSize`, `weight`, `fontWeight`, `fontStyle`, `decoration`, `decorationStyle`, `decorationThickness`, `decorationColor`, `color`, `align`, `wrap`, `truncate`, `maxLines`, `role`, `selectable`, `link` |
| `RichText` | yes (`Text` runs) | `text`, `role`, `fontSize`, `color`, `align`, `wrap`; each `Text` child is one styled run, see [RichText](/components/richtext/) |
| `Markdown` | no (built from the source) | `text`; the document becomes ordinary elements, see [Markdown](/components/markdown/) |
| `ChartSeries` | no | inside a chart: `label`, `values` (comma-separated numbers), `color`; the series becomes the chart's data and leaves the tree, see [LineChart](/components/linechart/#the-data) |

The Material 3 components, the audio and video players, and the seven chart
elements are not repeated here; each has its own page under
[Components](/components/) with the properties it adds.

Every element takes the common set, which includes `shadow`: on `Text` it
shadows the glyphs (CSS `text-shadow`), everywhere else the box (CSS
`box-shadow`). See [Shadows](/guide/shadows/).

`theme` names a colour scheme. `light` and `dark` are built in; the app adds
more with `Window.DefineTheme(theme)`, keyed by `Theme.Name`, and
`ui.NewThemeFromSeed(color, dark)` builds one from a single seed colour. A
design may name a scheme before it is defined; an unknown name falls back to
light and logs a warning once. `app.dark` reports the resolved scheme's
mood, so a custom dark theme still reads as dark in a conditional.

`role` selects a Material 3 type-scale role (`displayLarge` … `labelSmall`) and
sets size, line height and weight together; `fontSize` and `weight` override it.
`fontWeight` is the CSS spelling of `weight`: the keywords `normal` (400), `bold`
(700), and the relative `bolder`/`lighter` that step from the role's weight, or
any number from 100 to 900.

`fontStyle` is `normal` or `italic`. `decoration` takes `underline`, `overline`
and `line-through`, written space-separated so they combine; `none` clears it.
`decorationStyle` picks `solid`, `wavy`, `dotted`, `double` or `dashed`, and
`decorationThickness`/`decorationColor` override the font-derived stroke:

```goi
Text {
	text:            "Wavy warning"
	decoration:      underline overline
	decorationStyle: wavy
	decorationColor: #c62828
}
```

`Wrap` runs children left to right and starts a new run when the next child no
longer fits; `spacing` is both the gap inside a run and the gap between runs.

`Grid` puts children in `columns` equal-width cells. A cell is as wide as the
grid allows, so a child fills it unless it declares its own `width`; each row is
as tall as its tallest child and `spacing` separates both columns and rows.

`Stack` overlays its children, last on top. A child without a declared size
fills the stack, so the first child is often a background. `Positioned` is only
valid as a direct child of `Stack` and anchors itself instead of filling:

```goi
Stack {
	width:      360
	height:     200
	background: #e8def8
	radius:     16

	Positioned {
		left:   16 // top-left corner
		top:    16
		width:  180
		height: 88
	}

	Positioned {
		right:  16 // bottom-right
		bottom: 16

		Chip {
			label: "New"
		}
	}

	Positioned {
		left:   0 // across the top
		right:  0
		top:    0
		height: 48
	}
}
```

`left`, `top`, `right` and `bottom` default to `-1`, meaning auto. An
unanchored horizontal axis follows the Stack's `crossAxisAlign`, and the
vertical one its `mainAxisAlign`. Setting both opposite edges
without a declared `width`/`height` stretches the box between them; an explicit
size wins over the fill. A box with no offsets hugs its child. Positioned
children still count toward a Stack's auto size (their anchored extent), so a
Stack inside a Column does not collapse; give the Stack a size when `right` or
`bottom` should anchor against a larger area. `Positioned` does not clip.

Everything else is a Material 3 component. They are ordinary elements, not a
separate package. Containers take children; the rest are leaves:

`Button`, `IconButton`, `FAB`, `FABMenu`, `ButtonGroup`, `SplitButton`,
`SegmentedButton`, `Chip`, `Badge`, `Checkbox`, `RadioButton`, `Switch`,
`Slider`, `TextField`, `SearchBar`, `Tooltip`, `Card`, `Dialog`, `BottomSheet`,
`SideSheet`, `Popover`, `Divider`, `List`, `ListItem`, `Menu`, `MenuItem`,
`Snackbar`, `TopAppBar`, `NavigationBar`, `NavigationRail`, `NavigationDrawer`,
`NavigationItem`, `Tabs`, `Tab`, `LinearProgress`, `CircularProgress`,
`LoadingIndicator`, `Skeleton`, `DatePicker`, `TimePicker`, `ColorPicker`,
`Carousel`, `Toolbar`, `TextArea`, `Code`, `Markdown`, `Audio`, `Video`, `Map`
with its `Geom`, `Point` and `Path` overlays, `Table` with its `TableColumn`,
`TableRow` and `TableCell` children, and the seven charts (`LineChart`,
`AreaChart`, `BarChart`, `PieChart`, `ScatterChart`, `RadarChart`,
`GaugeChart`), whose `ChartSeries` children carry their data.

They share one vocabulary: `label`, `supporting`, `text`, `placeholder`,
`leadingIcon`, `trailingIcon` (icon names are Material Symbols ligatures such as
`home`), `variant`, `disabled`, `checked`, `selected`, `expanded`, `value`,
`min`, `max`, `step`, `language`, `showCopy`, and `color` where the component
names a foreground of its own (the loading indicator, a button, a text field).
`icon` alone is the element's own glyph, so it stays on `IconButton`, `FAB`,
`FABMenu`, `Switch`, `TableColumn` and `TableCell`; a component with a label
calls the one before it `leadingIcon`. `size` is not part of it: it is the common box
property that sets width and height together. Each kind accepts only the subset
that makes sense for it;
`internal/componentdef` is the single table that the schema and the node tree
both read, so an element can never validate without existing.

The language server completes icon names from the embedded font, so the list is
whatever `Library.IconFace` can draw. A name that starts with a digit (`10k`,
`3d`) needs quotes; every other name is a bare identifier (`leadingIcon: add`).

`Switch` also takes `iconOn` and `iconOff`, which override its `icon` for the
checked and unchecked state. Any of them empty means no glyph in the thumb; a
switch with an icon keeps the larger thumb in both states so the glyph has room,
inset 4dp on every side. The glyph is `Primary` on the checked thumb and the
surface colour (white in the light scheme) on the unchecked one.

`SegmentedButton` segments form a group with their contiguous siblings. By
default the group is multi-select (checkbox): clicking a segment toggles it.
`variant: single` makes it single-select (radio): picking a segment clears the
others, and clicking the selected segment keeps it selected.

`NavigationDrawer` is the panel only; it has no open/closed state of its own.
A modal drawer is a `Stack` with the page first, then a scrim `Rectangle` and a
`Positioned` drawer with `visible: false`; Go flips `SetVisible`, and animates
the drawer's `translateX` from `-width` to 0 so it slides in from the edge.
Select events from a navigation container report the index among its
destinations, so a header, spacer or action inside the same rail does not shift
the page list.

Containers that lay children out (`ButtonGroup`, `Toolbar`, `Carousel`, `Tabs`,
`NavigationBar`, `NavigationRail`, `NavigationDrawer`, `List`, `Menu`, `Card`,
`Dialog`, `BottomSheet`, `SideSheet`, `DatePicker`, `TimePicker`, `FABMenu`,
`Tooltip`) also accept
`spacing`, `gap`, `crossAxisAlign` and `mainAxisAlign`. `gap` is the same cell
as `spacing`, under the name a layout reader expects.

`Positioned` also takes `translateX` and `translateY`, which shift the anchored
box without changing its anchors. They exist for enter/exit animation: `left`
and `top` reserve `-1` for "auto", so a slide off screen animates the translate
instead.

Common to every element: `id`, `width`, `height`, `size`, `minWidth`, `maxWidth`,
`minHeight`, `maxHeight`, `margin`, `marginX`, `marginY`, `padding`, `paddingX`,
`paddingY`, `background`, `borderColor`, `borderThickness`, `borderType`,
`borderXThickness`, `borderYThickness`, `borderTopThickness`,
`borderRightThickness`, `borderBottomThickness`, `borderLeftThickness`,
`borderXColor`, `borderYColor`, `borderTopColor`, `borderRightColor`,
`borderBottomColor`, `borderLeftColor`,
`radius`, `radiusTop`, `radiusRight`, `radiusBottom`, `radiusLeft`,
`radiusTopLeft`, `radiusTopRight`, `radiusBottomRight`, `radiusBottomLeft`,
`ripple`,
`fontFamily`, `shadow`, `visible`, `flex`, `alignSelf`, `scroll`,
`opacity`, `backdropBlur`, `zIndex`, `cursor`, `rotate`, `scale`, `hideScrollbar`,
`autoHideScrollbar`, `scrollbarWidth`, `scrollbarColor`, `scrollShadow`,
`scrollShadowColor`, `scrollSnapType`, `scrollSnapStop`, `scrollSnapAlign`,
`scrollPadding`. `ripple` is the press feedback: unwritten follows the
component's own default, `true` gives a plain element one, `false` takes it away
from a component that has it. `marginTop`,
`marginRight`, `marginBottom`, `marginLeft` and `paddingTop`, `paddingRight`,
`paddingBottom`, `paddingLeft` override one edge and leave the others following
their axis; `marginX`/`marginY` and `paddingX`/`paddingY` set both sides of an
axis, and those follow `margin`/`padding`.
`size` sets width and height together, so a square box is one property; a later
`width` or `height` then moves only the axis it names:

```goi
Rectangle { size: 48 }            // 48 by 48
Rectangle { size: 48 height: 24 } // 48 wide, 24 tall

Column {
	padding:     16
	paddingLeft: 4 // 4 on the left, 16 on the other three sides
}

Column {
	paddingX: 24 // left and right
	paddingY: 8  // top and bottom
}
```

`crossAxisAlign` is one of `start`, `center`, `end`, `stretch`; `mainAxisAlign`
adds `spaceBetween`, `spaceAround` and `spaceEvenly` along the flow. `alignSelf`
uses the four cross-axis values and overrides the parent's `crossAxisAlign` for
one child. `Text` has its own `align` (`start`, `center`, `end`) for the text
inside its box.

`opacity` takes `0` to `1`, or a percentage such as `50%`, and fades the
element with everything under it. `backdropBlur` takes a radius in logical
pixels and blurs what is already painted behind the element, like CSS
`backdrop-filter`; the element's own `background` then tints the result, which
is how a translucent panel reads as frosted glass:

```goi
Column {
	background:   #00000044
	backdropBlur: 6
	radius:       16
}
```

It also takes a gradient of radii, so the blur fades across the box. It is 0 by
default, costs an offscreen pass, and only covers the element's rounded box. `zIndex` restacks an element among its
siblings the way CSS does: a higher value paints later, so it lands on top, and
equal values keep document order. Negative values go under siblings at the
default `0`. It only changes paint order, never layout, so two siblings can
overlap without affecting the flow. `scroll` is on by default for `Column`,
`Row`, `Flex`, `Carousel` and `NavigationRail`, so a page column or a rail scrolls
as soon as its content is taller than the frame; `scroll: false` restores plain
overflow. The scrollbar properties apply to any element that scrolls: `hideScrollbar` removes the bar, `autoHideScrollbar` (default
`true`) shows it only while the pointer is over the area or it scrolled in the
last two seconds, `scrollbarWidth` sets its thickness (4 by default),
`scrollbarColor` its colour, and `scrollShadow` adds a gradient at each edge the
content has scrolled away from, tinted by `scrollShadowColor`. A scrolling element
can also settle on its children: `scrollSnapType`, `scrollSnapStop` and
`scrollPadding` on the container, `scrollSnapAlign` on a child, all documented in
[Scroll snapping](/guide/scrolling/#scroll-snapping). Padding spaces
only the moving content: the bar and the shadows stay against the frame, and
content slides under the padding, so the start padding leaves the view once you
scroll and the end padding appears after the last child at the end.

`cursor` takes any CSS cursor name (`pointer`, `text`, `grab`, `not-allowed`,
`col-resize`, `wait`, `none`, …). A child inherits it until a descendant writes
its own; `auto` restores the framework's shape for that element.

`width` and `height` default to `-1`, meaning automatic. `visible: false`
removes the element from layout, painting and hit-testing entirely; it works on
every element, Material components included, and accepts a responsive value like
any other property (`visible: responsive { base: true md: false }`). From Go,
`SetVisible(false)` on any node does the same at runtime.

## Corners and borders

`radius` rounds all four corners. A side rounds both corners on that side, and a
corner rounds only itself:

```goi
Rectangle {
	radius:           8
	radiusTop:        24 // both top corners
	radiusBottomLeft: 0 // this one corner only
}
```

Specificity runs from the general to the narrow one: `radius`, then
`radiusTop`/`radiusRight`/`radiusBottom`/`radiusLeft`, then
`radiusTopLeft`/`radiusTopRight`/`radiusBottomRight`/`radiusBottomLeft`. A
narrower property wins whatever the order in the file, so the example above is
24 at the top right, 0 at the bottom left, and 8 at the other two. Where two
sides meet, the horizontal one wins: `radiusTop: 24` with `radiusLeft: 4` puts 4
on the top-left corner.

A border works the same way one step down:

```goi
Rectangle {
	borderThickness:    1
	borderColor:        theme.outlineVariant
	borderTopThickness: 2
	borderBottomColor:  theme.primary
}
```

`borderXThickness`/`borderYThickness` override `borderThickness` for both sides
of an axis, and `borderTopThickness`, `borderRightThickness`,
`borderBottomThickness` and `borderLeftThickness` for one side. The matching
`…Color` properties do the same to `borderColor`: `borderXColor`/`borderYColor`
for an axis, then a side. An uneven border is drawn as four
bands, and layout insets content by each side's own width. Four equal sides stay
one rounded shape; an uneven border is rounded only when all four corners share
a radius.

`borderThickness` is `-1` by default, which means "no border of my own": on a
component that keeps the M3 outline it already draws. `borderThickness: 0`
removes that outline, and a thickness with no colour restyles it. `borderType`
picks the stroke: `solid` (the default), `dashed` or `dotted`.

```goi
Card {
	borderThickness: 1
	borderColor: theme.outlineVariant
	borderType:      dashed
}
```

## Fonts

`fontFamily` names a family the app registered with `LoadFont`,
`LoadFontFamily` or `LoadVariableFont`, or the built-in `Roboto`. It inherits
from the nearest ancestor, and an unknown name falls back to Roboto.

```goi
Window {
	fontFamily: "Inter"

	Text {
		text:       "Inter"
	}

	Text {
		text:       "Roboto again"
		fontFamily: "Roboto"
	}
}
```

See [Fonts](/guide/fonts/) for registering files, weights and variable fonts.

## Expressions and percentages

Every property accepts an expression, not just the numeric ones: a color, a
string, a bool or an enum can be conditional too. A reference reads another
element's property by id (`id.property`), so the value follows that element
automatically. Operators are `+ - * / %`, comparisons `== != < <= > >=`, `&& ||
!`, a conditional `cond ? a : b` and parentheses, with the usual precedence.
`%` is modulo between two values, so `if i % 2 == 0` works. A percentage is a
number followed by `%`: `50%` and `50 %` both work. When another value follows
the `%` on the same line (`50 % 2`), it is modulo.
Percentages resolve only for `width`, `height` (against the parent's space) and
`opacity` (against the 0..1 range).

`+` adds two numbers and joins anything else as text, so `bridge.Price *
float64(bridge.Count)` is arithmetic while `"n: " + bridge.Count` is a string.
`-`, `*`, `/` and `%` are numeric only. A type mismatch, division or modulo by
zero, or a reference cycle leaves the property at its previous value instead of
failing the frame.

### Transitions

`transition` names the properties that animate when their value changes:

```goi
Rectangle {
	width:       bridge.isCollapsed ? 200 : 500
	height:      bridge.isCollapsed ? 150 : 400
	background:  conditional {
		bridge.isCollapsed: #411f89ff
		!bridge.isCollapsed: #ff0000ff
	}
	transition: width 500ms, height 500ms, background 1s
}
```

Each entry follows CSS order, and only the property and duration are required:

```goi
transition: width 500ms ease-out 100ms, opacity 300ms linear
```

`<property> <duration> <timing-function> <delay>`

- `duration` and `delay` use `ms` or `s`. A negative delay starts the entry
  partway through, like CSS.
- `timing-function` is `linear`, `ease`, `ease-in`, `ease-out` or
  `ease-in-out`. Without one, the entry uses goi's cubic ease-out.
- Names are the properties on the same element. A comma separates the entries;
  `all 200ms` is the fallback for any property not named explicitly.
- Width and height animate through layout; colours animate through the painter.
  Numbers and colours are the rule, so `padding`, `margin`, `borderThickness`,
  `borderColor`, `radius`, `opacity` and the other box properties can be listed
  too. `rotate`, `scale` and `shadow` are interpolated as well; a shadow list
  with a different layer count fades layers in or out.
- `size` animates both width and height, and `gap` and `spacing` are the same
  cell, so either spelling transitions both.
- The first value is written directly, and later values ease from the current
  one, so an expression or a conditional can drive the change.
- Go setters such as `box.SetWidth(320)` and `box.SetBackground(color)` animate
  too; the transition belongs to the property, not to the source of the value.
- A property without a transition changes at once, as before.

The full guide, with timing functions, delays and examples, is
[Transitions](/guide/transitions/).

### formatf

`formatf` builds a string with Go's `fmt` verbs:

```goi
Text {
	text: formatf("Count is %d", bridge.Count)
}

Text {
	text: formatf("%s: %0.2f", bridge.Error, bridge.Count)
}
```

The first argument is the format string; every later argument fills one verb.
Because a design number is a `float64`, `%d` converts it to an integer and
`%0.2f` keeps it floating, so both spellings work on the same value. `%v` prints
any value as Go would, and a color prints as `#rrggbb`.

A `formatf` result is a string, so it feeds `text`, a `string` prop, a `label` or
an enum-or-string position; feeding a `number` property is an error. It is
re-evaluated on every frame, exactly like any other expression, so a
`ui.SetData` write reaches the text without extra wiring.

### t

`t` reads a translation from the design's `i18n` folder; see
[Translations](/guide/i18n/):

```goi
Text {
	text: t("welcome_message")
}

Text {
	text: t("settings.theme")
}

Text {
	text: t("welcome_with_name", "Kaan")
}
```

A nested key uses dots. Later arguments fill the entry's `fmt` verbs exactly
like `formatf`. A missing key falls back to the fallback language, then to the
key itself, and the i18n folder is optional: without it every call shows its
key.

### Builtins

Go's pure builtins are available in a value:

| Call | Result |
|---|---|
| `formatf(pattern, …)` | a string built with Go's `fmt` verbs |
| `t(key, …)` | a translation from the `i18n` catalogs |
| `len(x)` | the length of a string, a list or a map, or a slot's element count (`len($children)`) |
| `cap(x)` | a list's capacity; a design list has no spare capacity, so this is its length |
| `min(a, b, …)` | the smallest number or string |
| `max(a, b, …)` | the largest number or string |

`len` and `cap` are the one place a list is a value: everywhere else a list is
walked with `for`. Inside a fragment, `len($slot)` is how many elements the
instance passed to that slot, which is what an empty slot is tested with.

The builtins that allocate, mutate or touch the process have no meaning in a
value that is re-read every frame, so `append`, `make`, `new`,
`copy`, `delete`, `clear`, `close`, `panic`, `recover`, `print`, `println`,
`complex`, `real` and `imag` are rejected with a message that names what a value
may call.

```goi
Text {
	text: formatf("%d of %d", len(bridge.Tickets), bridge.Count)
}

Rectangle {
	width: max(120, min(window.width / 3, 480))
}
```

## Responsive values

`responsive` picks a value from the window width. Breakpoints are min-widths in
logical pixels: `base`, `sm` (640), `md` (768), `lg` (1024) and `xl` (1280). The
largest minimum not above the width wins; `base` is optional.

```goi
Column {
	padding: responsive {
		base: 8
		md:   16
	}
}
```

A one-line block is accepted too, and the older brace map still parses:
`padding: responsive { base: 8 md: 16 }`. See [Responsive](/guide/responsive/).

## Conditional values

`conditional` picks the first true arm, with an optional `default`:

```goi
Column {
	gap: conditional {
		!bridge.isWide: 10
		bridge.isWide:  20
		default:        4
	}
}
```

Without a matching arm or a default, the property returns to its own declared
value. See [Conditional](/guide/conditionals/#choosing-between-more-than-two-values).

## State values

`state` picks a value from interaction and control state: `default`, `hover`,
`active`, `focus`, `disabled`, `enabled`, `checked`, `unchecked`, `selected`,
`expanded` or `collapsed`. The last matching entry wins. `default` is optional:
without it the property keeps its normal value when no state matches, including
a component's variant colour and an auto size's laid-out width or height. Every
property except `id` takes the block, `rotate`, `scale` and `shadow` included.

```goi
Column {
	background: state {
		default: theme.surfaceContainer
		hover:   theme.surfaceContainerHigh
		active:  theme.primaryContainer
	}
}
```

`responsive`, `conditional` and `state` nest in any order. See
[State](/guide/states/) for the table and the built-in component behaviour.

## Formatting

`goifmt` formats a design the way gofmt formats Go. `goi setup` installs it,
and the language server formats on save.

```sh
goifmt -w assets/ui/        # rewrite every .goi under a directory
goifmt -l .          # list the files that would change
goifmt -d file.goi   # print a diff
```

The layout is fixed, and running it twice changes nothing:

- An import keeps the spelling the design chose, named or unnamed and relative
  or `goi://`, and the imports are followed by one blank line, then each of
  `props`, `bridge` and every `type` block separated by one blank line.
- A declaration's names and types line up in one column, the way gofmt aligns a
  struct:

  ```goi
  props {
 	Title    string
 	LongName int
  }
  ```

- An element body holds one property per line, with the values in one column:

  ```goi
  Column {
 	gap:     10
 	padding: 10

 	Text {
		text: "example"
 	}

 	Text {}
  }
  ```

- A property run and the children after it are separated by one blank line, and
  so are two children. The closing brace follows the last member with no blank
  line before it.
- An element with no members is one token: `Text {}`.
- A comment stays cuddled to what it explains — the line above a declaration, a
  property or a child — and a comment written after a member stays on its line.
- `if`, `else if`, `else` and `for` bodies are indented one level, and so is the
  body of every element and fragment call.
- Extra blank lines collapse to one.

A file that does not parse is left exactly as it is, so saving a design
mid-typing never reflows it.

## Rules and diagnostics

- Exactly one root element. A design the app loads with `LoadWindow` must be a
  `Window`; a fragment pulled in with `import` declares `props` and may root at
  any element.
- `id` must match `[a-z][A-Za-z0-9_]*` (or `a.b`, which is what an instance
  gives a fragment's ids) and be unique within the file.
- `Positioned` must be a direct child of `Stack`.
- Unknown element, unknown property, wrong literal type, unknown enum value,
  unknown or repeated breakpoint, nested modifier, responsive `id` and duplicate ids
  are errors, each reported with `file:line:col`, the offending line and a
  caret. A small edit distance adds a "did you mean" hint. A handler call is
  checked the same way: the name must be declared in `bridge`, and the argument
  count, argument types and `event` payload must match the declaration.
- The parser recovers, so one typo does not hide the rest of the file.
- Elements, blocks, switch arms and values may nest up to 1000 levels. A file
  past that gets a `nested too deeply` diagnostic instead of exhausting the
  parser's stack; real designs stay far below the limit.

## What is not supported

No bindings and no handler bodies — a design declares a handler's name and
parameters, but the body is always Go. A list from Go is a `bridge` variable the
app sets with `ui.SetData`.

Theming is not part of the language: `theme` names a scheme and every colour a
component draws comes from it. See [Theming](/guide/theming/) for the built-in
schemes, `Window.DefineTheme` and seed colours.
