# Getting Started

Parallel embeds a [Luau](https://luau.org/) runtime in Minecraft (NeoForge 1.21.1). Scripts use a
Roblox-style API: `game:GetService(...)`, signals, and the `task` library.

## Script scopes

There are three places a script can live:

| Scope | Where | Runs |
| --- | --- | --- |
| **Server scripts** | `<world>/parallel/scripts/server/*.luau` | On the dedicated/integrated server, autorun on world load |
| **Client scripts** | `<world>/parallel/scripts/client/*.luau` | Synced to every joining player and run on their client |
| **Scene scripts** | Stored inside a scene's `.json` document | On the client, started by `Play()`, killed by `Stop()` |

Players never install script files — client scripts are stored on the server and shipped over the
network on join and on `/parallel reload`.

There are also **modules** (`<world>/parallel/scripts/modules/*.luau`) — shared libraries loaded with
[`require`](/api/require) from both sides.

## Your first script

Create `<world>/parallel/scripts/server/hello.luau`:

```luau
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
	print("Welcome, " .. player.Name .. "!")
	task.wait(2)
	local pos = player:GetPosition()
	if pos then
		print(player.Name .. " is at " .. tostring(pos))
	end
end)
```

It runs automatically on the next world load, or immediately after `/parallel reload`.

## Disabling a script

Put this pragma on the **first line** to exclude a script from autorun and join-sync without
deleting it:

```luau
--!disabled
```

The in-game Explorer shows this as an enabled-checkbox next to each script.

## Reloading

`/parallel reload` (permission level 2) restarts the server Luau environment, re-runs every enabled
server script, and re-syncs client scripts to all connected players (their client environments
restart too).

## Error isolation

Every script runs as its own coroutine. A runtime error kills only that script — everything else
keeps running. Errors are printed to the server log (server scripts) or the editor's Output window
and client log (client scripts).

## The editor

The ImGui editor (open from the pause menu) gives you a Roblox-style Explorer over all scripts and
the open scene, a tabbed script editor (Ctrl+S to save), and a multi-actor + camera timeline for
cinematic scenes.
