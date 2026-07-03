# Player

A **player handle** — the `Player` value you get from [`Players`](/api/players),
`PlayerAdded`/`PlayerRemoving`, `OnServerEvent`, or ByteNet listeners.

Handles are small readonly tables — `{ Name: string, UUID: string }` plus methods. They are plain
data: you can send them through [NetworkService](/api/networkservice) or [ByteNet](/api/bytenet)
unchanged. Every method re-resolves the live player by UUID at call time.

## Properties

```luau
player.Name: string
player.UUID: string
```

## Getters

Return `nil` when the player can't be resolved — offline, or (on the client) outside render
distance.

### GetPosition

```luau
player:GetPosition(): vector?
```

Feet position as a native Luau vector (`pos.x`, `pos.y`, `pos.z`).

### GetLookDirection

```luau
player:GetLookDirection(): vector?
```

Unit look vector.

### GetVelocity

```luau
player:GetVelocity(): vector?
```

### GetRotation

```luau
player:GetRotation(): vector?
```

`(pitch, yaw, 0)` in degrees.

### GetHealth / GetMaxHealth

```luau
player:GetHealth(): number?
player:GetMaxHealth(): number?
```

### GetEyePosition

```luau
player:GetEyePosition(): vector?
```

Eye-level position — a good ray origin for [`World:Raycast`](/api/world#raycast).

### IsAlive

```luau
player:IsAlive(): boolean
```

### GetHeldItem / GetItemInSlot

```luau
player:GetHeldItem(): ItemStack?              -- selected hotbar item
player:GetItemInSlot(slot: number): ItemStack?
```

Returns an [ItemStack](/api/itemstack) handle. Slots: `0`–`8` hotbar, `9`–`35` main, `36`–`39` armor,
`40` off-hand (or `-1` main hand, `-2` off hand).

### IsSneaking / IsSprinting

```luau
player:IsSneaking(): boolean?
player:IsSprinting(): boolean?
```

### IsOnline

```luau
player:IsOnline(): boolean
```

Never `nil` — on the client this checks the tab-list roster, so it works for players outside
render distance.

## Mutators <Badge type="warning" text="server" />

These error on the client, and error if the player has gone offline.

### SetHealth

```luau
player:SetHealth(health: number)
```

### Damage / Heal / Kill

```luau
player:Damage(amount: number) -- generic damage source
player:Heal(amount: number)
player:Kill()
```

### Teleport

```luau
player:Teleport(pos: vector | {x, y, z})
```

### SetVelocity / AddVelocity

```luau
player:SetVelocity(vel: vector | {x, y, z}) -- replace motion
player:AddVelocity(vel: vector | {x, y, z}) -- add to current motion
```

Synced to the client immediately — use for knockback:

```luau
-- server: simple knockback on hit
local dir = attacker:GetLookDirection()
if dir then
	victim:Damage(4)
	victim:AddVelocity({ x = dir.x * 1.5, y = 0.4, z = dir.z * 1.5 })
end
```

### GiveItem / SetItemInSlot <Badge type="warning" text="server" />

```luau
player:GiveItem(itemId: string, count: number?, data: { [string]: any }?)
player:SetItemInSlot(slot: number, itemId: string?, count: number?, data: { [string]: any }?) -- nil id clears
```

`data` becomes the item's `minecraft:custom_data` — the way to hand out tagged custom items:

```luau
player:GiveItem("minecraft:blaze_rod", 1, { kind = "fireStaff", mana = 10 })
```

## Animation

### LoadAnimation <Badge type="warning" text="client" />

```luau
player:LoadAnimation(name: string): AnimationTrack
```

Load a standalone animation from `<world>/parallel/animations/<name>.json` (authored by
right-clicking an actor in the Explorer → **Save animation…**; the server syncs the folder to every
client on join). Works on any player handle the client can see, but playback is **local to this
client** — use `PlayAnimation` from the server for everyone to see it. See
[AnimationTrack](/api/animationtrack) for playback and authoring details.

```luau
local track = game:GetService("Players").LocalPlayer:LoadAnimation("wave")
track:Play()
```

### PlayAnimation / StopAnimation <Badge type="warning" text="server" />

```luau
player:PlayAnimation(name: string)
player:StopAnimation(name: string?) -- no name = stop whatever is playing
```

The replicated form: every connected client plays (or stops) the animation on this player locally,
so **everyone sees it**. Uses the animation's own loop/timing; for per-track control (speed,
scrubbing) drive `LoadAnimation` on each client via [NetworkService](/api/networkservice) instead.

```luau
-- server: victory pose for whoever touches the goal
trigger.Touched:Connect(function(player)
	player:PlayAnimation("victory")
end)
```

::: tip Positions accept both forms
Anywhere the API takes a position, you can pass a native vector **or** an `{x, y, z}` table — so
[ByteNet's `vec3`](/api/bytenet) output plugs straight in.
:::
