# Code Watch

> Open source dependency and coverage reporting. Built with Remix.

## Reasoning

A number of providers offer free coverage or dependency status reporting for open source projects, but for private project, the pricing model is often prohibitive. The problem is often compounded further by a large team size.

Code Watch has the goal of providing an application which can be fully self hosted to allow for costs to scale with usage. For low amounts of usage, platforms like [Fly.io](https://fly.io) offer free Postgres instances.

## Features

- Tracking and displaying coverage results
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#creatememorysessionstorage)

### Planned

* Coverage threshold management with integration with Github's status API (to post status within)
* Listing/syncing repos based on Github Auth
* Coverage history graph

### System Features

- [Multi-region Fly app deployment](https://fly.io/docs/reference/scaling/) with [Docker](https://www.docker.com/)
- [Multi-region Fly PostgreSQL Cluster](https://fly.io/docs/getting-started/multi-region-databases/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#creatememorysessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

If you would like to run your own version of CodeWatch, please read [the run your own docs](./run_your_own.md)

## Credits

* [The Remix Blues Stack](https://repository-images.githubusercontent.com/4610126https://github.com/remix-run/blues-stack) - `npx create-remix@latest --template remix-run/blues-stack` was used to create this project and little was changed. Learn more about [Remix Stacks](https://remix.run/stacks).

