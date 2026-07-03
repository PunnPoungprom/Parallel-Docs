# NetworkService

```luau
local NetworkService = game:GetService("NetworkService")
```

RemoteEvent-style messaging between the client and server Luau runtimes. Payloads are Luau
[`buffer`](https://luau.org/library#buffer-library)s only — pack and unpack your own data, or use
[ByteNet](/api/bytenet) for typed packets.

Method names are side-specific and **hard-checked**: calling a server method from a client script
(or vice versa) errors immediately.

## Client side

### FireServer

```luau
NetworkService:FireServer(channel: string, data: buffer)
```

Max **1 KiB** per message; see [quotas](#quotas-limits) below.

### OnClientEvent

```luau
NetworkService:OnClientEvent(channel: string, callback: (data: buffer) -> ())
```

## Server side

### OnServerEvent

```luau
NetworkService:OnServerEvent(channel: string, callback: (player: Player, data: buffer) -> ())
```

`player` is a full [player handle](/api/players#player-handles).

### FireClient

```luau
NetworkService:FireClient(player: Player, channel: string, data: buffer)
```

### FireAllClients

```luau
NetworkService:FireAllClients(channel: string, data: buffer)
```

Clientbound messages max **4 KiB**.

## Example

```luau
-- client
local buf = buffer.create(1)
buffer.writeu8(buf, 0, 42)
NetworkService:FireServer("ping", buf)

NetworkService:OnClientEvent("pong", function(data)
	print("server answered " .. buffer.readu8(data, 0))
end)
```

```luau
-- server
NetworkService:OnServerEvent("ping", function(player, data)
	local n = buffer.readu8(data, 0)
	local buf = buffer.create(1)
	buffer.writeu8(buf, 0, n + 1)
	NetworkService:FireClient(player, "pong", buf)
end)
```

## Quotas & limits

Serverbound traffic is untrusted and rate-limited per player (Figura-style):

| Limit | Value |
| --- | --- |
| Serverbound message size | 1 KiB |
| Clientbound message size | 4 KiB |
| Messages per second (per player) | 64 |
| Bytes per second (per player) | 16 KiB |
| Channel name | 1–64 characters |

Violations are **dropped** with a throttled warning in the server log — they don't error the
sender.

Messages to channels with no listeners are silently dropped, so reloading scripts never errors
in-flight senders.

::: tip
Listener callbacks run as scheduler threads — they may `task.wait` and call yielding APIs.
:::
