

## quick start

```sh
npm install
npm run dev
```

This app uses `bunyan` for logging, log can be piped to
bunyan tool:

```sh
npm run dev | ./node_modules/.bin/bunyan
```



- root url: `localhost:3000`

### initialize database

```sh
./node_modules/.bin/knex migrate:latest
./node_modules/.bin/knex seed:run
```


- healthcheck url: `localhost:3000/health`


## health check

Health check is via [`healthcheck-basic`](./healthcheck-basic.js) middleware.
It takes in a `healthy` callback and a list of health indicators to joinly vote
'UP', 'DOWN', or 'WARN'.


## logging

Use `bunyan`(https://www.npmjs.com/package/bunyan) for logging.


## project bootstrap

tutorial ref: 
https://medium.com/@MajikMan/starting-a-node-project-from-scratch-with-sqlite3-knex-and-express-fb4b765aca


```sh
# use -y to skip interactive input
npm init -y
```

```sh
# the -D flag installs it as a dev dependency
npm install -D nodemon 
```

```sh
npm install express sqlite3 knex
npm install objection

npm install morgan
npm install body-parser
npm install cors

npm install bunyan
```

Use knex init to bootstrap db configuraiton
```sh
./node_modules/.bin/knex init
# => Created ./knexfile.js
```

Create first migration file:
```sh
./node_modules/.bin/knex migrate:make initial
```

Fill DDL in migration file `db/<timestamp>_initial.js`.
Then run migration to initialize schema:
```sh
./node_modules/.bin/knex migrate:latest 
```

Create a second migration file to add additional column:
```sh
node_modules/.bin/knex migrate:make add-publisher
```

Fill DDL in migration file `db/<timestamp>_add-publisher.js`.
Then run migration again to update schema:
```sh
./node_modules/.bin/knex migrate:latest 
```

Create seed script:
```sh
./node_modules/.bin/knex seed:make todos
```
Note seed file is env specific, fill DML in seed file `db/seeds/dev/todos.js`.

Run seed file:
```sh
./node_modules/.bin/knex seed:run
```





#### healthcheck

Healthcheck middleware is based on https://github.com/lennym/express-healthcheck.
