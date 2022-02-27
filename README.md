# ProgWeb Project - Team LMNT

ProgWeb Project : Client and Server Side

## Project URL 

[ProgWebProject](https://github.com/SI5-QTYY-Web/si5-prog-web-project) : link to our
github repository

## Subject

<p style="text-align: center;"><img src="https://static.actu.fr/uploads/2020/06/capture-d-ecran-2020-06-27-a-141515.png" width="450"></p>


## Structure

- [client](web/packages/frontend/src): Client application (React, JSX, TypeScript).
- [server](web/packages/backend/src): Services (NestJS, TypeScript).
- [postman](postman): Postman collection.
- [deliverables](deliverables): Deliverables.


### Architecture 

The architecture is divided in 2 main parts : 
- The [frontend](web/packages/frontend)
- The [backend](web/packages/backend)

#### Frontend

Our project's frontend contains 5 packages containing the components and the logic of our frontend : 
- [components](web/packages/frontend/src/app/components) --> This folder contains all our components react it is divided into the following subfolders: 
  - chart : all the component of the chart page
  - favorite-stations : all the component of the user favorite stations part
  - left-menu : all the component of the left menu of the main page
  - map : all the component of the central map of the main page
  - nav-bar : the navBar component and the filter bar
  - pages : the main component of the different root pages 
- [const](web/packages/frontend/src/app/const) --> contains all constants, including url addresses to communicate with the backend  
- [context](web/packages/frontend/src/app/context) --> that folder contain all of our custom context used in the project  

#### Backend

Our project's backend contains 5 packages
- [authentication](web/packages/backend/src/app/authentication) --> that contains 
all the controllers/modules/services needed to setup the authentication  
- [dto](web/packages/backend/src/app/dto) --> contains all our dto :
data transfer object to communicate our data
- [favorite-station](web/packages/backend/src/app/favorite-station) --> contains the logic for managing a user's favorite stations  
- [schemas](web/packages/backend/src/app/schemas) --> folder that contains all the mongodb schema
- [station](web/packages/backend/src/app/station) --> contains all the logic for the management of the stations: recovery of data according to filters, detailed data of a station...  

## Requirements

- Install [Docker](https://docs.docker.com/engine/install/).
- Install [Docker Compose](https://docs.docker.com/compose/install/).
- Install [Node.js](https://nodejs.org/en/download/).
- Install [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Prepare the project

- Go to the project directory:

```bash
cd web/
```

- Install the dependencies:

```bash
npm install
```

## Run

### Prerequisites

- You must have install the dependencies as shown before with npm install.
- You must have start the database in order for the client and server to work properly

### Config
- To configurate a different database, you can change the environment database config on file `./web/packages/backend/src/environment.<prod or _>.ts`. In this file you can change DATABASE.

- You can change default port of the backend when you set PORT environment (`setenv` in linux).
- You can change the base host of the backend in the front in file `./web/packages/frontend/src/environment.<prod or _>.ts`.

### Default config
- default database host : `mongodb://admin:admin@127.0.0.1:27017/web`
- default backend url : `http://localhost:3333/api`  
This config work with the next commands part.
### Commands

- Start the database (in the web directory):

```bash
docker-compose up
```

- Start the client and the server (in the web directory):

```bash
npx nx run-many --all --target=serve
```

### Stop

- Stop the client and the server:

Simply press ctrl+C to stop the execution of the client and the server.

- Stop the database:

Press ctrl+C to stop the execution of the database and then use the following command to stop the 
docker container : 

```bash
docker-compose down
```

- To check if no container is still running

If you want to be sure no docker process is still running, you can check that up by running the
following command and visualize it:
```bash
docker ps -a
```
## Deploy
To generate the docker image of the backend run `npx nx run backend:deploy` this generate backend-web docker image.  
To build the frontend in production mode, run `npx nx run frontend:build:production` this generate the build code in `./web/dist/frontend`.  
You can do the same for the back to deploy without docker.

## Authors

This follows the following format : 

[NomEtudiant PrenomEtudiant](link to github page) : IdentifiantGithub

- [Larose Quentin](https://github.com/QuentinLarose) : QuentinLarose
- [Martin D'Escrienne Yann](https://github.com/Mentra20) : Mentra20
- [Nersissian Tigran](https://github.com/TIGRAN06) : TIGRAN06
- [Tognetti Yohann](https://github.com/Idrash) : Idrash
