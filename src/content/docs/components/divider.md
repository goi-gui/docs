---
title: "Divider"
---

A one-pixel rule between content.

[All components](/components/)

<p align="center">
  <strong>horizontal</strong><br />
  <img src="/img/components/divider-horizontal-light.png" alt="Divider horizontal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/divider-horizontal-dark.png" alt="Divider horizontal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>vertical</strong><br />
  <img src="/img/components/divider-vertical-light.png" alt="Divider vertical in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/divider-vertical-dark.png" alt="Divider vertical in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Divider {}

Divider {
	variant: vertical
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `horizontal` (default) or `vertical` |

A vertical divider is 1dp wide and takes the height it is given, so it needs one:
`Divider { variant: vertical height: 24 }` inside a `Toolbar` or a `Row`. The
horizontal form is 1dp tall and fills the width.

## From Go

```go
div := w.MustByID[*ui.Divider]("divider")
div.SetVisible(hasResults)
```

Every element also accepts the [common properties](/components/#common-properties).
