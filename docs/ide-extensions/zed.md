---
title: Zed
sidebar_label: Zed
---

# Zed extension

[goi-gui/zed-goi](https://github.com/goi-gui/zed-goi) adds `.goi` support to
[Zed](https://zed.dev): syntax highlighting, bracket matching, indentation, an
outline, a file icon and the `goipls` language server.

## What it gives you

| Feature | Source |
|---|---|
| Highlighting | `languages/goi/highlights.scm` |
| Bracket matching (and rainbow brackets) | `languages/goi/brackets.scm` |
| Indent after `{` | `languages/goi/indents.scm` |
| Outline panel (`Window › Column › Card › …`) | `languages/goi/outline.scm` |
| Language name, `.goi` suffix, `//` comments | `languages/goi/config.toml` |
| Diagnostics, completion, hover, go-to-definition | `goipls` |
| Icon name completion (Material Symbols) | `goipls` |
| `app.` / `window.` completion | `goipls` |
| `.goi` file icon | `icons/` + `icon_themes/goi.json` |

The editor treats element names as types, property names as fields, and value
identifiers (`filled`, `primary`, `dark_mode`) as constants, because those are
names the framework resolves rather than variables. A `bridge` block reads as Go
fields, and an event property reads as a handler call.

## Language server

The server is the same parser and schema the runtime uses, so a design that
draws also type-checks. Diagnostics land on the property they blame, even when
it lives in an imported fragment. Completion knows:

- the element you are inside and the values its properties accept;
- the theme's colour roles and any `ui.SetCustomColor` name the app defines;
- the `id`s the file declares, and their properties after `panel.`;
- `bridge.` and `props.` declarations with their Go types;
- handler calls valid for an event property, and the builtins `formatf`, `len`,
  `cap`, `min`, `max`;
- the icon names the embedded Material Symbols font actually contains;
- for a fragment instance, its props, the root properties it lets you override
  and the slots it fills;
- the file's own declarations before the root element: `import`, `props`,
  `bridge`, `data` and `type`;
- a switch body's arms, `case` and `default`, where an element would not fit.

Inside a `!"…"!` block string the server stays quiet: the words there are a
document, not a design.

An item finishes the line for you: an element opens its braces with the caret
inside, a property writes its `name:`, and a control statement opens its body. A
client that reports snippet support gets the whole thing — `Text { }` with the
caret between the braces, indented under the element around it, and the argument
placeholder of `t()` or `formatf()` — while a text-only client still gets the
colon and the name.

Hover explains declarations, shape fields, loop variables and fragments.
`Ctrl`-click on an `import` path, its alias or an id jumps to its declaration,
and formatting on save uses the same rules as `goifmt`.

`goipls` is a Go binary, so it is not bundled with the extension. Install it once
and keep it on `PATH`:

```sh
go install github.com/goi-gui/goi/cmd/goipls@latest
```

The module lives in a private repository, so set
`GOPRIVATE=github.com/goi-gui/*` (and have a git credential for it) before
installing. If Zed reports "goipls not found on PATH", the install has not run or
its directory is not on `PATH`; restart the server from the language server menu
after reinstalling.

## Installing the extension

```sh
git clone https://github.com/goi-gui/zed-goi
cd zed-goi
./install.sh
```

Then restart Zed. The status bar of a `.goi` file should read **Goi**.

The script compiles the grammar and the extension wasm and drops the result into
Zed's `extensions/installed/goi`. It also creates the `wasm32-wasi` sysroot
symlinks that work around Zed asking clang for the deprecated `wasm32-wasi`
triple while its bundled wasi-sdk only ships `wasm32-wasip1`.

Override the paths if yours differ:

```sh
WASI_SDK_PATH=/path/to/wasi-sdk ZED_EXTENSIONS=~/.local/share/zed/extensions ./install.sh
```

Re-run the script after editing `languages/goi/*.scm`, `grammar.js` or
`src/lib.rs`.

## File icon

Zed draws file icons from icon themes. The extension ships a one-icon theme that
inherits every other icon from Zed's default. Select it once in `settings.json`:

```json
{
  "icon_theme": "Goi"
}
```

## Editor-agnostic

`goipls` speaks the Language Server Protocol over stdio, so any editor that can
start a stdio server can use it. Zed is the only extension that ships so far;
elsewhere the server still works, you just wire it up yourself.
