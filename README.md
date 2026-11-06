# goi docs

The documentation site for [goi](https://github.com/goi-gui/goi), built with
Docusaurus 3.

## Development

```sh
npm install
npm start      # dev server at http://localhost:3000/docs/
npm run build  # static output in build/
```

## Content

Everything under `docs/` is the site. The pages are also the reference the
framework's tests read: `internal/schema` validates the `.goi` examples in
`docs/syntax.md` and `docs/components/*.md` when this checkout sits next to the
goi one, so keep the code blocks copy-pasteable.

- `docs/intro.md` — landing page.
- `docs/syntax.md` — the language reference.
- `docs/guide/` — conditionals, loops, bridge and fragments.
- `docs/components.md` and `docs/components/*.md` — one page per element.
- `docs/icons.md` — every Material Symbols name the embedded font has.
- `docs/system/` — file dialogs, notifications and keyboard input.
- `docs/ide-extensions/zed.md` — the Zed extension.

The sidebar is explicit in `sidebars.js` because the component pages are grouped
by purpose, not by folder.

`docs/icons.md` is generated from the font that ships in goi. Regenerate it with
the list from `internal/text.IconNames` when that font changes; the page must
stay in sync with what the renderer can draw.
