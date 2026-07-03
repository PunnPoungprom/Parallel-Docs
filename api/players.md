# Players

```luau
local Players = game:GetService("Players")
```

Available on **both sides**.

## GetPlayers

```luau
Players:GetPlayers(): { Player }
```

Every player the server knows about. On the client this is the tab-list roster — it includes
players outside your render distance (their spatial getters return `nil`).

## LocalPlayer

```luau
Players.LocalPlayer: Player?
```

**Client-only.** Your own player handle as a property, Roblox-style. Resolved at access time, so
it's always current; `nil` when not in a world (or read from a server script).

```luau
local player = game:GetService("Players").LocalPlayer
```

## GetLocalPlayer

```luau
Players:GetLocalPlayer(): Player?
```

Same as [`LocalPlayer`](#localplayer) as a method; errors when called from a server script.

## PlayerAdded

```luau
Players.PlayerAdded: Signal<(player: Player)>
```

Fires when a player joins the **server** — on both sides. On the client this means "joined the
server" (tab-list change), not "entered render distance". It does not replay for players already
online when your script starts; enumerate those with `GetPlayers()`:

```luau
local function onPlayer(player)
	print(player.Name .. " is here")
end

for _, p in Players:GetPlayers() do onPlayer(p) end
Players.PlayerAdded:Connect(onPlayer)
```

## PlayerRemoving

```luau
Players.PlayerRemoving: Signal<(player: Player)>
```

Fires when a player leaves the server (both sides).

::: info
The `Player` values returned everywhere above are **player handles** — readonly tables with
position/health getters and server-only mutators. See the dedicated [Player](/api/player) page.
:::
