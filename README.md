<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) project, is using primsa & kyselyDB ORM. Yarn as package manager. This project is design to run as 2 entry point **main(api)** **worker(process task)**. Steps to perform deploy will is in Note section.

## Quick Start
```bash
# Stop all running docker (incase conflicting port)
$ docker stop $(docker ps -q)

$ yarn cmd initproject

$ yarn dev
```

## API Documentation

[Swagger UI](http://localhost:3000/docs/swagger/)

[Bullboard](http://localhost:3000/docs/queues/)

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


## Note

### Error communication using KEY
  #### WE WILL ONLY THROW ERROR ON HANDLER
  - we utilize the library [neverthrow](https://github.com/supermacro/neverthrow) to handle this use case.
  - each function that can cause error will instead return an **Res OBJECT** object that contains error information. Example users.v1.service.ts:
  ```ts
  // _validateUser can cause error so we check
  // if isErr() we then return with the KEY 'validation'
  const r = await this._validateUser(body, id);
  if (r.isErr()) {
    return Err('validation', r.error);
  }

  // getOneUser can return null value
  // the api need to be error if user is not found
  // so we return with the KEY 'notFound'
  let user = await this.repo.getOneUser(id);
  if (!user) {
    return Err('notFound');
  }
  ```
  - then we perform check inside the handler and return httpcode based on our error key
  ```ts
  const r = await this.service.putUserDetails(body, id);

  return r.match(
    () => ({
      success: true,
      key: '',
      data: {},
    }),
    (e) => {
      // If KEY notFound api 400
      if (errIs(e, 'notFound')) {
        throw new ApiException(e, 400);
      }

      // If KEY validation api 400
      if (errIs(e, 'validation')) {
        throw new ApiException(e, 400);
      }

      // else api 500
      throw new ApiException(e, 500);
    },
  );
  ```
  - Note that frontend will also receive the same key and they will continue their UI logic using the key
  - If you want to change the key when responding to frontend you can override it
  ```ts
  if (errIs(e, 'notFound')) {
    // Override with key 'users-not-found'
    throw new ApiException(e, 400, 'users-not-found');
  }
  ```

### DB setup
- all db setup is inside [db.provider](src/core/db/db.provider.ts) you can uncomment and add database replicas there

### DB transaction management

- I've already setup the repo to have a transaction method, you only need to wrap other repo functionality inside the callback

```ts
// Example from users.v1.service.ts
await this.repo.transaction(async () => {
  // this is inside transaction
  await this.repo.updateUser(user);
});
```
- **Make sure that every write/read chain operation is inside transaction**
- **Make sure to await every method called inside transaction, or it will release before operation complete**
- I've wrapped operation inside transaction with try catch that will return a [**Res OBJECT**](#error-communication-using-key)
- Note: When using read replicas every operation inside transaction (even read) will be performed on the main DB. So make sure that read performed after write is inside transaction.

### Adding Queues & Tasks
- To add new queue go into [core/queue](src/core/queue) and create a new folder following the pattern of [users folder](src/core/queue/users)
- Then define your queue inside [worker.queue.ts](src/core/shared/worker/worker.queue.ts)
- To add task go to [task folder](src/task) and create using the same pattern as [users task folder](src/task/users)
- **IMPORTANT** make sure to link your task with queue inside your new module
```ts
// Link users queue with UsersTaskHandler
createTaskHandler(QUEUE.users, UsersTaskHandler)
```

### Using Helpers
- The meaing of [Helper Folder](src/helper) is to create a service that allow shared service functionality that can be used across different module.
- **IMPORTANT** Helper is designed to not have any dependency **SO DON'T IMPORT OTHER HELPER INTO IT**.
- I would also encourage dev to make helper function do only 1 thing (if possible). Meaning it only does 1 logic so function will be quite short, it will be easier to test and dedug.
- Example: EmailHelperService send function only send email and do nothing else
```ts
async send(
  email: string,
  subject: string,
  template: React.JSX.Element,
): Promise<Res<null, 'failSend'>> {
  try {
    await this._sendMail(email, subject, template);

    return Ok(null);
  } catch (e: any) {
    return Err('failSend', { context: { message: e.message } });
  }
}
```

- Example: using the EmailHelperService inside users.v1.module
```ts
@Module({
  // Import the EmailHelperModule first
  imports: [EmailHelperModule],
  providers: [UsersV1Service, UsersV1Repo],
  controllers: [UsersV1HttpController],
})
export class UsersV1Module {}
```
```ts
export class UsersV1Service {
  constructor(
    private repo: UsersV1Repo,
    private usersQueueService: UsersQueueService,
    // Then use the service inside
    private emailHelperService: EmailHelperService,
  ) {}
}
```

### Writing pure function
- I would like to encourage dev to make their function pure (if possible based on project). Meaning the function doesn't modify any object outside of it, only recieve argument and return response.
- Example
```ts
// This function doesn't modify the user object
// It clone argument into new object then modify the cloned object
// leaving the original object untouched.
private _updateUser(user: Users, data: UpdateUserData): Users {
  user = clone(user);

  if (data.email) {
    user.email = data.email;
  }

  if (data.password) {
    user.password = hashString(data.password);
  }

  user.updatedAt = tzDayjs().toDate();

  return user;
}
```
- This can be a bit of a hassle ofcourse, so if not possible or timeline is tight you don't have to do it.

### CI work flow
  - devops don't need to know about how to run test for our project so we have a script to handle that they just need to execute it.
  - devops to create a **SETUP pipeline** as shown here
    - steps (after open PR):
      - ./scripts/setup.sh merge
    - steps (before build):
      - ./scripts/setup.sh build
  - **IMPORTANT** on build step devops need to create .env file from repo env
    - echo $REPO_ENV > .env

  - **Bonus**: Integrating dbml with CI pipeline
    - there's an auto generated [dbml file](schema.dbml) inside your repo. I've integrate this with prisma migration. We can use this to generate [dbdocs](https://dbdocs.io/).
    - you can see inside [setup.sh](scripts/setup.sh) there's a function called _dbdoc() inside the build step.
    ```bash
    function build() {
        yarn
        yarn test:mutation
        # _dbdoc
    }
    ```
    - to use it and integrate your schema with [dbdocs](https://dbdocs.io/) just add $DBDOCS_TOKEN into your repo env
    - more info on how to get the token at [dbdocs ci integration](https://docs.dbdocs.io/features/ci-integration)

### CD (deployment) workflow
  - As said above our project is designed to be run as 2 app (api, worker) and we will also need to handle db migration, so we will follow these steps.
  #### 1. Handling server database migration
  - database migration is avaliable inside the image using command:
  ```bash
  # migrate DB
  $ docker run $image db:deploy
  ```
  - devops need to create a pipeline to handle DB migration before deploying the application
    - cicd workflow: **setup** -> **build** -> **deploy DB** -> **deploy app**
  #### 2. Deploying application
  - after image has been build and DB has been deployed the image need to be run with the following command (start api,worker)
  ```bash
  # run main app
  $ docker run $image start

  # run worker
  $ docker run $image start:worker
  ```
  #### Tradeoffs
  - when performing cicd this way there will be an application downtime tradeoff. After deploy DB pipeline finished. The feature that perform query on changed schema will break. (around 2-3mins depend on pipeline speed)
  - there's 2 ways to handle this issue:
    1. **Recommend** report client and everyone to stop using app before deploying.
    2. **If 1. option is really not avaliable** we need to handle migration script to allow backward compatability. Meaning you don't touch the column that old version uses.
        - example: if we want to rename column
          - first deploy changes that add new column (name that you want to change to)
          - new app will be deploy with the new column
          - then deploy again with the removed old column