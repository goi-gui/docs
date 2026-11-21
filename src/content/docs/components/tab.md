---
title: "Tab"
---

One tab in a tab bar.

[All components](/components/)

<p align="center">
  <img src="/img/components/tab-light.png" alt="Tab in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/tab-dark.png" alt="Tab in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Tab {
	label:    "Overview"
	selected: true
}

Tab {
	label: "Specs"
	leadingIcon:  tune
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `leadingIcon` | string | leading Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | the active tab; the bar's underline follows it, and a click clears the siblings |

## From Go

```go
tab := w.MustByID[*ui.Tab]("specs")
tab.Selected.Set(true)
```

Every element also accepts the [common properties](/guide/common-properties/).
