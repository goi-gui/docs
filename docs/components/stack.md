# Stack

Overlays children on top of each other, last child on top. It is the base for dialogs, scrims and badges.

[All components](../components.md)

<p align="center">
  <img src="/img/components/stack-light.png" alt="Stack in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/stack-dark.png" alt="Stack in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Stack {
	flex: 1

	Rectangle {
		background: theme.surfaceContainer
		radius:     16
	}

	Positioned {
		right:  12
		bottom: 12

		FAB {
			icon: edit
		}
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; horizontal placement |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `stretch`; vertical placement |

## From Go

```go
stack := ui.MustByID[*ui.Stack](w, "overlay")
sheet, err := ui.ByID[*ui.Positioned](w, "sheet")
if err == nil {
	sheet.SetVisible(true)
}
```

Every element also accepts the [common properties](../components.md#common-properties).
