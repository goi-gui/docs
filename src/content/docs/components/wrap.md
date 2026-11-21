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

| Property | Type | Notes |
|---|---|---|
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
wrap := w.MustByID[*ui.Wrap]("chips")
wrap.Spacing.Set(12)
```

Every element also accepts the [common properties](/components/#common-properties).
