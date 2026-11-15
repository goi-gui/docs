# Rectangle

A plain colored box. It has no component behaviour, so it is the cheapest background, scrim or hit area.

[All components](../components.md)

<p align="center">
  <img src="/img/components/rectangle-light.png" alt="Rectangle in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/rectangle-dark.png" alt="Rectangle in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Rectangle {
	background: theme.primary
	radius:     8
	height:     4
}

Rectangle {
	width:      200
	height:     100
	background: theme.surfaceContainerHigh
	radius:     16
	shadow:     0 8 24 4 #00000033
}
```

## Properties

_No component-specific properties._

## From Go

```go
scrim := w.MustByID[*ui.Rectangle]("scrim")
scrim.OnClick(func(ui.ClickEvent) { closeSheet() })
```

`shadow` takes the CSS form, and a `Rectangle` follows its own `radius`, so a
round panel gets a round shadow. See [Shadows](../guide/shadows.md).

Every element also accepts the [common properties](../components.md#common-properties).
