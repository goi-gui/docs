---
title: Notifications
sidebar_label: Notifications
---

# Notifications

`ui.Notify` shows a desktop notification through the platform's own service.

```go
if err := ui.Notify("Build finished", "3 files written"); err != nil {
	log.Print(err)
}
```

The platform owns the toast, so the call returns without waiting for it to
disappear:

- **Linux** goes through D-Bus, falling back to `notify-send`.
- **macOS** uses the notification center.
- **Windows** uses the toast API.

`Notify` only takes a title and a body. It does not block, does not return a
handle, and does not touch the window tree, so it can be called from the UI
goroutine or from a background goroutine.

```go
app.Post(func() {
	if err := ui.Notify("Saved", "Your changes are on disk"); err != nil {
		log.Print(err)
	}
})
```

A notification is fire-and-forget: whether it is shown, and for how long, is the
desktop's decision. If the user must see the message inside the app, use a
[Snackbar](../components/snackbar.md) instead.
