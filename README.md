<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Test [Nest](https://github.com/nestjs/nest) project, is using kyselyDB ORM. And uses yarn as package manager.

## Quick Start
```bash
$ yarn cmd initproject

$ yarn dev
```

## API Documentation

[Swagger UI](http://localhost:3000/docs/swagger#/)

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development & watch mode
$ yarn dev

# worker development & watch mode
$ yarn dev:worker

# production mode
$ yarn start
```

## Database Management
```bash
# sync db prisma with db.dbml
$ yarn db:sync

# run migrations
$ yarn db:up

# reseting all migration and run seed
$ yarn db:init
```

## Test

**WE WILL ONLY TEST .service.ts FILE**

Repository testing is turned off my default since we're using a typesafe orm. In my opinion its a waste of time to test repository. We let typescript handle our sql bug.

**Our test will not connect to DB by default**

**If you really want to test Repo (With DB)**

you can add this config into jest config in package.json to connect db in test. This will setup the db and run the default seed located in *src/core/db/seeds*. when writing use the util function *createRepoTestingModule*.
```json
"globalSetup": "<rootDir>/jest-global.setup.ts",
"globalTeardown": "<rootDir>/jest-global.teardown.ts",
```

I'm using package.json as config **Do not use jest.config.ts** it will cause bug with the repo setup.

**Running the test**

There're  2 types of test avaliable, unit and mutation. We don't care about test coverage score because it doesn't really help locate bug. But **WE DO CARE** about **mutation score** so in **pipeline CI please use mutation test**.

```bash
# unit tests
$ yarn test

# mutation test
$ yarn test:mutation
```

Report will be generate at *test-report/stryker.html* you can look at your issue and score there. threshold for coverage is set to **>70%**

## Writing custom cli

You can write your own cli command. NestjsCommander has already been setup. You can follow the pattern of this folder *src/cli*.

```bash
# running custom cli
$ yarn cli ${name}

# example
$ yarn cli users:seed
```


## Other useful command

```bash
# developing react email
$ yarn dev:email

# running repl
$ yarn repl
```
