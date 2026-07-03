# CameraService <Badge type="warning" text="client" />

```luau
local Camera = game:GetService("CameraService")
```

The camera has two modes. **Default** (the normal mode) follows the player, and the *offset* methods
add shake/tilt/lean on top. **Scriptable** detaches the camera so you place it anywhere in the world
with `SetPosition`/`SetRotation` (a free / cutscene camera). Client-only; everything resets on relog /
script reload.

## Reads

```luau
Camera:GetPosition(): vector       -- world position
Camera:GetRotation(): vector       -- (pitch, yaw, 0) in degrees
Camera:GetLookDirection(): vector  -- unit look vector
Camera:GetFov(): number            -- last rendered field of view
Camera:GetViewBobbing(): boolean   -- is the walking head-bob on?
Camera:GetMode(): string           -- "scriptable" | "default"
```

## Scriptable (detached) camera

```luau
Camera:SetMode(mode: "scriptable" | "default")
Camera:SetPosition(pos: Vec3)                        -- absolute world position
Camera:SetRotation(yaw: number, pitch: number, roll: number?) -- absolute, degrees
```

In scriptable mode the camera sits at exactly the position/rotation you set and **ignores the player's
view** until you switch back to `"default"`. Yaw/pitch are Minecraft angles (yaw 0 = south, pitch −90 =
straight up, +90 = straight down).

```luau
-- a fixed overhead cutscene camera
local Camera = game:GetService("CameraService")
Camera:SetMode("scriptable")
Camera:SetPosition({ x = 0, y = 90, z = 0 })
Camera:SetRotation(0, 90, 0)   -- looking straight down

-- ... later, hand control back to the player
Camera:SetMode("default")
```

::: tip Orbit / move it over time
Update `SetPosition`/`SetRotation` from a [Heartbeat](/api/runservice) (or `task.wait` loop) to fly or
orbit the camera. The player keeps responding to input underneath — pair with
[`UserInputService:SetKeyCaptured`](/api/userinputservice#setkeycaptured) if you want to freeze them.
:::

## Default-mode offsets

These apply when the camera is following the player (`"default"` mode). Offsets are added on top of the
vanilla camera **every frame** — ideal for shake, tilt, lean, or a pulled-back view.

## Rotation

```luau
Camera:SetRotationOffset(yaw: number, pitch: number, roll: number?) -- degrees added to the camera
Camera:SetRoll(roll: number)  -- tilt only (vanilla can't do this)
Camera:ResetRotation()
```

```luau
-- a quick camera shake (client script)
local Camera = game:GetService("CameraService")
task.spawn(function()
	for i = 1, 6 do
		Camera:SetRotationOffset((math.random() - 0.5) * 4, (math.random() - 0.5) * 4, 0)
		task.wait(0.03)
	end
	Camera:ResetRotation()
end)
```

## Field of view

```luau
Camera:SetFov(fov: number?) -- override (degrees); nil restores vanilla
Camera:ResetFov()
```

## View bobbing

```luau
Camera:SetViewBobbing(enabled: boolean?)
Camera:GetViewBobbing(): boolean -- check whether it's currently on
```

## Position

```luau
Camera:SetPositionOffset(offset: Vec3?) -- world-space offset added to the camera; nil clears
```

```luau
Camera:SetPositionOffset({ x = 0, y = 1, z = 0 }) -- lift the view a block
Camera:SetPositionOffset(nil)                      -- back to normal
```

::: warning World-space
The position offset is in **world space** (not relative to where you're looking). It's applied by a
render mixin since Minecraft has no camera-position event.
:::
