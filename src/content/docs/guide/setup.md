---
title: "Setup"
---

A `setup { … }` block holds Go declarations that only the file it was written
in can read. It is for small, pure helpers next to a page: a label formatter, a
derived value, a shared constant.

```goi
setup {
	import "strings"

	var name = "Kaan"

	func greet(n string) string {
		return "Hi, " + strings.TrimSpace(n)
	}
}

Window {
	Text { text: greet(name) }
}
```

The body is Go source. It may contain `import`, `const`, `var`, `type` and
`func` declarations. A package-level `:=` is not valid Go: write `var name =`
instead.

## Scope

- Every file has its own scope. A name in `Main.goi` is not visible in an
  imported fragment, and a fragment's names are not visible in the page that
  imports it.
- The scope belongs to the **source file**, not to one fragment instance. If the
  same fragment is used twice, both instances read the same declarations.
- A fragment previewed on its own runs its own setup, the same way `goicheck`
  and the editor preview do.

## Values and functions

A setup variable is an ordinary value in a property:

```goi
setup {
	var label = "Total"
	var count = 3
}

Text { text: label }
Text { text: formatf("%d items", count) }
```

A setup function is called with the same expression grammar as the rest of the
design. Numbers, strings, bools and lists cross the boundary the way they do for
a bridge handler; a function may return one value and an optional `error`.

```goi
setup {
	func price(total float64, tax float64) float64 {
		return total * (1 + tax)
	}
}

Text { text: formatf("%.2f", price(100, 0.2)) }
```

Setup functions are evaluated while the design is running. Keep them pure and
cheap: a property that reads a setup function is evaluated again on every
expression pass. They should not touch nodes, start goroutines or block.

## Events

A setup function may be an event handler. The design calls it by name, and its
return value is ignored:

```goi
setup {
	var count = 0

	func increase() { count++ }
	func decrease() { count-- }
}

Window {
	Column {
		Text { text: formatf("Count: %d", count) }
		Button { label: "+" onClick: increase() }
		Button { label: "-" onClick: decrease() }
	}
}
```

The functions run on the UI goroutine. Keep them short, and read their state
through an ordinary property expression; the next expression pass picks up the
new value.

## What setup cannot do

- Importing application packages is not supported yet: the interpreter has the
  Go standard library, not the app's module.
- Setup is not a sandbox. The standard library can read files and open network
  connections, so only load designs you trust.
- A setup variable is read-only from the design. A function may change its own
  variables, but the recommended shape is a pure function of its arguments.

## Hot reload

Editing a design reloads it and evaluates the setup blocks again. Setup
variables start from their initial values on every reload; keep state that must
survive in Go outside `Bind`, and push it into the design with `ui.SetData`.

A broken setup block stops the reload and leaves the last working page on
screen. The error names the `.goi` file and line.

## Tools

The language server parses each setup body with Go's parser, so a syntax error
gets a squiggle on the `.goi` line. Type errors and runtime failures are caught
when the app loads.

`goicheck` evaluates setup blocks, so `goicheck -layout` catches a block that
does not parse or a function that fails while the page is being checked.

Setup code is interpreted, not compiled into the app. `goi build` embeds the
interpreter with the design, so a packaged app needs no Go toolchain at runtime.
