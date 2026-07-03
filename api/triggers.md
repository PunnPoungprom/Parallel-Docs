# Triggers <Badge type="warning" text="server" />

```luau
local Triggers = game:GetService("Triggers")
```

Invisible **trigger volumes** — like vanilla's `minecraft:interaction` entity, but with an
independent size on **every axis** (vanilla only has width/height with a square base), and with
signals instead of stat tracking. Use them to start cutscenes, dialogue, or combat events when a
player clicks or walks somewhere. The values this service returns are
[Trigger](/api/trigger) handles.

**Server-only.** The authoritative flow for a cutscene: the server trigger fires → you send that
player a message ([NetworkService](/api/networkservice) or [ByteNet](/api/bytenet)) → a client
script plays the scene.

Trigger zones are invisible (F3+B shows their hitbox), don't block movement, can't be hit by
projectiles, and are never saved as entities — they're respawned from your scripts and the studio
definitions on every run.

## Create

```luau
Triggers:Create(config: {
	Position: vector | {x, y, z},  -- required; center of the bottom face
	Size: vector | {x, y, z}?,     -- per-axis box size, default (1, 1, 1)
	Name: string?,                 -- optional label for logs / Get
}): Trigger
```

```luau
local door = Triggers:Create({
	Position = vector.create(10, 64, -3),
	Size = { x = 3, y = 2.5, z = 0.5 },   -- a flat wall across a doorway
	Name = "cutscene_door",
})
```

The box is feet-anchored: `Position` is the center of the bottom face, `Size.y` extends upward.

## Get

```luau
Triggers:Get(name: string): Trigger?
```

The trigger with that name, or `nil`. [Studio-defined triggers](#studio-triggers) win name ties
against script-created ones.

## GetAll

```luau
Triggers:GetAll(): { Trigger }
```

Every live trigger — studio-defined and script-created.

## Studio triggers

You can author triggers in the in-game editor instead of hardcoding coordinates: in the
**Explorer**, right-click **Game → Triggers → New Trigger (at my position)**. Each trigger has
draggable **Position** and **Size** (x, y, z) fields, plus *Move to my position*, *Rename* and
*Delete* in its context menu.

Definitions are saved to `<world>/parallel/triggers.json` and spawned **before your server scripts
run**, so scripts just fetch them:

```luau
-- server script: the zone was placed in the editor, no coordinates in code
local Triggers = game:GetService("Triggers")

local gate = Triggers:Get("station_gate")
if gate then
	gate.Touched:Connect(function(player)
		-- start the cutscene for this player
	end)
end
```

- **In singleplayer (studio)**, edits apply live: moving or resizing a trigger updates the world
  immediately, and existing handles/connections stay valid (same entity, same signals).
- Adding a *new* trigger spawns it live too, but a script that already ran won't know about it —
  run `/parallel reload` to re-run scripts so they can `Get` it.
- **On a dedicated server**, the server reads `triggers.json` from its world folder on start and on
  `/parallel reload`. (The client editor can't write the server's world folder — edit the file
  server-side, like server scripts.)

## Example: cutscene on approach

```luau
-- server script
local Triggers = game:GetService("Triggers")
local NetworkService = game:GetService("NetworkService")

local gate = Triggers:Get("station_gate")   -- placed in the studio

gate.Touched:Connect(function(player)
	NetworkService:FireClient(player, "play_scene", buffer.create(0))
end)
```

```luau
-- client script
local NetworkService = game:GetService("NetworkService")
local SceneService = game:GetService("SceneService")

NetworkService:OnClientEvent("play_scene", function()
	SceneService:Load("station_intro"):Play()
end)
```
