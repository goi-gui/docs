---
title: "Finding elements"
sidebar:
  label: "Finding elements"
---

Every `id` in a design is a handle in Go. The lookup is typed, so a missing id
or the wrong component is an error before the handler runs:

```go
button, err := w.ByID[*ui.Button]("save") // fails when missing or mistyped
button := w.MustByID[*ui.Button]("save")  // panics; fine in Bind
node, err := w.ByID[ui.Node]("save")      // untyped
```

`MustByID` is the usual form inside `Bind`, where a missing node is a bug in
the design. Use `ByID` when the element is optional or the id comes from data:

```go
if row, err := w.ByID[*ui.ListItem]("row-" + id); err == nil {
	row.SetVisible(true)
}
```

The package form does the same and is useful in a helper that only holds the
window and the id:

```go
button := ui.MustByID[*ui.Button](w, "save")
```

## Rows and fragments

`Window.ByID` finds the ids the design declares in its tree. A row built by a
`for` loop or a fragment gets a scoped id, so it is not in that index; use
`Descendant` on the row or on the loop's parent:

```go
row := ui.MustByID[*ui.ListItem](w, "row")
label, err := ui.Descendant[*ui.Text](row, "rowLabel")
```

The design can read a property by id as well, without Go:

```goi
Text {
	text: panel.width > 600 ? "wide" : "narrow"
}
```

## Supplying data and handlers

`ui.SetData` writes the value a design reads as `data.name` or `bridge.Name`;
a slice rebuilds only the loops that walk it. `ui.SetHandler` supplies the Go
body of a `bridge` handler. `ui.OnEach` is for a row that needs its own Go
subscription, and `ui.Remove` detaches a subtree:

```go
ui.SetData(w, "Tickets", tickets)
err := ui.SetHandler(w, "OnOpen", func(id string) { open(id) })
ui.OnEach[*ui.ListItem](w, "Tickets", func(row *ui.ListItem, t Ticket) {
	row.OnClick(func(ui.ClickEvent) { open(t.ID) })
})
ui.Remove(w, oldPanel)
```

`SetData` and `SetHandler` belong in `Bind`; they are registered again after a
hot reload. Keep app state outside `Bind` for the same reason. See
[Bridge](/guide/bridge/) for the value and handler rules.

## The window

`w.Root()` is the `Window` element, so its properties and setters are available
like any other node:

```go
w.Root().Theme.Set("dark")
w.Root().SetMinWidth(600)
w.SetResizable(false)
w.Close()
```

`Window` also exposes the platform calls: `Minimize`, `ToggleMaximize`,
`SetFullscreen`, `SetResizable`, `Size`, `Title`, `SystemMode` and the matching
getters. See [Window](/components/window/).
