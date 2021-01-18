# OpenNPS

Open NPS is a open source project to create and collect NPS surveys. The project includes:

- API
  - Register Survey
  - Conclude Survey
  - CRUD for Targets
  - CRUD for Configs
- Visual
  - Mobile Friendly and benchmark based views
  - Customizable interfaces using Material UI configurations
  - Easy to integrate via iFrame or by source in projects using Next/React

## How Run

Download and Enter in Folder

```
  git clone git@github.com:guidiego/open-nps.git
  cd open-nps
```

With Docker

```
  docker-compose up
```

Without Docker:

```
  MONGO_URL=you_url_here yarn dev
```

> Require a mongo local running (or a visible instance using Atlas or other cloud)
> You can use `docker-compose up mongo` to init only the mongo instance

## Deploy

We will add more infos here, right now you have an image on Dockerhub, fell free to use it :)
[opennps/opennps](https://hub.docker.com/repository/docker/opennps/opennps)
