---
title: "Wrap"
---

Flows children left to right and starts a new run when the next child does not fit.

[All components](/components/)

<p align="center">
  <img src="/img/components/wrap-light.png" alt="Wrap in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/wrap-dark.png" alt="Wrap in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Wrap {
	spacing: 8

	Chip {
		label: "One"
	}

	Chip {
		label: "Two"
	}

	Chip {
		label: "Three"
	}
}
```

## Properties

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
wrap := w.MustByID[*ui.Wrap]("chips")
wrap.Spacing.Set(12)
```

Every element also accepts the [common properties](/guide/common-properties/).
