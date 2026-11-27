---
title: "Zed"
---

[goi-gui/zed-goi](https://github.com/goi-gui/zed-goi) adds `.goi` support to
[Zed](https://zed.dev): syntax highlighting, bracket matching, indentation, an
outline, a file icon and the `goipls` language server. VS Code and VSCodium use
the [VS Code extension](/ide-extensions/vscode/) with the same server.

## What it gives you

| Feature | Source |
|---|---|
| Highlighting, with Go injected into `setup` blocks | `languages/goi/highlights.scm`, `languages/goi/injections.scm` |
| Bracket matching (and rainbow brackets) | `languages/goi/brackets.scm` |
| Indent after `{` | `languages/goi/indents.scm` |
| Outline panel (`Window › Column › Card › …`) | `languages/goi/outline.scm` |
| Language name, `.goi` suffix, `//` comments | `languages/goi/config.toml` |
| Diagnostics, completion, hover, go-to-definition | `goipls` |
| Setup names in values and Go completion/type errors inside `setup` | `goipls` |
| Icon name completion (Material Symbols) | `goipls` |
| `app.` / `window.` completion | `goipls` |
| Auto-import a sibling fragment | `goipls` completion + quick fix |
| Wrap a component in a new component | `goipls` code action |
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
- the theme's colour roles and any `Window.SetCustomColor` name the app defines;
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

### Auto import

Typing at an element position offers the `.goi` files under the project's
`assets` directory that are not imported yet. Accepting one writes the element
and adds `import "goi://dir/Name.goi"`: the import is unnamed, so the element
name is the file's base name, and the container path works from every file. An
unknown element also carries a quick fix with the same edit, for when the name
was typed before completion was used.

### Path completion

Inside a quoted import path or a `src:` value, completion follows the path as
you type. A path that starts with `goi://` lists the assets directory, so
`goi://images/` completes `goi://images/cover.png`. A relative import lists the
document's directory, so `./Side.goi` and `../shared/Other.goi` complete where
they resolve. A relative `src` lists the project directory, where `goi run`
starts the program and a plain path is read. Imports list `.goi` files and
folders; `src` lists every file.

### Wrap with component

Put the caret inside a component, or select it, and run **Wrap with component**
from the code-action menu (`editor: toggle code actions`). The action wraps the
component in a new one, indents its body one level and leaves the closing brace
at the old indentation. Nothing is written at the name position: the caret waits
there, so typing `Row`, `Card`, `Stack` or anything else names the wrapper.

```goi
Column {
	Row {
		Text { text: "hi" }
	}
}
```

Select several components with the mouse and the run from the first to the last
is wrapped together; the components beside it stay where they are. Selecting a
whole line, indentation and trailing newline included, still wraps that
component rather than its parent. The window itself is not offered, because a
wrapper around the root would replace the design's root element. A client that
cannot apply snippets still gets the wrap, with a literal `Column` and no caret
movement.

Hover explains declarations, shape fields, loop variables and fragments.
`Ctrl`-click on an `import` path, its alias or an id jumps to its declaration,
and formatting on save uses the same rules as `goifmt`.

`goipls` is a Go binary, so it is not bundled with the extension. `goi setup`
installs it with the formatter and keeps both on `PATH`:

```sh
goi setup
```

If only the server is wanted:

```sh
go install github.com/goi-gui/goi/cmd/goipls@latest
```

If Zed reports "goipls not found on PATH", the install has not run or its
directory is not on `PATH`; restart the server from the language server menu
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
start a stdio server can use it. The [VS Code extension](/ide-extensions/vscode/)
ships with goi too; elsewhere the server still works, you just wire it up
yourself.
