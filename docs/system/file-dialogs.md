---
title: File dialogs
sidebar_label: File dialogs
---

# File dialogs

goi wraps the platform's native file pickers. They return a path; reading or
writing the file stays in Go.

```go
path, err := ui.OpenFile(
	ui.DialogTitle("Open a design"),
	ui.DialogFilters(ui.FileFilter{
		Name:     "goi designs",
		Patterns: []string{"*.goi"},
	}),
)
if errors.Is(err, ui.ErrDialogCanceled) {
	return
}
if err != nil {
	log.Print(err)
	return
}
```

## Calls

| Call | Returns |
|---|---|
| `ui.OpenFile(opts...)` | one selected file path |
| `ui.OpenFiles(opts...)` | several selected file paths |
| `ui.SaveFile(opts...)` | the chosen path, after asking before overwrite |
| `ui.OpenFolder(opts...)` | one selected directory |

A dismissed dialog returns `ui.ErrDialogCanceled`, so test it with `errors.Is`
rather than comparing the error directly.

## Options

| Option | Effect |
|---|---|
| `ui.DialogTitle(title)` | window title of the dialog |
| `ui.DialogDir(dir)` | directory the dialog opens in; also the save default |
| `ui.DialogFilename(name)` | name a save dialog starts with, or the file an open dialog selects |
| `ui.DialogFilters(...)` | limits the files the dialog shows |
| `ui.DialogContext(ctx)` | dismisses the dialog when `ctx` is done |

`ui.FileFilter` takes a display name and one or more glob patterns:

```go
ui.DialogFilters(
	ui.FileFilter{Name: "Images", Patterns: []string{"*.png", "*.jpg", "*.svg"}},
	ui.FileFilter{Name: "All files", Patterns: []string{"*"}},
)
```

## Platform notes

`ui.DialogsAvailable()` reports whether the platform has what the dialogs need.
It is always true on Windows and macOS. On Linux it needs `zenity`,
`matedialog` or `qarma` on `PATH`; when none is installed the calls return an
error that says so.

The call blocks until the dialog closes. From a UI handler that means the window
does not repaint while the dialog is open, which is the normal modal behaviour.
For work that must not hold the frame (a long import after the pick), use a
goroutine and post the result back:

```go
go func() {
	path, err := ui.OpenFile(ui.DialogFilters(ui.FileFilter{
		Name:     "Data",
		Patterns: []string{"*.json"},
	}))
	if err != nil {
		return // canceled or unavailable
	}
	app.Post(func() {
		ui.SetData(w, "Path", path)
	})
}()
```

The dialog itself does not touch the node tree, so it is safe to call from any
goroutine; only the update goes through `App.Post`.

## A complete handler

```go
open := ui.MustByID[*ui.Button](w, "open")
open.OnClick(func(ui.ClickEvent) {
	path, err := ui.OpenFile(ui.DialogTitle("Open"))
	if err != nil {
		return
	}
	data, err := os.ReadFile(path)
	if err != nil {
		ui.Notify("Could not open the file", err.Error())
		return
	}
	load(data)
})
```
