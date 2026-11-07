---
title: Fragments
sidebar_label: Fragments
---

# Fragments

A fragment is a `.goi` file that describes part of a window instead of a whole
one. It can take values, handlers and children from the file that uses it, so a
design stays small without copying the same block of elements around.

A file that declares `props`, or uses `$children` or a named slot, is a fragment.
The file a program loads must still be a `Window`; a fragment's root may be any
element.

## Defining a fragment

```goi
// Sidebar.goi

props {
	Title    string
	Subtitle string
}

Column {
	width:     280
	padding:   12
	spacing:   6
	background: surfaceContainer

	Text {
		text: props.Title
		role: titleLarge
	}

	Text {
		text: props.Subtitle
		role: bodySmall
	}
}
```

`props` declares the typed inputs, the way Go declares fields: `Name Type`, no
colon, no default. The fragment reads them as `props.Name`.

## Importing and using one

An import names the alias first, the way Go writes an import. The path is
relative to the **importing file** and must stay inside the asset container:

```goi
// Main.goi

import Sidebar "./Sidebar.goi"

Window {
	Row {
		Sidebar {
			Title:    "Inbox"
			Subtitle: "12 unread"
		}

		Column { flex: 1 }
	}
}
```

`Sidebar { ... }` is replaced by the fragment's root element, so the fragment
decides its own layout and the instance places it like any other child.

- A prop the instance leaves out is the **type's zero value** (`""`, `0`,
  `false`, `#00000000`), so a fragment never has to guard for a missing value.
- A prop type is written the way Go writes it: a primitive, `[]Ticket`, a map,
  a handler (`func(id string)`) or a declared `type`.
- Fragments may import fragments. A cycle is an error.

## Passing values from the bridge

A prop can also be fed straight from the app's bridge. The fragment shows the
value and calls the handler; it never mentions `bridge` itself:

```goi
// Counter.goi

props {
	Count  int
	OnStep func()
}

Row {
	spacing: 8
	Text { text: formatf("%d", props.Count) }
	Button { label: "+" onClick: props.OnStep() }
}
```

```goi
// Main.goi

import Counter "./Counter.goi"

bridge {
	Count  int
	onStep func()
}

Window {
	Counter {
		Count:  bridge.Count
		OnStep: bridge.onStep
	}
}
```

A slice prop is walked like a bridge list — `for _, row := range props.Rows` —
and the instance passes a list whose type matches the declaration. A handler
prop is called like a bridge handler; `event` is not available inside the
fragment, because the fragment decides what it passes.

## Overriding the fragment's root

An instance property whose name is a prop sets that prop. Any other property is
applied to the fragment root, replacing the fragment's own value of the same
name:

```goi
import Sidebar "./Sidebar.goi"

Window {
	Sidebar {
		Title: "Inbox"
		width: 320        // overrides the fragment's width: 280
	}
}
```

`id` is the one shared name: a fragment that declares an `id` prop takes the
instance's `id:` as that value, so instance-id scoping is off for it.

## Passing children

A fragment marks where children go with `$children`:

```goi
// Card.goi

Column {
	gap: 5
	$children
}
```

```goi
// Main.goi

import Card "./Card.goi"

Window {
	Card {
		width: 300
		Text { text: "selam" }
		Button { label: "Tamam" }
	}
}
```

- `$children` is a slot, not an element: it takes no properties and no children
  of its own. A fragment may have more than one; each gets the same children.
- Children may be anything, including other fragments. They resolve their
  imports in the **file they were written in**.
- Passing children to a fragment with no `$children` is an error, reported where
  the children were written.
- A slot with nothing passed draws nothing, so the fragment still previews on
  its own.

## Named slots

Any `$name` in member position is a slot. `$children` is the unnamed one that
plain children go to:

```goi
// Card.goi

Column {
	$header
	$children
	$footer
}
```

```goi
// Main.goi

Card {
	$header { Text { text: "Inbox" } }
	Text { text: "The body" }        // goes to $children
	$footer { Button { label: "OK" } }
}
```

- A bare `$header` in the fragment body is a slot marker; `$header { ... }` in
  an instance passes the elements that land there.
- Passing a slot the fragment does not declare is an error, reported in the
  caller. An empty `$header { }` still counts as filling the slot.

## Ids and instances

An instance that sets `id` namespaces every id inside the fragment, so one
fragment can be used any number of times and each copy keeps its own behaviour:

```goi
Column {
	Card { id: first }
	Card { id: second }
}
```

`Card.goi`'s `Text { id: title }` is `first.title` in the first copy and
`second.title` in the second:

```go
first := ui.MustByID[*ui.Text](w, "first.title")
second := ui.MustByID[*ui.Text](w, "second.title")
```

Ids written in the caller — its own children, including the ones it passes to a
slot — are not scoped, because they belong to the caller. An instance without an
`id` scopes nothing, so two such instances still collide.

A design can read a node's property by id, the same way it reads `window.width`:
`width: panel.width`. The id must be declared in the same file.

## Rules

- The import path is relative to the importing file and cannot leave the asset
  container.
- `props.Name` is only valid inside the file that declares it. The entry file
  has nothing to fill it in, so it is an error there.
- A name the `props` block does not declare is an error, with a "did you mean"
  hint.
- A prop's declared type is checked against every property it feeds.
- `goicheck` and the language server report a file with `props`, `$children` or
  a named slot as a fragment rather than a window.
