# FiguraService <Badge type="tip" text="server" /> <Badge type="warning" text="client" />

```luau
local Figura = game:GetService("FiguraService")
```

Bridge to [Figura](https://figuramc.org). Two independent feature sets:

1. **Additive model "rigs" (layers)** — render extra Figura avatars *on top of* a player/entity's own
   avatar (theirs keeps rendering). Driven from **server** scripts (visible to everyone) **or** **client**
   scripts (visible only locally).
2. **Local avatar call-bridge** — call a function inside an avatar's script and get a value back.

Figura is an **optional, client-only dependency**. Layers render for players who have Figura; the
call-bridge no-ops without it. Everything fails soft (`nil`/`false`).

## Rigs: render a model on top of a player/entity

### 1. Put the model in a `parallel/figura` folder

A model named `wings` is either:

- a folder `parallel/figura/wings/` — a **normal Figura avatar directory** (`.bbmodel`, `.lua`, `.png`,
  `.ogg`, `avatar.json`), exactly what BlockBench/Figura produce; or
- a single file `parallel/figura/wings.nbt` — a **prebuilt** Figura avatar (loads fastest, no parsing).

**Server** scripts read from the world's folder `<world>/parallel/figura/` (bytes are shipped to clients
automatically). **Client** scripts read from the game's own folder `<gameDir>/parallel/figura/`, and if
the model isn't there they **request it from the server** — so a client layer can use a server-stored
model without the file existing locally.

### 2. Add it as a layer

Layers stack and are keyed by model name; the target's own avatar keeps rendering underneath.

```luau
-- SERVER script: everyone who can see the player sees the wings, posed to their body
local Figura = game:GetService("FiguraService")

game:GetService("Players").PlayerAdded:Connect(function(player)
    Figura:AddModel(player, "wings")
end)

-- later
Figura:RemoveModel(player, "wings")   -- removes just that layer
Figura:ClearModels(player)            -- removes all layers
```

```luau
-- CLIENT script: a personal cosmetic only you see (read from <gameDir>/parallel/figura/)
local Figura = game:GetService("FiguraService")
Figura:AddModel(game:GetService("Players"):GetLocalPlayer(), "halo")
```

::: tip Layers vs. the player's avatar
A layer is a separate avatar drawn at the same point Figura draws the player's own avatar, so it follows
the player's pose/animation. It does **not** replace the player's avatar. First-person hands aren't
layered yet — layers render in third person (on the body) for now.
:::

::: tip Survives relogs (within a session)
Server layers are kept in memory and re-synced when a player starts seeing the target or rejoins. No
cross-restart persistence yet.
:::

## The local call-bridge (client scripts)

Figura's event set is fixed (you can't add `events.parallel`), so the bridge calls a global dispatch
function you define in the avatar, by name.

In the avatar's `.lua`:

```lua
function ParallelReceive(id, ...)
    if id == "flap" then wings_open = true return true end
end
```

In a Parallel **client** script:

```luau
local Figura = game:GetService("FiguraService")

-- the local player's OWN avatar:
if Figura:HasAvatar() then print(Figura:Send("greet", "Bob")) end

-- a specific layer on someone (a rig you added):
local h = Figura:GetModel(player, "wings")
if h then h:Send("flap") end

-- a visible player's own avatar:
local own = Figura:GetAvatar(player)
if own then print(own:Send("greet", "Bob")) end
```

`GetModel`/`GetAvatar` return `nil` until the avatar/layer is actually loaded on this client (a server
layer is shipped + parsed asynchronously). Only **`nil`, booleans, numbers, strings, and (nested) tables**
cross the bridge — the same value rules as [`DataService`](/api/dataservice). Because avatar scripts run
on clients, `Send`/`GetModel`/`GetAvatar` are **client-only**.

## API

```luau
-- server or client scripts
Figura:AddModel(target: PlayerHandle | EntityHandle, model: string): boolean
Figura:RemoveModel(target: PlayerHandle | EntityHandle, model: string): boolean
Figura:ClearModels(target: PlayerHandle | EntityHandle): ()
Figura:ListModels(target: PlayerHandle | EntityHandle): { string }   -- layers on the target
Figura:HasModel(target: PlayerHandle | EntityHandle, model: string): boolean
Figura:ListAvailable(): { string }                                   -- models available on this side

-- client scripts
Figura:Send(id: string, ...: any): ...any
Figura:HasAvatar(): boolean
Figura:GetAvatar(target: PlayerHandle | EntityHandle): FiguraAvatarHandle?
Figura:GetModel(target: PlayerHandle | EntityHandle, model: string): FiguraAvatarHandle?
handle:Send(id: string, ...: any): ...any
handle:HasAvatar(): boolean

-- either side
Figura:IsAvailable(): boolean
```

- **`AddModel(target, model)`** — layer a model on the target. *Server* = visible to everyone (model from
  the world folder); *client* = local-only (model from the game folder, or requested from the server if it
  isn't local). Server returns `false` if no such model; client returns whether the attempt started.
- **`RemoveModel` / `ClearModels`** — remove one / all layers.
- **`ListModels(target)`** — model names currently layered on the target. **`HasModel(target, model)`** —
  whether that layer is present. **`ListAvailable()`** — models available to `AddModel` on this side.
- **`Send(id, ...)`** — call the local player's own avatar's `ParallelReceive`. *Client-only.*
- **`GetAvatar(target)` / `GetModel(target, model)`** — a `FiguraAvatarHandle` to a target's own avatar /
  a specific layer (or `nil`). `handle:Send` / `handle:HasAvatar` operate on it. *Client-only.*
- **`IsAvailable()`** — whether the Figura mod is installed.

::: warning Caveats
- **Server has no Figura.** It only forwards bytes; parsing/rendering is client-side. A folder model is
  parsed asynchronously, so a freshly added layer may appear a moment later.
- **No packet chunking yet** — keep individual model files under ~1 MiB (the `.nbt` form keeps a model to
  one small file).
- First-person hand layers are not implemented yet (third-person body overlay only).
:::
