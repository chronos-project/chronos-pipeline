![chronos-logo](https://i.imgur.com/yWR0afJ.png)

[![chronos](https://img.shields.io/badge/chronos-%F0%9F%95%B0-blue.svg)](https://chronos-project.github.io)
![chronos version](https://img.shields.io/badge/version-0.9.0--beta-orange.svg)
![license](https://img.shields.io/badge/license-MIT-green.svg)
## Overview
Chronos is an event-capturing framework for greenfield applications and is built with NodeJS, Apache Kafka, TimescaleDB, and PipelineDB. This repository contians the data pipeline itself that is set up on a host server to store your event data for further analysis. Data can then be visualized using Grafana. You can read about our story of creating Chronos [here](https://chronos-project.github.io/casestudy.html).

## Chronos CLI
Chronos comes with a CLI to make installing and running the pipeline easier for developers. You must have [NodeJS](https://nodejs.org/en/) as well as [npm](https://www.npmjs.com/) installed in order to use the CLI.

If you wish to add Chronos to your path, from the root directory of the repository run `./setup.sh`. This will add the `bin` directory which contains the `chronos` executable to your path via your `.bashrc` file (which also means that `chronos` assumes that `.bashrc` will be sourced). If you don't want to add `chronos` to your path, from the root directory of the repository you can run all the commands by first entering `bin/chronos`.

The CLI supports the following commands:

Command | Description
------- | -----------
`start [service]` | Starts either Chronos or a specified service
`stop [service]` | Stops either Chronos or a specified service
`log (service)` | Prints the logs of a service to the terminal
`status` | Prints the status of the services to the terminal
`install-kafka` | Installs the `events` topic used by the Kafka brokers
`install-pipeline` | Sets up the `chronos_pl` database used by PipelineDB

## Installation
Chronos is currently deployed only through [Docker](https://docs.docker.com/install/), which thus must be installed on the host machine. In addition, the host machine must also have [Docker Compose](https://docs.docker.com/compose/install/) installed in order to run the `docker-compose.yml` file which orchestrates the setup.

To begin installing the Chronos pipeline, first clone the `master` branch of this repository. Then use `docker-compose pull` to pull the required images. You may then either finish the installation by using the Chronos CLI or with Docker.

### Chronos CLI
To finish the installation with the CLI, just run `chronos install-kafka` and `chronos install-pipeline`. Once that's done, Chronos should be installed.

### Docker
To finish the installation with Docker, you must first boot up Zookeeper and all 3 Kafka brokers in order to set up the `events` topic. This is most easily done by running the following:
```
docker-compose up -d zookeeper
docker-compose up -d kafka-1
docker-compose up -d kafka-2
docker-compose up -d kafka-3
```
Then enter:
```
docker-exec -it chronos-pipeline_kafka-1_1 kafka-topics --zookeeper zookeeper:2181 --create --topic events --partitions 6 --replication-factor 3 --if-not-exists
```
You can then use `docker-compose stop` to stop the currently running containers. Next, you must boot up the PipelineDB container in order to set up the `chronos_pl` database. First, run `docker-compose up -d pipeline` to start the PipelineDB container. Then, from the root folder of the repository, run the following:
```
docker-exec -it chronos-pipeline_pipeline_1 psql -U postgres -d chronos_pl < db/setup_pipelinedb.sql
```
Once this is done, you may stop the container by running `docker-compose stop`. At this point Chronos should be installed.

_Note: Normally SQL files in the `/docker-entrypoint-initdb.d` directory are automatically dumped when a container is first created, but there is [currently a bug](https://github.com/pipelinedb/pipelinedb/issues/1997) that prevents PipelineDB from properly setting up the relations specified in a SQL dump._

## Authentication
Chronos authenticates by using middleware that whitelists specified origins and verifies the authentication key sent by the tracker. To generate a key, in the `server` directory run `npm run generate_new_access_key`. To whitelist an origin, run `npm run add_new_allowed_origin foo` where `foo` is the origin you wish to allow. To remove an origin, run `npm run remove_allowed_origin foo`. You may also manually alter the `config.json` instead of using the scripts.

## Running Chronos
If using the CLI, you can use `chronos start` to boot up Chronos. If using Docker, first run `docker-compose up -d zookeeper`. Let this run for 5-10 seconds and then run `docker-compose up` to start up the rest of the system. You must expost port `3000` for the Express server, and port `4000` for Grafana.

## Grafana
The default account and password for Grana is `admin`. Grafana will prompt you to enter a new password for the admin account (which is highly recommended). To connect Grafana to TimescaleDB and PipelineDB, go to `Configuration --> Data Sources` and enter the following information in each of the specified fields when creating a connection to a new PostgreSQL database:

Field | TimescaleDB | PipelineDB
----- | ----------- | ----------
Host  | `timescale:5432` | `pipeline:5432`
Database | `chronos_ts` | `chronos_pl`
User | `postgres` | `postgres`
Password | `postgres_password` | `postgres_password`
SSL mode | `disable` | `disable`
Version | `10` | `10`
TimescaleDB | ✅ | ❌

Once you click "Save and Test" you should get a green confirmation pop-up if everything is properly installed.

## The Team
[**Nick Calibey**](https://ncalibey.github.io/) _Software Engineer_ Tulsa, OK

[**Sasha Prodan**](https://sashaprodan.github.io/) _Software Engineer_ San Francisco, CA
