---
title: "VS Code"
---

[`ksckaan1.goi`](https://marketplace.visualstudio.com/items?itemName=ksckaan1.goi)
adds `.goi` support to Visual Studio Code and VSCodium: syntax highlighting,
bracket matching, indentation, an outline and the `goipls` language server. The
source is [goi-gui/vscode-goi](https://github.com/goi-gui/vscode-goi).

## What it gives you

| Feature | Source |
|---|---|
| Highlighting, strings, colours, gradients, Go `setup` bodies | `syntaxes/goi.tmLanguage.json` |
| Bracket matching and auto-closing | `language-configuration.json` |
| Indent after `{` | `language-configuration.json` |
| Outline (`Window › Column › Card › …`) | `goipls` document symbols |
| Language name, `.goi` suffix, `//` and `/* */` comments | `language-configuration.json` |
| Diagnostics, completion, hover, go-to-definition | `goipls` |
| Formatting, also on save | `goipls` |
| Icon-name completion (Material Symbols) | `goipls` |
| `app.` / `window.` / `bridge.` / `props.` completion | `goipls` |
| Fragment auto-import | `goipls` completion + quick fix |
| Wrap a component in a new component | `goipls` code action |
| Window chrome docs (`disableResize`, `fullscreen`, limits) | `goipls` hover |
| `.goi` language icon | `icons/goi.svg` (the extension icon is `icons/icon.png`) |

The language server is the same one the [Zed extension](/ide-extensions/zed/#language-server)
starts, so diagnostics, completion, hover, the outline, formatting, auto-import,
path completion and the wrap action behave the same way in both editors. An
element read as a type, a property as a field and a value identifier as a
constant is the same language model in both.

## Install

From the marketplace:

```sh
code --install-extension ksckaan1.goi
```

VSCodium uses `codium` where these commands say `code`.

Or install a VSIX built from the repository:

```sh
git clone https://github.com/goi-gui/vscode-goi
cd vscode-goi
npm install
npm run package
code --install-extension goi-0.2.0.vsix
```

Either way the language server is a Go binary and is not bundled. `goi setup`
installs it with the formatter and keeps both on `PATH`:

```sh
goi setup
```

If only the server is wanted:

```sh
go install github.com/goi-gui/goi/cmd/goipls@latest
```

Open a `.goi` file and the status bar reads **Goi**. If the extension cannot
find `goipls`, it offers to install it and to open the setting that points at
it; the language server is restarted from the command palette after installing.

## Settings

| Setting | Default | Does |
| --- | --- | --- |
| `goi.languageServer.path` | `goipls` | The server binary; a bare name is looked up on `PATH`, a path is used as is (a leading `~` is expanded) |
| `goi.languageServer.args` | `[]` | Extra arguments passed to the server |
| `goi.trace.server` | `off` | Trace the messages between VS Code and `goipls` |

Format on save uses the same rules as `goifmt`:

```json
"[goi]": {
    "editor.formatOnSave": true
}
```

The extension also sets `editor.insertSpaces: false` and tab size 4 for `.goi`
files, matching the formatter.

## Commands

- **Goi: Restart Language Server** — starts the client again after changing its
  path or installing `goipls`.
- **Goi: Show Language Server Output** — opens the client's log.

## Notes

- VS Code file icons come from the active file icon theme. The extension
  contributes the language icon and its own extension icon; a theme that maps
  `.goi` can still give the file an icon.
- The outline is the language server's document outline: the element tree and
  the control blocks.

## Develop

```sh
npm install
npm run watch        # rebuild dist/extension.js on change
```

Press `F5` to start an Extension Development Host, or run the checks:

```sh
npm test             # typecheck and the TextMate grammar tokenizer test
npm run package      # build the VSIX
```
