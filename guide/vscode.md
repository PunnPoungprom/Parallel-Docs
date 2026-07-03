# VS Code Setup

The repository ships with full IDE support for the Parallel Luau API — autocomplete, hover
signatures, and type checking.

## Install

1. Install the **Luau Language Server** extension (`johnnymorganz.luau-lsp`) — VS Code will
   recommend it automatically when you open the repo.
2. Open the repository folder. Any `.luau` file under `run/world/parallel/scripts/` gets full
   IntelliSense.

That's it — the wiring is already committed:

| File | Purpose |
| --- | --- |
| `parallel.d.luau` | Definition file mirroring the whole engine API |
| `.vscode/settings.json` | Points luau-lsp at the definitions, platform `standard` |
| `.luaurc` | `require` aliases (`@modules/`, `@bytenet`), nonstrict default |
| `run/world/parallel/scripts/.luaurc` | Strict mode for your scripts |

## Strict mode

Scripts under `run/world/parallel/scripts/` are checked in **strict** mode, which catches typo'd
methods (`player:GetPos()`), wrong argument types (`SetHealth("full")`), and invalid service names
at edit time. For scripts elsewhere, add `--!strict` as the first line.

## Checking from the command line

The same checks run headless with the [luau-lsp CLI](https://github.com/JohnnyMorganz/luau-lsp/releases):

```sh
luau-lsp analyze --platform=standard --definitions=parallel.d.luau \
  --base-luaurc=.luaurc run/world/parallel/scripts
```

Exit code 0 means clean.
