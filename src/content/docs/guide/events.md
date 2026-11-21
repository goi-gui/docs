---
title: "Events"
sidebar:
  label: "Events"
---

An event property is how a design tells Go that something happened. The design
declares the handler in its `bridge` block and calls it; Go registers the body
with `ui.SetHandler`. The same handlers are available as Go subscriptions on
the node, so a component can be driven entirely from Go when that is simpler.

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

```go
w.Bind(func(w *ui.Window) error {
	return ui.SetHandler(w, "OnOpen", func(id string) { open(id) })
})
```

## The handler call

The value of an event property is always a handler call. Its arguments are
evaluated when the event fires; `event` is the event's own payload:

```goi
TextField {
	onEdit:   bridge.onQuery(event)
	onSubmit: bridge.onQuery(event)
}
```

A component page lists the events it emits. A fragment can also declare a
handler prop and call it, with the instance deciding which bridge handler that
is:

```goi
// Toolbar.goi
props {
	OnOpen func(id string)
}

Button {
	label:   "Open"
	onClick: props.OnOpen("42")
}
```

The instance passes the bridge handler as a prop:

```goi
// Main.goi
import Toolbar "./Toolbar.goi"

Window {
	Toolbar {
		OnOpen: bridge.OnOpen
	}
}
```

## The events

| Design property | Go call | Emitted by |
|---|---|---|
| `onClick: bridge.Handler(...)` | `OnClick(func(ui.ClickEvent))` | every element; `ClickEvent` has `X`, `Y`, `Button` |
| `onClickOutside: bridge.Handler(...)` | `OnClickOutside(func(ui.ClickEvent))` | every element; a primary press outside its subtree, on the press itself |
| `onToggle: bridge.Handler(event)` | `OnToggle(func(bool))` | Checkbox, RadioButton, Switch, Chip |
| `onChange: bridge.Handler(event)` | `OnChangeValue(func(float64))` | Slider |
| `onEdit: bridge.Handler(event)` | `OnEdit(func(string))` | TextField, SearchBar (every keystroke); ColorPicker (every change) |
| `onSubmit: bridge.Handler(event)` | `OnSubmit(func(string))` | TextField, SearchBar (Enter); DatePicker, TimePicker, ColorPicker (the picked value) |
| `onSelect: bridge.Handler(event)` | `OnSelect(func(int))` | Tabs, NavigationBar, NavigationRail, List, Menu, Table, SegmentedButton, Carousel, and every chart (the slice or point) |
| `onHover: bridge.Handler(event)` | `OnHoverPoint(func(int))` | charts: the point under the pointer, -1 when it leaves |
| `onPlay: bridge.Handler(event)` | `OnPlay(func(float64))` | Audio, Video (payload: position in seconds) |
| `onPause: bridge.Handler(event)` | `OnPause(func(float64))` | Audio, Video |
| `onEnd: bridge.Handler(event)` | `OnEnd(func(float64))` | Audio, Video |
| `onCancel: bridge.Handler(event)` | `OnCancel(func(string))` | TimePicker, ColorPicker |
| `onOK: bridge.Handler(event)` | `OnOK(func(string))` | TimePicker, ColorPicker |
| `onDoubleTap: bridge.Handler()` | `OnDoubleTap(func(ui.ClickEvent))` | GestureDetector |
| `onLongPress: bridge.Handler()` | `OnLongPress(func(ui.ClickEvent))` | GestureDetector |
| `onPanStart`, `onPanUpdate`, `onPanEnd` | `OnPanStart/Update/End(func(ui.PanEvent))` | GestureDetector |
| `onMouseEnter`, `onMouseMove`, `onMouseLeave` | `OnMouseEnter/Move/Leave(func(ui.MouseEvent))` | GestureDetector: the pointer entering, moving over, or leaving its box |
| `onScroll`, `onScrollToEnd`, `onScrollToStart` | `OnScroll(func(ui.ScrollEvent))`, `OnScrollToEnd(func())`, `OnScrollToStart(func())` | any element with `scroll: true`; see [Scrolling](/guide/scrolling/#scroll-events) |

### Go-only subscriptions

Some events are available only from Go, usually because their payload is a
struct the design language does not name:

| Go call | Emitted by |
|---|---|
| `OnSort(func(ui.SortOrder))` | Table; `SortOrder` has `Column`, `Key` and `Ascending` |
| `OnSeeked(func(time.Duration))` | Audio, Video; the new position |
| `OnResize(func(ui.TerminalSize))` | Terminal; the measured columns and rows |
| `OnExit(func(ui.TerminalExit))` | Terminal; the reader ended, with the exit code when a waiter was set |
| `w.OnKey(func(ui.KeyEvent))` | Window; every key press, whether or not a field has focus |

The terminal events are described on [Terminal](/components/terminal/), and the
key event on [Keyboard](/system/keyboard/).

## From Go

Every event property has a matching subscription on the node. A subscription
returns an unsubscribe function, and registering it again after a hot reload is
safe:

```go
button := w.MustByID[*ui.Button]("save")
off := button.OnClick(func(e ui.ClickEvent) {
	fmt.Println(e.X, e.Y, e.Button)
})
_ = off // unsubscribe only if the subscription should end before the next Bind

field := w.MustByID[*ui.TextField]("query")
field.OnEdit(func(text string) { filter(text) })
```

`SetHandler` returns an error when the bridge declaration and the Go function
disagree about the parameters, which catches a typo in a handler name at load
time rather than at the first click. See [Bridge](/guide/bridge/#passing-handlers)
for the declaration rules.

## Values that change

An event is for a thing that happened once. A value that changes belongs in
`SetData`, a property or a `state` block; the next frame reads it. A loop that
rebuilds rows should use `ui.SetData` rather than an event per row, and
`ui.OnEach` when a row needs a Go handler. See [Bridge](/guide/bridge/) and
[State](/guide/states/).
