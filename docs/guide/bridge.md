---
title: Bridge
sidebar_label: Bridge
---

# Bridge

A `.goi` file holds no logic. It declares the values it reads and the handlers
it calls in a `bridge` block; Go supplies both. That block is the only connection
between the design and the program.

```goi
bridge {
	Count   int
	Tickets []Ticket
	onInc   func()
	onOpen  func(id string)
}

type Ticket {
	ID     string
	Title  string
	Unread bool
}
```

`type` declares the shape of one row. `bridge` declares the values and the
handlers with Go field syntax: `Name Type`, no colon, no default.

## Passing values

`ui.SetData(w, name, value)` writes a bridge variable. Call it from `Bind` (or
from `App.Post`), then read it in the design as `bridge.Name`:

```go
func bind(w *ui.Window) error {
	ui.SetData(w, "Count", 3)
	ui.SetData(w, "Tickets", []Ticket{
		{ID: "1", Title: "Printer queue is stuck", Unread: true},
		{ID: "2", Title: "VPN will not connect"},
	})
	return nil
}
```

```goi
Window {
	Column {
		Text { text: formatf("%d open", bridge.Count) }

		for _, ticket := range bridge.Tickets {
			ListItem {
				label:    ticket.Title
				selected: ticket.Unread
				onClick:  bridge.onOpen(ticket.ID)
			}
		}
	}
}
```

A value the app never sets reads its type's zero value: `""`, `0`, `false`, a
transparent colour, or an empty list. Nothing in a design has a default.

### Struct fields

A slice may hold structs or `map[string]any`. A struct field is matched by its
`goi` tag first, then by the field name with a lower first letter. An unexported
field is ignored, and so is a field tagged `goi:"-"`:

```go
type User struct {
	ID       string `goi:"id"`
	FullName string `goi:"fullName"`
	Points   []int
	private  bool   // ignored: unexported
	Ignored  string `goi:"-"` // ignored: the tag says so
}
```

Numbers are converted, so an `int` field can feed a `number` position. A `nil`
slice is an empty list, which is what the first frame has before a fetch returns.

### Rebuilding

Setting a list with `ui.SetData` rebuilds only the loops that walk it. Setting a
scalar keeps the nodes and re-reads the value, so `bridge.Loading` costs one
visibility toggle rather than a rebuild.

## Passing handlers

`ui.SetHandler(w, name, fn)` registers the Go body a design's handler calls. A
handler is declared with its parameter types, and called as the whole value of an
event property:

```goi
bridge {
	onInc  func()
	onOpen func(id string, limit uint)
}

Button { label: "+" onClick: bridge.onInc() }
ListItem { label: "42" onClick: bridge.onOpen("42", 10) }
```

```go
ui.SetHandler(w, "onInc", func() {
	count++
	ui.SetData(w, "Count", count)
})
ui.SetHandler(w, "onOpen", func(id string, limit uint) {
	open(id, limit)
})
```

- The call's arguments are evaluated when the event fires, not every frame, so
  `ticket.ID` is the row that exists at click time.
- `event` is the event's own payload: `onToggle` passes a bool, `onChange` a
  number, `onEdit` and `onSubmit` a string, `onSelect` an index. `onClick`
  carries no scalar value.
- A handler call cannot be used inside an expression or a non-event property.
- A number may feed any Go numeric type; a bool and a colour may feed a
  `string` (`true`/`false`, `#rrggbb`).
- Calling a handler Go never registered, or passing it arguments it cannot
  accept, reports through `App.OnError` instead of killing the frame.

`SetHandler` belongs in `Bind`, which runs again after every hot reload, so
re-registering there is enough:

```go
win.Bind(func(w *ui.Window) error {
	ui.SetData(w, "Count", count)
	return ui.SetHandler(w, "onInc", func() {
		count++
		ui.SetData(w, "Count", count)
	})
})
```

Keep app state outside `Bind`: the function runs again on every reload, so a
variable declared inside it resets.

## Types

| Design type | Values |
|---|---|
| `bool` | `true`, `false` |
| `string` | any string |
| `int`, `int8`…`int64`, `uint`…`uint64`, `uintptr`, `float32`, `float64` | a number |
| `byte`, `rune` | a number |
| `color` | a colour literal or role |
| `[]T` | a slice, walked with `for` |
| `map[string]T` | a map, walked with `for` |
| `func(...)` | a handler; only callable in an event property |

Every design sees every declaration: a fragment can own its own `bridge` block,
and the declarations merge into the one design the window loads.

## Rows without a handler per row

`ui.OnEach` hooks every row a loop builds, including rows rebuilt after a list
change. Use it when a row's behaviour is easier to write in Go than to route
through a bridge handler:

```go
ui.OnEach[*ui.ListItem](w, "Tickets", func(row *ui.ListItem, t Ticket) {
	row.OnClick(func(ui.ClickEvent) { open(t.ID) })
})
```

The hook runs again for every rebuilt row, so it must be safe to call twice.

## Lists built by hand

`bridge` covers lists that come from Go. For a list built by hand — one row, or a
container that is not a `.goi` block — use a hidden `template: true` row and
`ui.Fill`; see the [List](../components/list.md) page.
