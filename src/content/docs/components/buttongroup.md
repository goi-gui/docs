---
title: "ButtonGroup"
---

A row of related buttons that share one shape and one gap.

[All components](/components/)

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/buttongroup-filled-light.png" alt="ButtonGroup filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-filled-dark.png" alt="ButtonGroup filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tonal</strong><br />
  <img src="/img/components/buttongroup-tonal-light.png" alt="ButtonGroup tonal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-tonal-dark.png" alt="ButtonGroup tonal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>elevated</strong><br />
  <img src="/img/components/buttongroup-elevated-light.png" alt="ButtonGroup elevated in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-elevated-dark.png" alt="ButtonGroup elevated in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/buttongroup-outlined-light.png" alt="ButtonGroup outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-outlined-dark.png" alt="ButtonGroup outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>text</strong><br />
  <img src="/img/components/buttongroup-text-light.png" alt="ButtonGroup text in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-text-dark.png" alt="ButtonGroup text in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
ButtonGroup {
	spacing: 8

	Button {
		label:   "Day"
	}

	Button {
		label:   "Week"
	}
}
```

## Properties

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
group := w.MustByID[*ui.ButtonGroup]("group")
group.Spacing.Set(12)
```

Every element also accepts the [common properties](/guide/common-properties/).
