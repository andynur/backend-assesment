# Back-End Assessment

## Instructions

Change .example.env to .env and fill the variables

```bash
# If you are using docker you dont have to change the DATABASE_URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lifepack_db?schema=public"
# Salt round
PASSWORD_SALT=10
# Random secure string
SESSION_SECRET=
```

### With Docker:

Build the docker container

```bash
yarn docker:dev
```

you can test the app on `localhost:8000` now

> Nest dont support pre-post script hooks (as far i know), so after you are done with `yarn docker:dev`, exit the process (ctrl + c) and run `yarn container:stop`

<br>

### locally:

> Need node 16, postgres and redis installed

Install dependencies

```bash
yarn or npm install
```

run prisma migration

```bash
prisma migrate dev // yarn docker:migrate
```

Run the app

```bash
yarn start:dev
```

## API Documentation

To view the project's API documentation, you can access it through Swagger in `localhost:8000/docs` url or Postman [Collection](https://documenter.getpostman.com/view/19148174/2s93m61MmT#5478e830-f360-466b-9fc2-f202d1c35332).

## Test (WIP)

My test methodology uses unit tests in core business rules and mocking the database and other dependencies calls, integration tests on almost everything, and the same goes for end-to-end tests.

unit test: `yarn test:watch`

integration test: `yarn test:int`

end to end test: `yarn test:end`

## Test Coverage

> needs Docker

run `yarn spec:cov`

just missing the end-to-end tests to get the coverage of the funcs

![coverage](./docs/coverage.png)

## ERD

build with [prisma-erd-generator](https://github.com/keonik/prisma-erd-generator)

![erd](./erd.svg)
