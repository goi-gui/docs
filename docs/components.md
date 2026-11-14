# Components

Every element the `.goi` format knows, grouped by what it is for. Each name links
to its own page with a `.goi` example, its properties and a Go example.

The framework has three layers: layout primitives (`Column`, `Row`, `Stack`, …),
plain drawing nodes (`Rectangle`, `Image`, `SVG`, `Text`) and the Material 3
components. They all share one property set and one way of being driven from Go.


## Layout and structure

- [Window](components/window.md) — The root of the tree.
- [Column](components/column.md) — Stacks children vertically, top to bottom.
- [Row](components/row.md) — Places children left to right.
- [TitleBar](components/titlebar.md) — A Row that moves the window when dragged.
- [Stack](components/stack.md) — Overlays children on top of each other, last child on top.
- [Positioned](components/positioned.md) — Anchors a child inside a Stack.
- [ClipRRect](components/cliprrect.md) — Cuts its children to a rounded box.
- [GestureDetector](components/gesturedetector.md) — Wraps a child and reports a double tap, a long press and a pan.
- [Wrap](components/wrap.md) — Flows children left to right and starts a new run when the next child does not fit.
- [Grid](components/grid.md) — Places children in equal-width columns, as rows or packed like a pinboard.
- [AspectRatio](components/aspectratio.md) — Sizes its box from a width/height ratio and lets the other axis follow.
- [Divider](components/divider.md) — A one-pixel rule between content.

## Content

What a page shows: text, documents, media and plain boxes. These are nodes rather than Material components, so they take the common box properties and nothing else unless their page says so.

- [Text](components/text.md) — One run of text at a Material 3 type-scale role.
- [RichText](components/richtext.md) — One paragraph of styled runs.
- [Code](components/code.md) — A syntax-highlighted code block.
- [Markdown](components/markdown.md) — A markdown document, rendered as elements.
- [Image](components/image.md) — Draws a decoded bitmap.
- [SVG](components/svg.md) — Draws an SVG file, with `currentColor` set from the design.
- [Rectangle](components/rectangle.md) — A plain colored box.

## Actions

- [Button](components/button.md) — The ordinary Material 3 button.
- [IconButton](components/iconbutton.md) — A square button that holds only an icon.
- [FAB](components/fab.md) — The floating action button: the primary action of a page.
- [FABMenu](components/fabmenu.md) — A FAB that expands into a column of actions.
- [ButtonGroup](components/buttongroup.md) — A row of related buttons that share one shape and one gap.
- [SplitButton](components/splitbutton.md) — A primary action with an attached menu trigger.
- [SegmentedButton](components/segmentedbutton.md) — A horizontal set of segments.
- [Chip](components/chip.md) — A compact, rounded element for filters, inputs, suggestions and tags.
- [Toolbar](components/toolbar.md) — A horizontal strip of compact controls.

## Selection controls

- [Checkbox](components/checkbox.md) — A binary choice with an optional label.
- [RadioButton](components/radiobutton.md) — One option in a set where exactly one is chosen.
- [Switch](components/switch.md) — A single on/off control with an optional label and optional glyph in the thumb.
- [Slider](components/slider.md) — A continuous value control.

## Text input

- [TextField](components/textfield.md) — An editable single-line field with a floating label.
- [SearchBar](components/searchbar.md) — A text field shaped as a search input, with a leading search glyph.
- [TextArea](components/textarea.md) — A multiline text field.

## Containment

- [Card](components/card.md) — A Material 3 surface that groups related content.
- [Dialog](components/dialog.md) — A modal surface for a decision or a short form.
- [BottomSheet](components/bottomsheet.md) — A surface anchored to the bottom edge.
- [SideSheet](components/sidesheet.md) — A surface anchored to a side edge, for settings or detail.
- [List](components/list.md) — A vertical container for `ListItem`s and `MenuItem`s.
- [ListItem](components/listitem.md) — One row in a list: leading icon, label, optional supporting line, trailing affordance.
- [Menu](components/menu.md) — A popup list of `MenuItem`s.
- [MenuItem](components/menuitem.md) — One row in a menu.
- [Snackbar](components/snackbar.md) — A short, transient message at the bottom of the screen.
- [Tooltip](components/tooltip.md) — A hint that wraps the control it explains and floats above it on hover.
- [Table](components/table.md) — A sortable data grid with declared columns and rows, selectable and sortable from a design or from Go.
- [Carousel](components/carousel.md) — A horizontally scrolling row of cards.

## Navigation

- [TopAppBar](components/topappbar.md) — The bar at the top of a screen: a leading icon, a title and a trailing icon.
- [NavigationBar](components/navigationbar.md) — The bottom navigation bar for the compact window class.
- [NavigationRail](components/navigationrail.md) — The side navigation rail for medium and expanded windows.
- [NavigationDrawer](components/navigationdrawer.md) — A modal drawer that lists the same destinations as the rail and bar.
- [NavigationItem](components/navigationitem.md) — One destination in a navigation bar, rail or drawer.
- [Tabs](components/tabs.md) — A tab bar that groups `Tab` children.
- [Tab](components/tab.md) — One tab in a tab bar.

## Status and progress

- [Badge](components/badge.md) — A small count or status dot, usually overlaid on an icon with `Positioned` or `Stack`.
- [LinearProgress](components/linearprogress.md) — A horizontal progress bar.
- [CircularProgress](components/circularprogress.md) — A circular progress ring.
- [LoadingIndicator](components/loadingindicator.md) — The M3 indeterminate loading shape.

## Date and time

- [DatePicker](components/datepicker.md) — A calendar surface for picking a date.
- [TimePicker](components/timepicker.md) — An M3 time picker with a clock dial or two typed fields, a 12-hour display and AM/PM.

## Media

Both play through ffmpeg, which has to be on `PATH`; both can hide their controls and be driven from `.goi` (`clip.play()`) or Go (`app.PlayMedia(clip)`).

- [Audio](components/audio.md) — A sound player with a built-in transport bar.
- [Video](components/video.md) — A video player, decoded with ffmpeg.

## Charts

- [LineChart](components/linechart.md) — A line per series through the points.
- [AreaChart](components/areachart.md) — A line with the space under it filled.
- [BarChart](components/barchart.md) — Grouped, stacked or horizontal bars.
- [PieChart](components/piechart.md) — Slices, or a donut with a hole.
- [ScatterChart](components/scatterchart.md) — One dot per value, no line.
- [RadarChart](components/radarchart.md) — One polygon per series over a spoke per category.
- [GaugeChart](components/gaugechart.md) — One value as an arc, with the number inside.

Every chart takes `ChartSeries` children, so a design holds its own data:
`categories: ["Jan", "Feb"]` names the points and one child per line carries
`label`, `values` and `color`. See
[LineChart's data](components/linechart.md#the-data).

Every chart draws its chrome from
[`grid`](components/linechart.md#properties), `axis`, `legend` and `values`, and
is interactive: hovering shows a tooltip, clicking fires `onSelect` with the
point index. An app whose numbers move replaces the design's data with `SetData`.

A legend is a switch as well as a key: clicking an entry hides that series (or
that slice, on a pie) and clicking it again brings it back. A hidden entry stays
in place, dimmed, and the value scale and the pie's shares follow what is left.
The last visible entry cannot be turned off, so a chart never ends up with
nothing to click.

## Common properties

These apply to every element and are not repeated on the component pages.

| Property | Type | Notes |
|---|---|---|
| `id` | string | assigned by the builder; the handle Go looks up |
| `width, height` | number | declared size; `-1` (default) means auto |
| `size` | number | both axes at once: `size: 32` is a 32 by 32 box, the same as `width: 32 height: 32` |
| `minWidth, maxWidth` | number | bounds for the resolved width; `SetMinWidth`/`SetMaxWidth` from Go |
| `minHeight, maxHeight` | number | bounds for the resolved height; `SetMinHeight`/`SetMaxHeight` from Go |
| `margin` | number | outer spacing on all sides |
| `marginTop`, `marginRight`, `marginBottom`, `marginLeft` | number | per-side override; unset follows `margin` |
| `padding` | number | inner spacing on all sides |
| `paddingX`, `paddingY` | number | left+right, top+bottom; unset follows `padding` |
| `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | number | per-side override; unset follows its axis, then `padding` |
| `background` | color | theme role or `#RRGGBB`; only where the element has no container |
| `borderColor`, `borderWidth` | color, number | outline around the box |
| `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth` | number | per-side override; unset follows `borderWidth` |
| `borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor` | color | per-side override; unset follows `borderColor` |
| `radius` | number | corner radius on all four corners |
| `radiusTop`, `radiusRight`, `radiusBottom`, `radiusLeft` | number | rounds both corners on that side; unset follows `radius` |
| `radiusTopLeft`, `radiusTopRight`, `radiusBottomRight`, `radiusBottomLeft` | number | rounds one corner; unset follows the side, then `radius` |
| `fontFamily` | string | a family the app registered with `app.LoadFont`, inherited by children; see [Fonts](guide/fonts.md) |
| `shadow` | shadow | CSS-style shadow: the box everywhere, the glyphs on `Text`; see [Shadows](guide/shadows.md) |
| `visible` | bool | removes the element from layout, painting and hit-testing |
| `template` | bool | marks a hidden row prototype for `ui.Fill` |
| `flex` | number | share of the parent's leftover main-axis space |
| `alignSelf` | enum | `start`, `center`, `end`, `stretch`; overrides the parent's `crossAxisAlign` |
| `scroll` | bool | scroll when content overflows the box |
| `opacity` | number | 0 to 1, or a percentage such as `50%`; fades the element and its subtree |
| `backdropBlur` | number | radius in dp of the blur applied to what is already painted behind the element, like CSS `backdrop-filter`; 0 (default) is no blur |
| `zIndex` | number | paint order among siblings; a higher value paints on top, layout is unaffected |
| `cursor` | enum | pointer shape, named the way CSS names it: `pointer`, `text`, `move`, `grab`, `not-allowed`, the resize arrows, `wait`, `none`, … |
| `rotate` | rotate | CSS `rotate`: `45deg`, `0.25turn`, `x 90deg`, `1 1 1 90deg`; turns the element and its subtree |
| `hideScrollbar` | bool | removes the scrollbar entirely |
| `autoHideScrollbar` | bool | `true` (default) shows the bar only while the pointer is over the area or it scrolled in the last two seconds; `false` keeps it up |
| `scrollbarWidth` | number | bar thickness in dp; 4 by default |
| `scrollbarColor` | color | bar colour; defaults to the theme's muted onSurfaceVariant |
| `scrollShadow` | bool | fades an edge when there is content scrolled away from it |
| `scrollShadowColor` | color | colour of that edge gradient; defaults to the scheme's shadow colour |

A scrolling element takes a gesture along its own axis only: a notched wheel
scrolls vertically and **Shift + wheel** scrolls a sideways element, while a
touchpad's two-finger swipe needs no modifier and keeps whichever axis the hand
moved. A gesture that reaches the end of a child carries on into the page above
it, so the pointer never looks stuck over a small scroller.

Padding spaces the moving content only. Nothing keeps a fixed inset at any
edge: the scrollbar and the scroll shadows attach to the element's frame, and
content slides under the padding as you scroll. The padding is the gap at the
start (above the first child) and at the end (below the last one), so the end
padding appears only once you scroll all the way there, and the start padding
scrolls away as soon as you leave the top. The scrollbar itself is a draggable
thumb: press it and pull, and the content follows the handle 1:1. `autoHideScrollbar` follows the pointer, and
`scrollShadow` adds a gradient at each edge the content has scrolled away from,
so it is present at the top once the content moves down and at the bottom until
the end is reached:

```goi
Column {
	scroll:            true
	scrollShadow:      true
	hideScrollbar:     false
	autoHideScrollbar: true
	scrollbarWidth:    6
	scrollbarColor:    #6750a4
}
```

`cursor` takes any CSS cursor value, so a draggable card can say `cursor: grab`
and a disabled control `not-allowed`:

```goi
Card {
	cursor: grab
}

Button {
	cursor:   not-allowed
	disabled: true
}
```

A child inherits the nearest declared cursor, and `cursor: auto` asks for the
framework's own shape again (an I-beam over text, a hand over anything
clickable). Hyphenated names are written bare, the way CSS writes them.

Values the platform has no system shape for fall back to the closest one:
`zoom-in`, `zoom-out`, `help`, `copy`, `alias` and `context-menu` show the
arrow, `vertical-text` the I-beam, and `grab`, `grabbing` and `all-scroll` the
move cursor, because SDL has no open hand. `cursor: none` hides the pointer for
a design that draws its own.

`opacity` multiplies the alpha of the element and everything under it. There is
no offscreen pass, so two overlapping children inside a translucent container
still show through each other; for a card or a fading list the difference does
not show.

`backdropBlur` softens what is already painted behind the element, which is how
a translucent panel reads as frosted glass. The element's own `background` then
tints the blurred copy, so a low-alpha fill is usually what you want:

```goi
Column {
	background:   #00000044
	backdropBlur: 6
	radius:       16
}
```

The blur is measured in logical pixels and only covers the element's rounded
box. It costs an offscreen pass, so it is off (0) unless a design asks for it.

`marginTop`, `marginRight`, `marginBottom`, `marginLeft` (and the same four for
`padding`) override one edge and leave the others following `margin`/`padding`.
`paddingX` and `paddingY` set the two horizontal and the two vertical sides at
once, which is the usual way to set a rhythm:

```goi
Column {
	paddingX: 24 // left and right
	paddingY: 8  // top and bottom
	paddingTop: 16 // still wins over paddingY
}
```

Precedence is a single edge, then its axis, then `padding`.

## Containers and `gap`

Containers lay their children out in a row or a column and accept `spacing`,
its alias `gap`, `crossAxisAlign` and `mainAxisAlign`: `ButtonGroup`, `Toolbar`,
`Carousel`, `FABMenu`, `Tabs`, `NavigationBar`, `NavigationRail`,
`NavigationDrawer`, `List`, `Menu`, `Card`, `Dialog`, `BottomSheet`, `SideSheet`,
`DatePicker`, `TimePicker`.

The two axes are the Flutter pair, and they replace the old single `align`:

| Property | Where it acts | Values |
|---|---|---|
| `crossAxisAlign` | across the flow: sideways in a `Column`, up and down in a `Row` | `start`, `center`, `end`, `stretch` |
| `mainAxisAlign` | along the flow, on the leftover space | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly` |

Both default to `start`. A child that is a container still fills the cross axis
of its parent, so a `Column` inside a `Column` is full width; `stretch` forces
that for a leaf too. `mainAxisAlign` only has room to work when the children do
not already fill the axis, and in a `Wrap` it spreads each run; a `Stack` and a
`ClipRRect` overlay one box at a time, so they accept only the four geometric
values. `alignSelf` overrides the parent's `crossAxisAlign` for one child.

## Events

A design declares its handlers in a `bridge` block and calls them from an event
property; Go registers the body with `ui.SetHandler`:

```goi
bridge {
	OnOpen func(id string)
}

Window {
	Button {
		label:   "Open"
		onClick: bridge.OnOpen("42")
	}
}
```

| Design property | Go call | Emitted by |
|---|---|---|
| `onClick: bridge.Handler(...)` | `OnClick(func(ui.ClickEvent))` | every element; `ClickEvent` has `X`, `Y`, `Button` |
| `onToggle: bridge.Handler(event)` | `OnToggle(func(bool))` | Checkbox, RadioButton, Switch, Chip |
| `onChange: bridge.Handler(event)` | `OnChangeValue(func(float64))` | Slider |
| `onEdit: bridge.Handler(event)` | `OnEdit(func(string))` | TextField, SearchBar (every keystroke) |
| `onSubmit: bridge.Handler(event)` | `OnSubmit(func(string))` | TextField, SearchBar (Enter) |
| `onSelect: bridge.Handler(event)` | `OnSelect(func(int))` | Tabs, NavigationBar, NavigationRail, List, Menu, Table, SegmentedButton, Carousel, and every chart (the slice or point) |
| `onHover: bridge.Handler(event)` | `OnHoverPoint(func(int))` | charts: the point under the pointer, -1 when it leaves |
| `onPlay: bridge.Handler(event)` | `OnPlay(func(float64))` | Audio, Video (payload: position in seconds) |
| `onPause: bridge.Handler(event)` | `OnPause(func(float64))` | Audio, Video |
| `onEnd: bridge.Handler(event)` | `OnEnd(func(float64))` | Audio, Video |
| `onCancel: bridge.Handler(event)` | `OnCancel(func(string))` | TimePicker |
| `onDoubleTap: bridge.Handler()` | `OnDoubleTap(func(ui.ClickEvent))` | GestureDetector |
| `onLongPress: bridge.Handler()` | `OnLongPress(func(ui.ClickEvent))` | GestureDetector |
| `onPanStart`, `onPanUpdate`, `onPanEnd` | `OnPanStart/Update/End(func(ui.PanEvent))` | GestureDetector |

The value of an event property is always a handler call. Its arguments are
evaluated when the event fires; `event` is the event's own payload. A fragment
can also declare a handler prop (`props { OnOpen func(id string) }`) and call
it, with the instance deciding which bridge handler that is. See
`syntax.md` for the bridge block, handler types and runtime errors.

## Themes and custom colours

`theme` names a colour scheme: `light` and `dark` are built in, and the app adds
more on the window with `Window.DefineTheme`, either edited by hand or derived
from one seed colour. Every colour a component draws comes from the resolved
scheme, so switching it recolours the whole window.

An app can also name its own colours and use them under `customColor.`; they
resolve on every frame, so setting one again recolours every element that uses
it without a reload.

Both are covered on their own pages: [Theming](guide/theming.md) and
[Custom colours](guide/custom-colors.md).

## Finding elements from Go

```go
btn, err := ui.ByID[*ui.Button](w, "save")   // typed, fails when missing or mistyped
btn := ui.MustByID[*ui.Button](w, "save")    // panics; fine in Bind
node, err := w.ByID("save")                  // untyped

ui.SetHandler(w, "onOpen", func(id string) { open(id) })  // body of a bridge handler
```

`ui.SetHandler` supplies the Go function a `bridge { OnOpen func(id string) }`
declaration calls; register it from `Bind` so a hot reload registers it again.
The design can read a node's property by id as well (`width: panel.width`), which
needs no Go code at all.

A list of unknown length is usually a `for` loop the app feeds with
`ui.SetData`; the row stays in the design and the type it reads is declared, so
`goicheck` and the editor check every field (see [SYNTAX](syntax.md#declarations-values-and-handlers)).

```goi
bridge {
	Tickets []Ticket
}

type Ticket {
	Title  string
	Unread bool
}

Window {
	Column {
		for _, ticket := range bridge.Tickets {
			ListItem {
				label:    ticket.Title
				selected: ticket.Unread
			}
		}
	}
}
```

`template: true` plus `ui.Fill` remains for a list built by hand — one row
inserted, or a container that is not a `.goi` block. `ui.Instantiate` and
`ui.Remove` are the low-level clone and detach.

A fragment instance can be the template row too, which keeps the row's design in
its own file: `Row { template: true supporting: "x" }` hides the expanded
fragment and `ui.Fill` copies it like any other template.
