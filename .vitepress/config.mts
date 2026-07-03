import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Parallel',
  description: 'Luau scripting for the Parallel Minecraft engine',
  base: '/Parallel/',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/game' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'VS Code Setup', link: '/guide/vscode' },
        ],
      },
      {
        text: 'Globals',
        items: [
          { text: 'game', link: '/api/game' },
          { text: 'task', link: '/api/task' },
          { text: 'os', link: '/api/os' },
          { text: 'require', link: '/api/require' },
        ],
      },
      {
        text: 'Services',
        items: [
          { text: 'RunService', link: '/api/runservice' },
          { text: 'Players', link: '/api/players' },
          { text: 'World', link: '/api/world' },
          { text: 'NetworkService', link: '/api/networkservice' },
          { text: 'Triggers', link: '/api/triggers' },
          { text: 'SceneService', link: '/api/sceneservice' },
          { text: 'DialogueService', link: '/api/dialogueservice' },
          { text: 'DataService', link: '/api/dataservice' },
          { text: 'UserInputService', link: '/api/userinputservice' },
          { text: 'ItemService', link: '/api/itemservice' },
          { text: 'CameraService', link: '/api/cameraservice' },
          { text: 'Lighting', link: '/api/lighting' },
          { text: 'GuiService', link: '/api/guiservice' },
          { text: 'RenderService', link: '/api/renderservice' },
          { text: 'FiguraService', link: '/api/figuraservice' },
          { text: 'DebrisService', link: '/api/debrisservice' },
          { text: 'RagdollService', link: '/api/ragdollservice' },
        ],
      },
      {
        text: 'Objects',
        items: [
          { text: 'Player', link: '/api/player' },
          { text: 'GuiElement', link: '/api/guielement' },
          { text: 'AnimationTrack', link: '/api/animationtrack' },
          { text: 'EntityHandle', link: '/api/entityhandle' },
          { text: 'ItemStack', link: '/api/itemstack' },
          { text: 'Trigger', link: '/api/trigger' },
          { text: 'Signal', link: '/api/signals' },
        ],
      },
      {
        text: 'Libraries',
        items: [
          { text: 'ByteNet (@bytenet)', link: '/api/bytenet' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: 'deep',
  },
})
