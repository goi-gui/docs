# LoadingIndicator

The M3 indeterminate loading shape.

[All components](../components.md)

## In a `.goi` file

```goi
LoadingIndicator { width: 48 height: 48 }
LoadingIndicator { size: small }
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `size` | enum | — (follows width and height) |

## From Go

```go
spinner := ui.MustByID[*ui.LoadingIndicator](w, "loading")
spinner.SetVisible(true)
```

Every element also accepts the [common properties](../components.md#common-properties).
