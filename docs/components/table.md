# Table

A sortable data grid: `TableColumn` children declare the columns, `TableRow`
children hold one `TableCell` per column. The header sorts on click, `selectable`
lets a click pick rows, and Go can do both through the same API.

[All components](../components.md)

## In a `.goi` file

```goi
Table {
	id:         people
	width:      100%
	striped:    true
	selectable: single

	TableColumn { key: "name" label: "Name" width: 200 sortable: true }
	TableColumn { key: "role" label: "Role" sortable: true }
	TableColumn { key: "age" label: "Age" width: 80 align: end numeric: true sortable: true }

	TableRow {
		TableCell { text: "Kaan" }
		TableCell { text: "Engineer" }
		TableCell { text: "31" }
	}

	TableRow {
		TableCell { text: "Ada" }
		TableCell { text: "Mathematician" }
		TableCell { text: "36" }
	}
}
```

Rows that come from Go are built by a `for` loop over a bridge slice. Declare
the slice, and let the loop build one row per item:

```goi
bridge {
	people []person
}

type person {
	name string
	role string
	age  int
}

Window {
	Table {
		id: people

		TableColumn { key: "name" label: "Name" sortable: true }
		TableColumn { key: "role" label: "Role" }
		TableColumn { key: "age" label: "Age" width: 80 numeric: true }

		for i, p := range bridge.people {
			TableRow {
				TableCell { text: p.name }
				TableCell { text: p.role }
				TableCell { text: formatf("%d", p.age) }
			}
		}
	}
}
```

Go fills it with `ui.SetData(w, "people", rows)`; the table rebuilds its rows.

## Columns

A column with a `width` keeps it; a percentage (`width: 25%`) takes that share
of the table's content width, and a column without one shares the leftover
space, never below 80dp. The last flexible column absorbs the rounding so the
row always fills the table. In the `outlined` and `filled` variants a 1dp rule
separates the columns; `plain` keeps its open look.

`align` places the header and every cell in the column (`start`, `center`,
`end`), and a cell may override it. `numeric: true` right-aligns by default and
sorts by the number inside the text, so `"1,200"` and `"12 items"` order
correctly.

`key` names the column for Go: `table.SortBy("age", false)` needs no index.
`sortable: true` makes the header clickable and gives it a pointer cursor and an
arrow, which points up for ascending and down for descending.

## Sorting

Clicking a sortable header sorts ascending; clicking it again reverses. The
order is stable, so equal values keep declaration order. Sorting reorders the
rows only — no other layout changes — and a selection keeps its meaning, because
selection counts the rows as they are shown.

## Selection

`selectable` decides what a press on a row does:

- `none` (default) makes cells inert: no press, no selection and no pointer
  cursor. A sortable header still sorts.
- `single` keeps at most one row. Clicking another row moves the selection;
  clicking the selected row again drops it.
- `multiple` toggles each row, so a click adds it and a second click removes it.
  In this mode the rows' own `selected` flags are the state, and a design can
  seed it directly:

  ```goi
  TableRow { selected: true
  	TableCell { text: "Kaan" }
  	TableCell { text: "Engineer" }
  }
  ```

Indices are display indices, so a selection stays on the row the reader sees
after a sort. The `OnSelect` event reports the row that was toggled.

## From Go

```go
table := ui.MustByID[*ui.Table](w, "people")

table.OnSort(func(s ui.SortOrder) {
	// s.Column, s.Key, s.Ascending
})
table.OnSelect(func(row int) {
	// the row that was toggled; read the set with SelectedRows
})

table.SortBy("age", false)        // by a column key
table.Sort(2, true)               // by index
table.SetSelectedRow(0)           // one row; -1 clears
table.SetSelectedRows(0, 2)       // multiple mode keeps both, single keeps the last
table.SelectedRows()              // []int of selected display indices
table.ToggleRow(1)                // what a click does, mode included
table.SetCell(1, 0, "Grace")      // row, column, text
table.RowCount()                  // rows as shown
```

`SetCell` writes the cell node directly, which is useful for an inline edit;
changing the bridge data and rebuilding the loop is the usual way to replace
every row.

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `outlined` (default), `filled`, `plain`; `plain` draws no surface or border |
| `striped` | bool | alternate row tint; off by default |
| `showHeader` | bool | `true` by default |
| `rowHeight` | number | row height in dp; 48 by default, a row's own `height` wins |
| `headerHeight` | number | header height in dp; 40 by default |
| `sortColumn` | number | sorted column index, `-1` (default) for declaration order |
| `sortAscending` | bool | `true` by default |
| `selectable` | enum | `none` (default), `single`, `multiple`; see [Selection](#selection) |
| `selectedRow` | number | selected row index, `-1` (default) for none; seeds single mode |

### `TableColumn`

| Property | Type | Notes |
|---|---|---|
| `label` | string | header text |
| `key` | string | name Go sorts by |
| `width` | number | fixed width in dp, or a percentage of the table's content width (`25%`); omit to share the leftover space |
| `align` | enum | `start`, `center`, `end` |
| `numeric` | bool | right-align by default and sort by number |
| `sortable` | bool | clickable header with an arrow |

### `TableRow`

| Property | Type | Notes |
|---|---|---|
| `selected` | bool | this row's selection flag; in `multiple` mode it is the state a design can seed |
| `disabled` | bool | dims the row's text |

### `TableCell`

| Property | Type | Notes |
|---|---|---|
| `text` | string | the value |
| `icon` | string | drawn when `text` is empty |
| `align` | enum | overrides the column's alignment |

Every element also accepts the [common properties](../components.md#common-properties).
