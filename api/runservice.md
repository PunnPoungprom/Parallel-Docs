# RunService

```luau
local RunService = game:GetService("RunService")
```

Available on **both sides**.

## Heartbeat

```luau
RunService.Heartbeat: Signal<(dt: number)>
```

Fires every game tick with the elapsed seconds since the previous tick (~0.05 at 20 TPS; larger
under lag).

```luau
RunService.Heartbeat:Connect(function(dt)
	-- per-tick gameplay logic
end)
```

## PreRender <Badge type="warning" text="client" />

```luau
RunService.PreRender: Signal<(dt: number)>
```

Fires every **render frame** (not tick) before the frame is drawn, with the elapsed seconds since the
previous frame. Client-only — it isn't present in server scripts. Use it for smooth, frame-rate
visuals (camera moves, interpolation) where `Heartbeat`'s 20/sec is too coarse.

```luau
-- client: smoothly ease the camera roll each frame
local Camera = game:GetService("CameraService")
local roll = 0
RunService.PreRender:Connect(function(dt)
	roll = roll + (targetRoll - roll) * math.min(1, dt * 10)
	Camera:SetRoll(roll)
end)
```

## IsServer

```luau
RunService:IsServer(): boolean
```

## IsClient

```luau
RunService:IsClient(): boolean
```

Handy in shared [modules](/api/require) that run on both sides:

```luau
if RunService:IsServer() then
	-- authoritative logic
else
	-- effects, prediction, UI
end
```
