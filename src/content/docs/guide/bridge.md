---
title: "Bridge"
---

A handler may also be written as a method, `getName() string`, and may
return one value; setup code can call it. A `.goi` file holds no app logic. It declares the values it reads and the
handlers it calls in a `bridge` block; Go supplies both. That block is the only
connection between the design and the program. A file may also keep value
helpers and small local actions in a [setup block](/guide/setup/).

```goi
bridge {
	Count   int
	Tickets []Ticket
	onInc   func()
	onOpen  func(id string)
	getName() string
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

`ui.SetData(w, name, value)` writes a bridge variable. Call it from `Bind`, or
from the UI goroutine through `App.Post` (see
[Updating from another goroutine](#updating-from-another-goroutine)), then read
it in the design as `bridge.Name`:

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
		Text {
			text: formatf("%d open", bridge.Count)
		}

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

### Nested fields

A bridge value may hold one declared type, and an expression walks into it with
another dot: `bridge.Device.Name`. A field that is itself a declared type keeps
going (`bridge.Device.Settings.Theme`), and a list field is walked like any
other bridge list:

```goi
Text { text: bridge.Device.Name }

for _, installed := range bridge.Device.InstalledApps {
	Text { text: installed.Name }
}
```

The language server completes the fields after `bridge.Device.` from the
declared type, and the checker rejects a field the type does not declare. Only
`bridge` and `data` values walk field by field; a prop is passed as its own
value, so a fragment that needs a field declares a prop for it.

### Rebuilding

Setting a list with `ui.SetData` rebuilds only the loops that walk it. Setting a
scalar keeps the nodes and re-reads the value, so `bridge.Loading` costs one
visibility toggle rather than a rebuild.

## Updating from another goroutine

The window is single-threaded: nodes, props and bridge data are touched by the
frame goroutine only. Slow work — an HTTP call, a database query, a file — runs
off that goroutine and comes back through `app.Post`. Keep the `*ui.App` next to
the window:

```go
go func() {
	tickets, err := fetchTickets() // any blocking call
	app.Post(func() {
		ui.SetData(w, "Loading", false)
		if err != nil {
			ui.SetData(w, "Error", err.Error())
			return
		}
		ui.SetData(w, "Tickets", tickets)
	})
}()
```

- `Post` queues the function and wakes the loop, so an idle window runs the
  frame that shows the change; nothing has to poll.
- Queued functions run in the order they were posted, at the start of a frame,
  before layout. A batch posted together lands in one rebuild, not one per call.
- Everything inside the function is on the UI goroutine, so that is where the
  tree is read and written. The goroutine outside it must not touch `w` or call
  `ui.SetData` directly.
- A handler already runs on the UI goroutine, so a click does not need `Post`. A
  ticker, an HTTP client, a worker pool or an ffmpeg callback does.
- The request that is no longer wanted still answers: keep a sequence number in
  app state and drop a stale reply inside the posted function, as
  [`examples/map`](https://github.com/goi-gui/examples/tree/main/map) does with
  `searchSeq`.

## Passing handlers

`ui.SetHandler(w, name, fn)` registers the Go body a design's handler calls. A
handler is declared with its parameter types, and called as the whole value of an
event property:

```goi
bridge {
	onInc  func()
	onOpen func(id string, limit uint)
}

Window {
	Column {
		Button {
			label:   "+"
			onClick: bridge.onInc()
		}

		ListItem {
			label:   "42"
			onClick: bridge.onOpen("42", 10)
		}
	}
}
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
re-registering there is enough. A handler registered outside `Bind` is carried
across a reload too, and so are the values `SetData` stored. A carried value
whose bridge declaration changed type is reset to its zero value with a
warning:

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

The entry file and a fragment may declare the same name. If the types match it
is one declaration, so `SetData` and `SetHandler` reach every page that reads
it; handler parameter names may differ, but their types and arity must match. A
repeated name with a different type stops the load with a diagnostic naming
both types. A `type` declared in two files merges the same way when its fields
match.

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

A single row is a loop over a one item list: keep the row in the design and call
`ui.SetData` with a slice of one. There is no cloned prototype node.

## Background work

Bridge handlers run on the UI goroutine. A slow fetch belongs in a goroutine;
post its result back with `app.Post` before touching a property or `SetData`.
See [Async work](/guide/async/) for the pattern and the rules.
