# Trigger

A **trigger handle** — the value you get from the [`Triggers`](/api/triggers) service
(`Create`, `Get`, `GetAll`). Like [Player](/api/player) handles, it's a readonly table with
properties, signals, and methods.

## Properties

```luau
trigger.Id: number      -- entity id of the zone
trigger.Name: string
```

## Signals

All three fire with the [Player](/api/player) who triggered the zone, server-side.

### Touched

```luau
trigger.Touched: Signal<(player: Player)>
```

Fires when a player's bounding box **enters** the zone (edge-triggered — it won't spam every tick
while they stand inside, but fires again after they leave and come back).

### Attacked

```luau
trigger.Attacked: Signal<(player: Player)>
```

Fires when a player **left-clicks** the zone. The attack itself is always cancelled — nothing
takes damage.

### Interacted

```luau
trigger.Interacted: Signal<(player: Player)>
```

Fires when a player **right-clicks** the zone.

## Methods

### GetPosition / GetSize

```luau
trigger:GetPosition(): vector   -- center of the bottom face
trigger:GetSize(): vector
```

### SetPosition / SetSize

```luau
trigger:SetPosition(pos: vector | {x, y, z})
trigger:SetSize(size: vector | {x, y, z})
```

### Destroy

```luau
trigger:Destroy()
```

Removes the zone. Methods error after `Destroy` — drop the handle once you destroy it. (A
[studio-defined](/api/triggers#studio-triggers) trigger comes back on the next `/parallel reload`.)
