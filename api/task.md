# task

Roblox-style scheduling, available as a global in every script. Every script (and every signal
callback) runs as its own coroutine, so yielding never blocks the game or other scripts.

## task.wait

```luau
task.wait(seconds: number?): number
```

Yields for at least `seconds` of **real (wall-clock) time**, then returns the actual elapsed
seconds. Wake-ups happen on game ticks, so resolution is one tick (~50 ms at 20 TPS). With no
argument, waits one tick.

```luau
local elapsed = task.wait(1.5)
print("waited " .. elapsed .. "s")
```

::: tip wait vs waitTicks
`task.wait` follows real time — if the server lags, fewer ticks pass but the deadline stays the
same. `task.waitTicks` counts **exact game ticks** — under TPS drops it stretches with the game.
Use `waitTicks` for gameplay timing that must stay in step with the world (cooldowns, projectile
steps), and `wait` for real-time pacing (cutscenes, dialogue beats).
:::

## task.waitTicks

```luau
task.waitTicks(ticks: number?): number
```

Yields for exactly `ticks` game ticks, then returns the elapsed real-time seconds.

## task.spawn

```luau
task.spawn(f: (...) -> (), ...)
```

Runs `f(...)` immediately as a new script thread (executes up to its first yield before `spawn`
returns).

## task.defer

```luau
task.defer(f: (...) -> (), ...)
```

Like `spawn`, but the new thread starts on the next scheduler step instead of immediately.

## task.delay

```luau
task.delay(seconds: number, f: (...) -> (), ...)
```

Runs `f(...)` as a new thread after `seconds` of real time.

```luau
task.delay(3, function(msg)
	print(msg)
end, "three seconds later")
```
