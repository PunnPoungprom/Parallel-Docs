# RenderService <Badge type="warning" text="client" />

```luau
local Render = game:GetService("RenderService")
```

Client-side rendering toggles. Client-only; the first-person-body toggle resets on relog / script
reload (HUD visibility is a vanilla option and is left as the player set it).

## HUD

```luau
Render:SetHudVisible(visible: boolean?) -- false hides the whole HUD, exactly like F1
Render:IsHudVisible(): boolean
```

```luau
Render:SetHudVisible(false) -- clean screen for a cutscene
```

## First-person hand / arm

Customize the position, rotation, and visibility of the first-person arm and held item — per hand. The
`hand` argument is `"right"`/`"main"` or `"left"`/`"off"` (the main hand is the right arm by default).

```luau
Render:SetHandOffset(hand: string, offset: Vec3)              -- translate the arm/item (blocks)
Render:SetHandRotation(hand: string, x: number, y: number, z: number) -- rotate (degrees)
Render:SetHandVisible(hand: string, visible: boolean?)
Render:ResetHand(hand: string)                               -- back to vanilla
Render:SetHandIgnoreHud(enabled: boolean?)                   -- keep the hand when the HUD is hidden
Render:IsHandIgnoreHud(): boolean
```

::: warning Vanilla hides the hand with the HUD
When you turn the HUD off (`SetHudVisible(false)` or F1), vanilla also hides the first-person hand. If
you want a clean screen *and* your arm, turn on `SetHandIgnoreHud(true)` — the arm (the real player
model arm, with your offset/rotation applied) keeps rendering.
:::

## World-space model parts

Draw real player-model parts (with your skin) anywhere in the world, at a position + rotation you
control. This is independent of the vanilla hand and the HUD — render an arm, head, leg, or the whole
set, and place each one yourself.

```luau
Render:SetModelPart(id, part, position, rotation?, scale?, space?)
Render:RemoveModelPart(id)
Render:ClearModelParts()
```

- `id` — any string key; reuse it to update that part.
- `part` — `"head"`, `"body"`, `"right_arm"`, `"left_arm"`, `"right_leg"`, or `"left_leg"`.
- `position` — world coordinates, **or** (in `"view"` space) an offset from the camera: `x` right, `y` up,
  `z` forward.
- `rotation` — optional `{x, y, z}` (or vector) in degrees, applied Y→X→Z.
- `scale` — optional uniform scale (default 1).
- `space` — `"world"` (default) or `"view"`.

### View space (a smooth viewmodel arm)

Use `space = "view"` for a first-person arm. The part is placed relative to the **live camera at render
time**, so it's perfectly smooth (no jitter) and stays in front of you. Orientation is camera-relative,
so you set a *fixed* local rotation — no need to feed in camera yaw/pitch. Add your own spring/sway by
perturbing the offset and rotation you pass in each frame.

```luau
local Render = game:GetService("RenderService")
local RunService = game:GetService("RunService")

RunService.PreRender:Connect(function(dt)
	-- base offset (right, up, forward) + whatever your spring module returns
	local sway = mySpring:update(dt)   -- your module
	Render:SetModelPart("arm", "right_arm",
		{ x = 0.4 + sway.x, y = -0.4 + sway.y, z = 0.6 },
		{ x = -90, y = 0, z = 0 },     -- fixed local rotation (point forward; tweak to taste)
		1, "view")
end)
```

::: tip It's additive
Parts are drawn after entities each frame, so this can't break world rendering. Nothing shows until you
call `SetModelPart`; parts stay until `RemoveModelPart`/`ClearModelParts` (or relog).
:::

::: warning World space doesn't auto-follow
In `"world"` space the position is absolute — a part does not follow you; update it each frame if you
want that. For a first-person arm, prefer `"view"`. Uses your own skin (wide/slim auto-detected).
:::

The transform is applied to the vanilla first-person render of that hand, so it affects both the held
item and the bare arm. Offset is in view space (x right, y up, z toward you); rotations are applied
X→Y→Z in degrees.

```luau
-- raise and pull in the right arm (e.g. an aim-down-sights pose)
Render:SetHandOffset("right", { x = 0, y = -0.1, z = 0.1 })
Render:SetHandRotation("right", -25, 0, 0)

-- hide the off-hand entirely
Render:SetHandVisible("left", false)

-- restore
Render:ResetHand("right")
```

::: tip Animate it
Drive `SetHandOffset` / `SetHandRotation` from [`RunService.PreRender`](/api/runservice#prerender) for
smooth per-frame weapon sway, recoil, or ADS easing.
:::

## Item models

Draw an arbitrary item (a sword, a tool, any item id) at a position + rotation — the non-skin
counterpart of `SetModelPart`. Same `space` rules: `"view"` makes a first-person held item.

```luau
Render:SetItemModel(id, itemId, position, rotation?, scale?, space?)
Render:RemoveItemModel(id)
Render:ClearItemModels()
```

- `itemId` — e.g. `"minecraft:diamond_sword"` (errors on an unknown id).
- everything else matches [`SetModelPart`](#world-space-model-parts) (`"world"` default / `"view"`).

```luau
-- a sword held in first person, swaying from your spring module
RunService.PreRender:Connect(function(dt)
	local sway = mySpring:update(dt)
	Render:SetItemModel("weapon", "minecraft:diamond_sword",
		{ x = 0.5 + sway.x, y = -0.4 + sway.y, z = 0.7 },  -- right, up, forward
		{ x = 0, y = 45, z = 10 }, 1, "view")
end)
```

## Reading a part's world transform

```luau
Render:GetModelPartTransform(id): { Position: vector, Rotation: vector }?
```

Returns where a part/item (from `SetModelPart` **or** `SetItemModel`) was actually drawn in the world,
or `nil` if it isn't being drawn. This is the only way to get the world position of a `"view"`-space
part, since that position is computed at render time from the live camera.

```luau
local hand = Render:GetModelPartTransform("weapon")
if hand then
	-- hand.Position is the sword's world position this frame; anchor effects/ropes to it
end
```

::: warning One frame behind (view space)
For `"view"` parts the value reflects the **last** frame that was drawn (the world position only exists
at render time). For a rope/effect attached to a viewmodel this is imperceptible.
:::

## Lines & ropes

A general polyline primitive — feed it points and it draws a connected line. With `thickness` it
becomes a **camera-facing colored ribbon**, which is the foundation for ropes, beams, trails, lasers,
etc. You compute the shape (e.g. a catenary) in Luau; this just draws it.

```luau
Render:SetLine(id, points, options?)   -- points: { Vec3 } (>= 2)
Render:RemoveLine(id)
Render:ClearLines()
```

`options`:
- `color` — `{ r, g, b, a? }` in `0..1` (default white, opaque).
- `thickness` — width in blocks; omit (or `<= 0`) for a thin 1px line.
- `space` — `"world"` (default, absolute) or `"view"` (points are camera-relative: x right, y up, z forward).

```luau
-- a grappling rope from the held item to a raycast hit, as a sagging catenary
local World = game:GetService("World")
RunService.PreRender:Connect(function()
	local hand = Render:GetModelPartTransform("weapon")
	local hit = World:Raycast(player:GetEyePosition(), player:GetLookDirection(), 40)
	if not (hand and hit) then Render:RemoveLine("rope") return end

	local a, b = hand.Position, hit.Position
	local points = {}
	for i = 0, 16 do
		local t = i / 16
		local p = a + (b - a) * t
		local sag = math.sin(t * math.pi) * 0.6        -- droop in the middle
		points[#points + 1] = vector.create(p.x, p.y - sag, p.z)
	end
	Render:SetLine("rope", points, { color = { 0.4, 0.25, 0.1 }, thickness = 0.06 })
end)
```

::: tip It's additive (and unlit)
Lines and items draw after entities each frame, so they can't break world rendering. The ribbon is a
flat translucent color (no texture, no lighting yet). Nothing shows until you set it; it stays until
`RemoveLine`/`ClearLines` (or relog).
:::
