# .goi syntax

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
			icon:  add
		}
	}
}
```

## Splitting a design across files

A file may start with its `import` lines, one `props` block and its
declarations, before its root element. An import names the alias first, the way
Go writes it:

```goi
import Sidebar "./Sidebar.goi"

Window {
	Sidebar {}
}
```

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

### Passing children into a fragment

A fragment can take children, not just values. It marks where they go with
`$children`, and an instance puts its own child elements there:

```goi
// Card.goi

Column {
	gap: 5

	$children {}
}
```

```goi
// Main.goi

import Card "./Card.goi"

Window {
	Card {
		width: 300

		Text {
			text: "selam"
		}

		Button {
			label: "Tamam"
		}
	}
}
```

- `$children` is a slot, not an element: it takes no properties, and
  `$children {}` means the same as `$children`. A slot is written once; a second
  `$children` is an error, because the same children cannot live in two places,
  and a child with an `id` would be declared twice.
- A slot with content inside it is an error in the fragment body, because that
  content would belong to nobody; content is what an instance passes as
  `$children { … }`.
- Children may be anything, including other fragments. They resolve their
  imports in the **file they were written in**, so a child can use an alias that
  only `Main.goi` imports.
- Passing children to a fragment that has no `$children` is an error, reported
  where the children were written. A fragment with a slot but no children just
  draws nothing there, so it can still be previewed on its own.
- A slot may sit anywhere in the fragment body, including inside a block arm.
  Inside a nested fragment call, a bare slot forwards this fragment's children
  to that call; a `$name { … }` there is that call's own argument and is left
  alone.
- A `Window` cannot declare a slot: the file a program loads has no caller to
  fill it.
- Like a file with props, a file with a slot is a fragment: `goicheck` and the
  language server do not require it to be a `Window`.

### Named slots

A fragment can take more than one group of children, one per slot. Any
`$name` in member position is a slot; `$children` is the unnamed one that
plain children go to:

```goi
// Card.goi

Column {
	$header {}

	$children {}

	$footer {}
}
```

```goi
// Main.goi

Card {
	$header {
		Text {
			text: "Inbox"
		}
	}

	Text {
		text: "The body" // goes to $children
	}

	$footer {
		Button {
			label: "OK"
		}
	}
}
```

- A bare `$header`, or `$header {}`, in a fragment body is a slot marker;
  `$header { … }` in an instance call passes the elements that land there.
- A slot fill carries elements only; a property on it is an error rather than
  being ignored, and a bare `$name` at a call (no braces) passes nothing, so it is
  an error outside a fragment, where it forwards instead.
- A slot is written once per fragment.
- Passing a slot the fragment does not declare is an error, reported in the
  caller. An empty `$header { }` still counts as filling the slot.
- As with `$children`, a slot with nothing passed draws nothing, so the fragment
  previews on its own.

### Ids and instances

An instance that sets `id` namespaces every id inside the fragment, so one
fragment can be used any number of times and each copy still carries its own
behaviour:

```goi
Column {
	Card {
		id: first
	}

	Card {
		id: second
	}
}
```

`Card.goi`'s `Text { id: title }` is `first.title` in the first copy and
`second.title` in the second, and `ui.ByID[*ui.Text](w, "first.title")` finds
them. References inside the fragment follow the instance, so `side.width` still
points at that copy's own `side`. Ids written in the caller — its own children,
including the ones it passes to a slot — are not scoped, because they belong to
the caller. An instance without an `id` scopes nothing, so two such instances
still collide.

An id in a `for` row is scoped too, so `ui.Descendant` needs the prefixed name
inside a scoped instance.

A design reads another node by its id, the same way it reads `window.width`:
`width: panel.width`. The id must be declared in the same file, and the
reference reads the property at the time the value is evaluated.

The language server knows these ids: typing a value offers them, `panel.` lists
the element's properties, hover explains either half, and go-to-definition jumps
to the `id:` that declares the name.

### Conditional blocks

`if` picks one arm of elements, written the way Go writes it. The condition is an
ordinary expression and must be a bool; every arm is built when the window loads
and only the matching one is shown, so a block costs no layout for the arm it
hides.

```goi
Window {
	Column {
		if app.dark {
			Text {
				text: "Dark"
			}
		} else if window.width > 900 {
			Text {
				text: "Wide"
			}
		} else {
			Text {
				text: "Light"
			}
		}
	}
}
```

- Conditions may read `app.theme`, `app.dark`, `app.os`, `app.language`,
  `app.systemLanguage`,
  `window.width`, `window.height`, the `window.*` state flags, `bridge.*`,
  `props.*` and any `id.prop` that is a bool, and combine them with comparisons,
  `&&`, `||`, `!` and `?:`. The reserved names and every member they expose are
  listed in [Reserved names](guide/reserved.md).
- An arm holds elements and blocks only. An `if` inside a `Text` is an error,
  because a leaf has no children to switch.
- Blocks nest: an inner `if` shows only where its outer arm also shows.
- A Go-set bool property re-evaluates the condition on the next frame, so
  `id.checked` is a fully reactive condition without any extra wiring.
- Ids inside arms are registered like any other id, so two arms cannot declare
  the same one.
- An `if` inside a `for` body sees the loop variables.

### Switch blocks

`switch` shows the first arm holding a value equal to its subject, written the
way Go writes it. Cases take a comma-separated list, and `default` shows when
none matches; like `if`, every arm is built when the window loads and only the
matching one is shown.

```goi
Column {
	switch bridge.Error {
	case "not found":
		Text {
			text: "Missing"
		}
	case "denied":
		Text {
			text: "No access"
		}
	default:
		Text {
			text: "Something else"
		}
	}
}
```

- The subject is an ordinary expression, so `switch app.dark ? "dark" : "light"`
  works; string, number, bool and colour values compare.
- A switch has at most one `default`, and an arm holds elements and blocks only.
- It nests inside `if` and `for` bodies, and an inner block sees the loop
  variables.

### Loops

`for` repeats a body with Go's range rules:

```goi
Column {
	for i, ticket := range bridge.Tickets {
		if ticket.Unread {
			Text {
				text: formatf("%d. %s", i + 1, ticket.Title)
			}
		}
	}
}
```

- A slice gives the index and the element (`for i, row := range bridge.rows`).
- A map gives the key and the value, in sorted key order so a frame is stable.
- A number counts from zero: `for i := range 5`, or `for range 5` when the index
  is not needed.
- The count may be an expression or a number from the bridge:
  `for i := range len(bridge.rows)`, `for i := range 2 * bridge.columns` and
  `for i := range bridge.count` all work.
- `for range list` is legal when neither name is needed, and `_` ignores one:
  `for _, row := range bridge.rows`.
- A single name binds the key, as in Go: `for i := range bridge.rows`.
- Rows are rebuilt when the list is set with `ui.SetData`, and they keep their
  ids on the nodes rather than registering them, so two rows do not collide.

### Declarations: values and handlers

A design declares the values it reads and the handlers it calls in one `bridge`
block. `data { ... }` is the original spelling and still works; `type` and
`data <Name>` work alike for a row type. Declarations are written like Go fields:
`Name Type`, with no colon and no default.

```goi
bridge {
	Loading  bool
	Error    string
	Count    int
	Tickets  []Ticket
	OnOpen   func(id string)
	OnFilter func(query string, limit uint)
}

// The shape of one row. A list names the type it holds.
type Ticket {
	ID        string
	Title     string
	Requester string
	Unread    bool
}
```

```goi
Window {
	Column {
		if bridge.Loading {
			Text {
				text: "Loading…"
			}
		} else {
			Text {
				text: formatf("%d tickets", bridge.Count)
			}

			for _, ticket := range bridge.Tickets {
				ListItem {
					label:      ticket.Title
					supporting: ticket.Requester
					selected:   ticket.Unread
					onClick:    bridge.OnOpen(ticket.ID)
				}
			}
		}
	}
}
```

Go supplies the values and the handler bodies:

```go
ui.SetData(w, "Loading", true)
ui.SetData(w, "Count", 3)
ui.SetData(w, "Tickets", items)          // any slice
ui.SetHandler(w, "OnOpen", func(id string) { open(id) })
```

`ui.SetHandler` belongs in `Bind`, which runs again after every hot reload, so
re-registering there is enough. A handler is any Go function; its parameters are
converted from the design's values: a number may feed any Go numeric type, a
bool and a color may feed a `string` (as `true`/`false` and `#rrggbb`).

- **Types.** Every primitive Go has is accepted: `bool`, `string`, `int`,
  `int8`…`int64`, `uint`…`uint64`, `uintptr`, `float32`, `float64`, `byte`,
  `rune`, plus `color` for an M3 colour. A list is `[]T`, a map is `map[K]V`
  (the key is a string), and a handler is `func(a string)`.
- **Zero values.** A variable the app never sets reads its type's zero value:
  `""`, `0`, `false`, transparent black, an empty list or map. No declaration
  takes a default; Go is the only place a value starts.
- **Handlers.** `OnOpen func(id string)` declares a handler with its parameters;
  `func()` takes none. A handler is never a value: it can only be called in an
  event property.
- **Calls.** `bridge.OnOpen(ticket.ID)` is the whole value of an event property.
  It is not an expression: you cannot use it inside `+`, a comparison or a
  non-event property.
- **Fire time.** Arguments are evaluated when the event fires, not every frame,
  so `ticket.ID` is the row that exists at click time.
- **`event`.** The event's own payload is available as `event`: `onToggle`
  passes a bool, `onChange` a number, `onEdit`, `onSubmit`, `onOK` and
  `onCancel` a string, `onSelect` an index. `onClick` and the gestures carry no
  scalar value.
- **Events.** Every element accepts `onClick`. Components also accept
  `onToggle`, `onChange`, `onEdit`, `onSubmit`, `onSelect`, `onPlay`, `onPause`
  and `onEnd` where they emit them; a chart adds `onHover` for the point under
  the pointer, a `TimePicker` adds `onOK` and `onCancel`, and a
  `GestureDetector` adds `onDoubleTap`, `onLongPress` and the three pan events.
  The value is always a handler call — `bridge.Name(...)` in a design,
  `props.Name(...)` inside the fragment that declares it; a literal is
  rejected.
- **A call on an id.** An event may drive an element directly instead of going
  through Go: `onClick: spin.pause()`. An `Image` or `SVG` answers `play()`,
  `pause()` and `stop()`. `Audio` and `Video` answer the same three plus
  `seek(seconds)`, `volume(level)`, `audioTrack(index)`, `fullscreen()` and
  `windowed()`; `Switch` answers `toggle()`. Anything else is a checker error,
  and so is an argument of the wrong type.
- **Any file may declare them.** A fragment owns its own `bridge { ... }` block
  and the types its loops walk; the declarations merge into the one design the
  app sees, so `ui.SetData(w, "Rows", …)` feeds a list a fragment drew.
- **Go values.** `ui.SetData` takes a slice of structs — a field is matched by its
  `goi` tag, then by the field name with a lower first letter. An **unexported
  field is ignored**, and so is a field tagged `goi:"-"`. A slice of
  `map[string]any` works too. Numbers are converted, so an `int` field reads in
  a `number` position. A `nil` slice is an empty list, which is what the first
  frame has before the fetch returns.

```go
type User struct {
    ID        string `goi:"id"`
    FullName  string `goi:"fullName"`
    Points    []int  `goi:"points"`
    private   bool   // ignored: unexported
    Ignored   string `goi:"-"` // ignored: the tag says so
}
```

- **Rebuilding.** A list variable rebuilds only the loops that walk it, and only
  when it is set. A scalar keeps its nodes and just re-reads the value, which is
  why `if bridge.Loading` costs one visibility toggle.
- **Row ids** are not registered, exactly like an `ui.Instantiate` copy, because
  every row would otherwise collide: reach a part of a row with `ui.Descendant`.
- **Hooks.** `ui.OnEach` runs for every row the loop builds, including rebuilt
  ones, and gets the item the row was built from. It must be safe to call twice.
- **Validation.** `goicheck` and the language server check the declarations, the
  value a loop walks, every `row.Field` against its type, the type a field feeds,
  and every handler call: the name, the argument count, the argument types and
  the `event` payload.
- **Runtime errors.** Calling a handler that Go never registered, or passing it
  arguments it cannot accept, is reported through the app's error hook instead
  of killing the frame.
- `ui.Fill` and `template: true` remain for a list built by hand — inserting one
  row, or a container that is not a `.goi` block.

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
Term       = Unary { ("*" | "/") Unary }
Unary      = ("!" | "-") Unary | Factor
Factor     = Number | Number "%" | String | Bool | Color | Ident
           | Ident "." Ident | "(" Expression ")"
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
| `"linear-gradient(90deg, red, blue 60%)"` | color | CSS gradient fill; `background` only, see [Colours and gradients](#colours-and-gradients) |
| `theme.surfaceContainerHigh` | color role | a theme name, so it follows light/dark; any role in the M3 scheme |
| `customColor.myBrand` | custom color | a name the app defines with `ui.SetCustomColor`; an undefined one warns and falls back to `onSurface` |
| `90deg`, `x 90deg`, `1 1 1 90deg` | rotate | the `rotate` property only: CSS form, see [Rotate](#rotate) |
| `2 2 5 #000000 inset` | shadow | the `shadow` property only: CSS form, a colour variable as `theme.<role>` or `customColor.<name>`; `none` clears it, see [Shadows](guide/shadows.md) |
| `responsive { base: 8 md: 16 }` | modifier | responsive value, one entry per breakpoint; see [Responsive values](#responsive-values) |
| `conditional { 10: bridge.isWide }` | modifier | first true condition picks the value; see [Conditional values](#conditional-values) |
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

A colour list is the one place a role *must* carry its namespace. A bare word in
a list is read as a CSS colour name (`red`, `rebeccapurple`), so `primary` is a
diagnostic that names the form to write: `theme.primary`. Everywhere else a
colour property accepts the bare spelling too, because a single value leaves no
room for doubt; in a list it would.

## Colours and gradients

A colour has four forms: a theme role (`theme.primary`), a CSS literal (a name,
a function or a hex value), or an app-defined name (`customColor.brand`). The
first follows light and dark; the rest are fixed.

A colour is written the way CSS writes it. A role follows the scheme; a literal
does not:

```goi
Column {
	Text {
		text:  "named"
		color: white
	}

	Text {
		text:  "quoted"
		color: "red"
	}

	Text {
		text:  "rgb"
		color: "rgb(42, 123, 155)"
	}

	Text {
		text:  "hsl"
		color: "hsl(200 40% 50%)"
	}

	Text {
		text:  "role"
		color: theme.primary
	}
}
```

The checker accepts the full CSS list: the 148 names (`white`, `black`,
`rebeccapurple`, `darkslategray`, …), `rgb()`/`rgba()` in both the comma and the
`/ alpha` spelling, `hsl()`/`hsla()`, and every hex form. A name the Material
scheme already owns (`primary`, `onSurface`) is still a role, so the theme wins;
a CSS keyword such as `white` is a literal and stays white in either scheme.

A gradient is a colour value, and it fills a box, so `background` is where it
goes:

```goi
Column {
	background: "linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)"
}

Column {
	background: "radial-gradient(circle, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)"
}
```

- `linear-gradient(angle, stops…)`: the angle is in degrees, `0deg` pointing up
  and `90deg` right, as in CSS. Direction words work too: `to right`,
  `to bottom left`. The default is `to bottom`.
- `radial-gradient(size, stops…)`: the shape goes out from the box's centre to
  its farthest corner. `circle`, `ellipse` and `closest-side` are accepted and the
  element's own box is the circle.
- Every stop may carry a position (`0%`, `50%`, `100%`, or a `0`–`1` number). A
  stop without one is spread evenly between its neighbours, and the ends default
  to 0% and 100%.
- The box keeps its `radius` and its border, which are drawn on top of the fill.
- A stop may be a colour variable: `theme.primary` or `customColor.brand`. It
  follows the scheme and `SetCustomColor`, so one gradient can mix a role with a
  literal.
- A gradient is a whole value: write it quoted, since the commas inside belong to
  the gradient, not to `.goi`.
- Only `background` takes one. A gradient on `color` or `borderColor` is a checker
  error rather than a silently empty fill, because a gradient is a box, not a
  stroke or a glyph colour.

## Rotate

`rotate` is CSS `rotate`: it turns the element and everything under it about the
element's own centre. Layout ignores it, so the box keeps its place and its
siblings do not move.

```goi
Column {
	rotate: none // the default
}

Column {
	rotate: 90deg // an angle alone turns about the z axis
}

Column {
	rotate: x 90deg // about the x axis
}

Column {
	rotate: 1 1 1 90deg // about a vector
}
```

An angle may be written as `deg`, `rad`, `turn` or `grad`; they are the same
value and goifmt writes it back in degrees (`0.25turn` is `90deg`, `1.57rad` is
`89.95437deg`).

- The keyword `none` clears it.
- A turn about a non-z axis is a three-dimensional rotation. The renderer is
  two-dimensional, so only the z axis (the angle-only and `z` forms) shows as a
  turn; an x, y or vector rotation is stored but not projected.
- Nested rotations compose: an inner 45° inside an outer 90° turns 135°, and the
  inner pivot follows the outer frame.

## Elements

| Element | Children | Properties beyond the common set |
|---|---|---|
| `Window` | yes | `title`, `theme` (`light`, `dark`, or a name the app registered), `titleBar` (`system`, `custom`), `resizable`, `minimizable`, `maximizable`, `minimized`, `maximized`, `fullscreen` (all bool; `disableResize` is the older inverse of `resizable`) |
| `Column` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `Row` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `TitleBar` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign`; a press that misses its clickable children moves the window |
| `Stack` | yes | `crossAxisAlign`, `mainAxisAlign` |
| `ClipRRect` | yes | `crossAxisAlign`, `mainAxisAlign`; clips its children to its rounded box |
| `GestureDetector` | yes | `onDoubleTap`, `onLongPress`, `onPanStart`, `onPanUpdate`, `onPanEnd`; lays children out like a `Stack` |
| `Positioned` | yes | `left`, `top`, `right`, `bottom`, `translateX`, `translateY` |
| `Wrap` | yes | `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `Grid` | yes | `columns`, `variant` (`normal`, `masonry`), `spacing` (`gap`), `crossAxisAlign`, `mainAxisAlign` |
| `AspectRatio` | yes | `aspectRatio` (width / height); the parent gives the width and the height follows, or the height in a row and the width follows |
| `Rectangle` | no | — |
| `Image` | no | `src` (`goi://` container, a machine path, or an `http(s)` URL), `fit` (`cover`, `contain`, `fill`), plus `radius` |
| `SVG` | no | `src` (same three forms), `fit` (`contain`, `cover`, `fill`), `color` (replaces the document's `currentColor`) |
| `Text` | no | `text`, `fontSize`, `weight`, `fontWeight`, `fontStyle`, `decoration`, `decorationStyle`, `decorationThickness`, `decorationColor`, `color`, `align`, `wrap`, `role`, `selectable`, `link` |
| `RichText` | yes (`Text` runs) | `text`, `role`, `fontSize`, `color`, `align`, `wrap`; each `Text` child is one styled run, see [RichText](components/richtext.md) |
| `Markdown` | no (built from the source) | `text`; the document becomes ordinary elements, see [Markdown](components/markdown.md) |
| `ChartSeries` | no | inside a chart: `label`, `values` (comma-separated numbers), `color`; the series becomes the chart's data and leaves the tree, see [LineChart](components/linechart.md#the-data) |

Every element takes the common set, which includes `shadow`: on `Text` it
shadows the glyphs (CSS `text-shadow`), everywhere else the box (CSS
`box-shadow`). See [Shadows](guide/shadows.md).

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
`SideSheet`, `Divider`, `List`, `ListItem`, `Menu`, `MenuItem`, `Snackbar`,
`TopAppBar`, `NavigationBar`, `NavigationRail`, `NavigationDrawer`,
`NavigationItem`, `Tabs`, `Tab`, `LinearProgress`, `CircularProgress`,
`LoadingIndicator`, `DatePicker`, `TimePicker`, `Carousel`, `Toolbar`,
`TextArea`, `Code`, `Audio`, `Video`, and the seven charts (`LineChart`,
`AreaChart`, `BarChart`, `PieChart`, `ScatterChart`, `RadarChart`,
`GaugeChart`), whose `ChartSeries` children carry their data.

They share one vocabulary: `label`, `supporting`, `text`, `placeholder`, `icon`,
`trailingIcon` (icon names are Material Symbols ligatures such as `home`),
`variant`, `disabled`, `checked`, `selected`, `expanded`, `value`, `min`, `max`,
`step`, `language`, `showCopy`, and `color` where the component names a
foreground of its own (the loading indicator, a button, a text field). `size` is not part of it: it is the common box
property that sets width and height together. Each kind accepts only the subset
that makes sense for it;
`internal/componentdef` is the single table that the schema and the node tree
both read, so an element can never validate without existing.

The language server completes icon names from the embedded font, so the list is
whatever `Library.IconFace` can draw. A name that starts with a digit (`10k`,
`3d`) needs quotes; every other name is a bare identifier (`icon: add`).

`Switch` also takes `iconOn` and `iconOff`, which override `icon` for the
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
`minHeight`, `maxHeight`, `margin`, `padding`, `paddingX`, `paddingY`,
`background`, `borderColor`, `borderWidth`, `borderTopWidth`,
`borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`,
`borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor`,
`radius`, `fontFamily`, `shadow`, `visible`, `flex`, `alignSelf`, `scroll`,
`opacity`, `backdropBlur`, `zIndex`, `cursor`, `rotate`, `hideScrollbar`,
`autoHideScrollbar`, `scrollbarWidth`, `scrollbarColor`, `scrollShadow`,
`scrollShadowColor`, `template`. `marginTop`,
`marginRight`, `marginBottom`, `marginLeft` and `paddingTop`, `paddingRight`,
`paddingBottom`, `paddingLeft` override one edge and leave the others following
`margin`/`padding`; `paddingX` and `paddingY` set both sides of their axis.
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

It is 0 by default, costs an offscreen pass, and only covers the element's
rounded box. `zIndex` restacks an element among its
siblings the way CSS does: a higher value paints later, so it lands on top, and
equal values keep document order. Negative values go under siblings at the
default `0`. It only changes paint order, never layout, so two siblings can
overlap without affecting the flow. The scrollbar properties apply to any element
that scrolls: `hideScrollbar` removes the bar, `autoHideScrollbar` (default
`true`) shows it only while the pointer is over the area or it scrolled in the
last two seconds, `scrollbarWidth` sets its thickness (4 by default),
`scrollbarColor` its colour, and `scrollShadow` adds a gradient at each edge the
content has scrolled away from, tinted by `scrollShadowColor`. Padding spaces
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
	borderWidth:       1
	borderColor:       outlineVariant
	borderTopWidth:    2
	borderBottomColor: primary
}
```

`borderTopWidth`, `borderRightWidth`, `borderBottomWidth` and
`borderLeftWidth` override `borderWidth` for one side, and the matching
`…Color` properties override `borderColor`. An uneven border is drawn as four
bands, and layout insets content by each side's own width. Four equal sides stay
one rounded shape; an uneven border is rounded only when all four corners share
a radius.

## Fonts

`fontFamily` names a family the app registered with `App.LoadFont`; an element
without one inherits its nearest ancestor's, and the window is the last place it
can come from:

```goi
Window {
	fontFamily: "Inter"

	Column {
		Text {
			text: "Inter, from the window"
		}

		Text {
			text:       "Roboto again"
			fontFamily: "Roboto"
		}
	}
}
```

A name nobody registered falls back to Roboto, so a design is still readable
when the app forgot the font. [Fonts](guide/fonts.md) covers the Go side.

## Expressions and percentages

Every property accepts an expression, not just the numeric ones: a color, a
string, a bool or an enum can be conditional too. A reference reads another
element's property by id (`id.property`), so the value follows that element
automatically. Operators are `+ - * /`, comparisons `== != < <= > >=`, `&& ||
!`, a conditional `cond ? a : b` and parentheses, with the usual precedence.
Percentages resolve only for `width`, `height` (against the parent's space) and
`opacity` (against the 0..1 range).

`+` adds two numbers and joins anything else as text, so `bridge.Price *
float64(bridge.Count)` is arithmetic while `"n: " + bridge.Count` is a string.
`-`, `*` and `/` are numeric only. A type mismatch, division by zero or a reference cycle
leaves the property at its previous value instead of failing the frame.

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
[Translations](guide/i18n.md):

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
| `len(x)` | the length of a string, a list or a map |
| `cap(x)` | a list's capacity; a design list has no spare capacity, so this is its length |
| `min(a, b, …)` | the smallest number or string |
| `max(a, b, …)` | the largest number or string |

`len` and `cap` are the one place a list is a value: everywhere else a list is
walked with `for`. The builtins that allocate, mutate or touch the process have
no meaning in a value that is re-read every frame, so `append`, `make`, `new`,
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

A property can follow the window width with the `responsive` modifier:

```goi
Column {
	padding: responsive {
		base: 8
		md: 16
	}

	Grid {
		columns: responsive {
			base: 1
			md: 2
			lg: 3
		}

		Card {
			label: "One"
		}

		Card {
			label: "Two"
		}
	}
}
```

A one-line block is accepted too: `padding: responsive { base: 8 md: 16 }`.
The entries need no commas. `goifmt` rewrites a block to the multi-line form,
one breakpoint per line.

Breakpoints are min-widths in logical pixels, like Tailwind. The entry with the
largest minimum that is not above the window width wins.

| Tier | Applies from |
|---|---|
| `base` | 0 |
| `sm` | 640 |
| `md` | 768 |
| `lg` | 1024 |
| `xl` | 1280 |

The block above is therefore 1 column below 768, 2 from 768 and 3 from 1024.
The `base` entry, when present, is applied as soon as the file is loaded, so it
also sizes the initial window when used on `Window.width`.

`base` is optional. Without it the property keeps its normal default below the
lowest tier that is present. `id` cannot be responsive and a tier cannot contain
another modifier.

The tree stores the tiers; the frame loop rewrites those properties before
layout whenever the window width changes. The file owns a responsive property: a
value set from Go with `Prop.Set` is replaced on the next frame.

`responsive { … }` is the spelling to write. The older brace map
`padding: { base: 8, md: 16 }` still parses, so an existing design keeps
working; `goifmt` converts it to the modifier form.

## Conditional values

`conditional` picks the first value whose condition is true, and ignores the
ones after it:

```goi
Column {
	gap: conditional {
		10: !bridge.isWide
		20: bridge.isWide
	}
}
```

Each line is `value: condition`, and the condition is any bool expression:
a bridge field, a property reference, a comparison. A `for … range` row can use
the loop variable the same way:

```goi
for i, l := range team.lastFiveResults {
	Text {
		text: conditional {
			"✅": l == "W"
			"🏁": l == "D"
			"❌": l == "L"
		}
	}
}
```

The values are checked against the property, so `gap` takes numbers above and
`text` takes strings. When no condition holds the property keeps the value it
had, the way a `switch` with no matching case changes nothing. Like a
responsive value, a conditional property is re-evaluated every frame, and a
value set from Go is not overwritten.

Nothing nests: a conditional value or a breakpoint value cannot be another
modifier.

## Formatting

`goifmt` formats a design the way gofmt formats Go. It ships two ways: the
`goifmt` command, and the language server, so an editor formats on save.

```sh
go run ./cmd/goifmt -w ui/        # rewrite every .goi under a directory
go run ./cmd/goifmt -l .          # list the files that would change
go run ./cmd/goifmt -d file.goi   # print a diff
```

The layout is fixed, and running it twice changes nothing:

- An import names its alias first, and the imports are followed by one blank
  line, then each of `props`, `bridge` and every `type` block separated by one
  blank line.
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

## What is not supported

No bindings and no handler bodies — a design declares a handler's name and
parameters, but the body is always Go. A list from Go is a `bridge` variable the
app sets; `ui.Fill` covers a list built by hand.

Theming is not part of the language: `theme` names a scheme and every colour a
component draws comes from it. See [Theming](guide/theming.md) for the built-in
schemes, `Window.DefineTheme` and seed colours.
