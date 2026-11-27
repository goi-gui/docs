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
- Every fragment **instance** gets its own copy of the fragment's setup state.
  Two `Counter {}` calls in one page therefore have two independent `count`
  values, not one shared value.
- That copy is lazy: instances that only read setup values share one
  interpreter, and pure functions run on it too. The first function that reads
  or writes a setup variable gives that instance a private interpreter. A
  counter does not pay for a private interpreter until its `inc()` runs.
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

## Bridge access

Setup code can read the design's bridge values and call its handlers. The
bridge block may declare a handler with the `func` spelling or as a method, and
a handler may return one value:

```goi
bridge {
	content string
	getFileName() string
	onSave(fileName string)
}

setup {
	import "fmt"

	func save() {
		name := bridge.getFileName()
		bridge.onSave(name)
		fmt.Println(bridge.content)
	}
}
```

`bridge.content` follows `ui.SetData`; the fields are refreshed when setup code
runs. A handler call uses the Go function registered with `ui.SetHandler`, and
its return value is available in setup. The handler still belongs to Go: setup
only calls it.

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

The language server parses and type-checks each setup body with Go's own parser
and checker. A syntax or type error gets a squiggle on the `.goi` line, setup
values and functions complete in property values, and Go names, local variables
and imported package members complete inside the body. Both editor extensions
highlight the body as Go: VS Code includes its Go grammar, and Zed injects the
Go parser into the block.

`goicheck` evaluates setup blocks, so `goicheck -layout` catches a block that
does not parse or a function that fails while the page is being checked.

Setup support is a build feature. `auto` in `runFlags` or `buildFlags` detects a
setup block and adds the `setup` tag; `all` includes it too. Without the tag a
core build reports that the design uses setup instead of treating its names as
literals.

Setup code is interpreted, not compiled into the app. `goi build` embeds the
interpreter with the design, so a packaged app needs no Go toolchain at runtime.
