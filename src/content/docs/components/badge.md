---
title: "Badge"
---

A small count or status dot, usually overlaid on an icon with `Positioned` or `Stack`.

[All components](/components/)

<p align="center">
  <img src="/img/components/badge-light.png" alt="Badge in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/badge-dark.png" alt="Badge in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Badge {}

Badge {
	label: "12"
}

Badge {
	label: "99+"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |

## From Go

```go
badge := w.MustByID[*ui.Badge]("unread")
badge.Label.Set(strconv.Itoa(count))
```

Every element also accepts the [common properties](/components/#common-properties).
