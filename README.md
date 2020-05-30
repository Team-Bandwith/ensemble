# ensemble

Ensemble is a social entertainment application where users can create and share songs with the world.

## Pre-requisites
Before you begin, be sure to have the following installed:

- Node v8.17.0 or higher
- PostgreSQL 12.2

## Project setup
Shell into your local postgreSQL database from the root of the repo and run:
```
CREATE DATABASE ensemble;
\c ensemble;
\i schema.sql;
```
## Installation Instructions:
```
npm install
```

### for development run:
```
npm run serve
```
then in another terminal run:
```
npm run start
```
### for production run:
```
npm run build
npm run start
```


### Lints and fixes files
```
npm run lint
```

The client will be visible on localhost:8080
You can test graphQL queries by going to localhost:8081/api
### Contributing to ensemble
See [Contribution Guidelines](https://github.com/Team-Bandwith/ensemble/blob/master/CONTRIBUTING.md).

### Contributors:
- Sean Hart
- Heather Haylett
- Jeremy Webber
- Matt Hritz
- Kenny Dang

### Github Project Road map:
See [Project Road map](https://github.com/Team-Bandwith/ensemble/projects/1).
