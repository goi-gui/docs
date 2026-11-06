# Rectangle

A plain colored box. It has no component behaviour, so it is the cheapest background, scrim or hit area.

[All components](../components.md)

## In a `.goi` file

```goi
Rectangle {
	background: primary
	radius: 8
	height: 4
}

Rectangle {
	width:  200
	height: 100
	background: surfaceContainerHigh
	radius: 16
	shadow: 0 8 24 4 #00000033
}
```

## Properties

_No component-specific properties._

## From Go

```go
scrim := ui.MustByID[*ui.Rectangle](w, "scrim")
scrim.OnClick(func(ui.ClickEvent) { closeSheet() })
```

`shadow` takes the CSS form, and a `Rectangle` follows its own `radius`, so a
round panel gets a round shadow. See [Shadows](../guide/shadows.md).

Every element also accepts the [common properties](../components.md#common-properties).
