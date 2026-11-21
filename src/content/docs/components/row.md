---
title: "Row"
---

Places children left to right.

[All components](/components/)

<p align="center">
  <img src="/img/components/row-light.png" alt="Row in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/row-dark.png" alt="Row in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Row {
	spacing:        8
	crossAxisAlign: center

	Button {
		label: "Save"
	}

	Button {
		label:   "Cancel"
		variant: text
	}
}
```

## Properties

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
row := w.MustByID[*ui.Row]("actions")
row.Spacing.Set(16)
```

Every element also accepts the [common properties](/guide/common-properties/).
