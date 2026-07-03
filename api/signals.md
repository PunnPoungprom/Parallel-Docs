# Signals

Engine events use Roblox-style signal objects: `RunService.Heartbeat`, `Players.PlayerAdded`,
`SceneService.Completed`, and so on.

## Connect

```luau
signal:Connect(callback): Connection
```

Calls `callback` every time the signal fires. Each invocation runs as its **own scheduler thread**,
so callbacks may yield (`task.wait`, `DialogueService:Say`, ...) without blocking other listeners.

```luau
local RunService = game:GetService("RunService")

local conn = RunService.Heartbeat:Connect(function(dt)
	-- every game tick; dt is the elapsed seconds since the last tick
end)
```

## Once

```luau
signal:Once(callback): Connection
```

Like `Connect`, but disconnects automatically after the first fire.

## Wait

```luau
signal:Wait(): ...
```

Yields the calling script until the signal fires, then returns the signal's arguments.

```luau
local SceneService = game:GetService("SceneService")
SceneService:Load("intro"):Play()
local sceneName = SceneService.Completed:Wait()
```

## Disconnect

```luau
connection:Disconnect()
```

Stops the listener. Connections also die naturally when the script environment restarts.

::: warning Lifetime
Signals and connections belong to the current Luau environment. After `/parallel reload` (or a
relog on the client) the environment restarts and scripts re-run — re-connect in the script body,
which happens naturally if you connect at the top level.
:::
