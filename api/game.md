# game

The root of the engine API, available as a global in every script.

## GetService

```luau
game:GetService(name: string): Service
```

Returns one of the engine services. Erroring on unknown names, valid services are:

| Service | Sides | Purpose |
| --- | --- | --- |
| [`RunService`](/api/runservice) | both | Side queries, per-tick `Heartbeat` |
| [`Players`](/api/players) | both | Player enumeration, join/leave signals |
| [`World`](/api/world) | both | Block/time queries, server-side world effects |
| [`NetworkService`](/api/networkservice) | both | RemoteEvent-style client ↔ server messaging |
| [`Triggers`](/api/triggers) | server | Invisible trigger volumes (click/touch signals) |
| [`SceneService`](/api/sceneservice) | client | Load and drive cinematic scenes |
| [`DialogueService`](/api/dialogueservice) | client | Blocking dialogue (Say / Ask) |

```luau
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
```

Client-only services error when called from a server script — even in singleplayer, where both
runtimes share one JVM.
