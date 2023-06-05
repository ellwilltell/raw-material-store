# RAW MATERIAL STORE

Simple project using Nest.js with microservice architecture using RabbitMQ.

## Description

Services:

- **Supplier Service** provides a RabbitMQ API to get the list of materials (stock >0 ) containing the price of materials and the name of the suppliers.

- **Store Service** is responsible for storing, editing, and retrieving a list of material items and the amount of it (stock) from its database and performing a query to get a list of available materials.

- **Documentation Service** provides OpenApi with a Swagger interface and connects to Store service to perform a query .

- **MongoDB** is responsible to store items on both services.

- **RabbitMq** is responsible for providing a Queue communication between Store and Supplier Service.

## How To Use (Development)

clone the project:

```
git clone https://github.com/ellwilltell/raw-material-store
cd ./raw-material-store
```

copy `.env.sample` to `.env`:

```
cp .env.sample .env
```

install project:

```
npm i
```

run the bash file:

```
bash ./dev.sh
```

> if docker.io is not installed on your machine, run `bash ./dev.sh` command with `sudo`

or run:

```
docker compose run --env-file ./.env
```

seed database with sample data:

```
curl -X 'POST' \
  'http://127.0.0.1:4000/store/seed' \
  -H 'accept: */*' \
  -d ''

```

## More Info

| service         | container name    | address                  |
| --------------- | ----------------- | ------------------------ |
| Documentation   | app-documentation | [http://127.0.0.1:3000]  |
| Store           | app-store         | [http://127.0.0.1:4000]  |
| Supplier        | app-supplier      | [http://127.0.0.1:5000]  |
| MongoDB         | mongo             | [http://127.0.0.1:27017] |
| RabbitMQ        | rabbitmq          | [http://127.0.0.1:5672]  |
| RabbitMQ(panel) | rabbitmq          | [http://127.0.0.1:15672] |

> default credentials is stored in in .env.example file
