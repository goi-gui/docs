# LoadingIndicator

The M3 indeterminate loading shape: a twelve-lobed star that turns while it
morphs into a rounded square, squeezes into a pill, and comes back.

[All components](../components.md)

<p align="center">
  <img src="/img/components/loadingindicator-light.gif" alt="LoadingIndicator in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/loadingindicator-dark.gif" alt="LoadingIndicator in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
LoadingIndicator {
	size: 48
}

LoadingIndicator {
	size:  96
	color: theme.tertiary
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `color` | color | the shape's colour; defaults to `primary`. A role such as `theme.tertiary`, or a hex literal |

The shape scales with its box: `size` is the shortcut for a square one, and a
box that is not square uses the shorter side and stays centred. 48dp is the
default. The animation is drawn from a signed distance in the renderer rather
than from a bitmap, so it stays sharp at any size and at any display scale, and
it costs one quad a frame.

## From Go

```go
spinner := w.MustByID[*ui.LoadingIndicator]("loading")
spinner.Color.Set(0x6750A4FF) // any hex, or the role the design named
spinner.SetWidth(64)
```

Every element also accepts the [common properties](../components.md#common-properties).
