# Code Watch

> Open source dependency and coverage reporting. Built with Remix.

## Reasoning

A number of providers offer free coverage or dependency status reporting for open source projects, but for private project, the pricing model is often prohibitive. The problem is often compounded further by a large team size.

Code Watch has the goal of providing an application which can be fully self hosted to allow for costs to scale with usage. For low amounts of usage, platforms like [Fly.io](https://fly.io) offer free Postgres instances.

## Development

From your terminal:

```sh
npm run dev
```

This starts code-watch development mode, rebuilding assets on file changes.

## Deploy

### Automatic

If you fork this repo the application and database will automatically deploy on [Fly.io](https://fly.io) through the [deploy workflow](/.github/workflows/deploy.yml) once `FLY_API_TOKEN` secret is set.

### Manual

#### Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

#### Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
