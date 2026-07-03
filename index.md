---
layout: home

hero:
  name: Parallel
  text: Luau scripting for Minecraft
  tagline: A Roblox-Studio-inspired engine layer — global scripts, cinematic scenes, typed networking. Multiplayer-first.
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/game

features:
  - title: Roblox-style runtime
    details: game:GetService, signals with Connect/Once/Wait, and the task library (wait, spawn, defer, delay) — every script runs as its own coroutine, errors stay isolated.
  - title: Multiplayer-first
    details: Scripts live on the server inside the world folder. Client scripts are synced to joining players automatically — players only install the mod.
  - title: Typed networking
    details: Buffer-only RemoteEvents with server-side quotas, plus @bytenet — typed packets with structs, arrays and vec3s, batched per tick.
  - title: Scenes & dialogue
    details: Load and play cinematic scenes from Luau, react to timeline markers, and write branching dialogue that yields until the player answers.
---
