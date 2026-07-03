# os

A small, sandbox-safe subset of Luau's `os` library (no process or file access). Available on both
sides.

```luau
os.clock(): number    -- monotonic high-resolution seconds, for measuring elapsed time
os.time(): number     -- current Unix time in whole seconds
os.difftime(t2, t1): number -- t2 - t1
```

## Run something once per second

`os.clock()` is monotonic, so it's ideal for throttling work inside a
[Heartbeat](/api/runservice):

```luau
local RunService = game:GetService("RunService")

local last = os.clock()
RunService.Heartbeat:Connect(function()
	if os.clock() - last >= 1 then
		last = os.clock()
		-- runs about once per second
	end
end)
```

::: tip Prefer `os.clock` for intervals
Use `os.clock()` (monotonic) for measuring elapsed time and `os.time()` (wall clock) for actual
dates/timestamps. For exact game-tick timing, [`task.waitTicks`](/api/task) is also an option.
:::
