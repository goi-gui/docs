---
title: Loops
---

# Loops

`for` repeats an element with Go's `range` rules. It builds child elements from a
list, a map or a number; behaviour stays in Go.

```goi
bridge {
	users   []user
	Tickets []Ticket
	Groups  []group
	onOpen  func(id string)
}

type user {
	FullName string
	Age      int
}

type Ticket {
	ID     string
	Title  string
	Unread bool
}

type group {
	Title string
	Rows  []row
}

type row {
	Label string
}
```

```goi
Window {
	Column {
		for i, user := range bridge.users {
			Row {
				Text { text: formatf("%d. %s", i+1, user.FullName) }
			}
		}
	}
}
```

```go
ui.SetData(w, "users", users) // any slice of structs
```

## The range forms

| Form | Gives |
|---|---|
| `for i, row := range bridge.rows` | index and element |
| `for _, row := range bridge.rows` | element only |
| `for i := range bridge.rows` | index only (a single name binds the key) |
| `for range bridge.rows` | neither |
| `for k, v := range bridge.counts` | key and value of a map, in sorted key order |
| `for i := range 5` | counts from zero to four |
| `for range 5` | counts, without the index |
| `for i := range len(bridge.rows)` | counts to the list's length |
| `for i := range bridge.count` | counts to a number from Go |

`_` ignores one name, exactly as in Go. A map is walked in sorted key order, so a
frame is stable.

## Loop bodies

The body is a list of members, so it can hold any element, a nested `for`, an
`if`, or a slot:

```goi
Column {
	for _, ticket := range bridge.Tickets {
		if ticket.Unread {
			ListItem {
				label:    ticket.Title
				selected: true
				onClick:  bridge.onOpen(ticket.ID)
			}
		}
	}
}
```

Inside the body, `row.Field` reads a field of the current element, and those
values can feed properties, conditions and handler arguments. The language
server checks every field against the declared row type.

## Rebuilding

A list variable rebuilds only the loops that walk it, and only when it is set
with `ui.SetData`. Everything else keeps its nodes:

```go
ui.SetData(w, "Tickets", fetched) // the rows are rebuilt now
ui.SetData(w, "Count", len(fetched)) // this only re-reads a number
```

Row ids are not registered, because every row would otherwise collide. Reach a
part of a row with `ui.Descendant` — or hook each row with `ui.OnEach`:

```go
ui.OnEach[*ui.ListItem](w, "Tickets", func(row *ui.ListItem, t Ticket) {
	row.OnClick(func(ui.ClickEvent) { open(t.ID) })
})
```

`OnEach` runs for every row the loop builds, including rebuilt ones, and gets the
item the row was built from. It must be safe to call twice.

## Lists that do not come from a loop

A loop always walks a bridge list, a fragment prop or a number. For a list built
by hand, use a hidden prototype and `ui.Fill`:

```goi
List {
	id: results
	ListItem { template: true label: "Item" }
}
```

```go
ui.Fill(w, list, items, func(row *ui.ListItem, it item) {
	row.Label.Set(it.label)
})
```

`template: true` keeps the prototype out of layout and painting, and `Fill`
replaces the copies instead of stacking them.

## Nested loops

A loop inside a loop sees both sets of variables, and the inner loop is rebuilt
when its own list is set:

```goi
for _, group := range bridge.Groups {
	Column {
		Text { text: group.Title }
		for _, row := range group.Rows {
			Text { text: row.Label }
		}
	}
}
```
