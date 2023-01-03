# Svelte Chroma

This is just a passion project to slowly develop some Chroma based Svelte Components for me to develop POCs. Currently it is very much a work in progress and components will evolve over time. To be honest this is almost more of a POC playground at this point to test different interactions and models but the long term goal is that this transforms into a lib I can use in other POCs. Finally, this was a good opporunity to work with the latest SvelteKit and Edge capabilities to learn more about the usage and implementation. 

## Getting up and running

If you're seeing this, you've probably already done this step. Congrats!

```bash
# Install dependencies
npm install / pnpm install
```

## Developing

Once you've installed dependecies you can easily work in development mode

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

Currently this is setup for `adapter node` because of a node library (`sharp` is not edge compliant) used for trimming PNGs. However the goal is to write my own trimmming logic with a edge compliant implementation. 
