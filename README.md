# Day-3

- Go to the root directory of this project
- Run `docker build -t node_app:single -f Dockerfile.single .`
- Run `docker build -t node_app:multi -f Dockerfile.multi .`

After running these two commands, two new images will be created. Run `docker images` to see the newly created images. Their differences in size is clearly visible there. A screenshot has been added under `resources` directory.

To run

- docker single-staged image, run `docker run -d -p 3000:3000 --name node-single --rm node_app:single`
- docker multi-staged image, run `docker run -d -p 3000:3000 --name node-multi --rm node_app:multi`

### Explanation

- `-d` means the container will be run on detach mode
- `-p` indicates port number
- `3000:3000` first 3000 indicated the OS's port and the second one indicated docker container's port
- `--name` indicates name of the container
- `-rm` means the container shall be removed when stopped

# Day-04

- Go to the root directory of this project
- Run `docker compose up -d --build`
- To remove the volule, run `docker compose down -v`
- To find the docker volume, run `docker volume inspect <volume_name>`

For the volume created for this docker-compose file, the specification is

```json
[
  {
    "CreatedAt": "2026-07-21T13:26:27Z",
    "Driver": "local",
    "Labels": {
      "com.docker.compose.project": "node-dockerize",
      "com.docker.compose.version": "2.7.0",
      "com.docker.compose.volume": "pg_data"
    },
    "Mountpoint": "/var/lib/docker/volumes/node-dockerize_pg_data/_data",
    "Name": "node-dockerize_pg_data",
    "Options": null,
    "Scope": "local"
  }
]
```

# Day-05

From previous day's task, there are already two images. To create a local docker registry, run `docker run -d -p 5000:5000 --name registry registry:2` command.

- local registry's name will be `registry` specified by `--name registry`
- We are pulling `registry:2` image from docker hub to create this local registry

Now run following command

- `docker tag <local_image> localhost:5000/<new_name>` [currently we have 2 images for db and backend]. For the time being, use the following commands.
  - `docker tag <local_backend_image> localhost:5000/lr_node-dockerize_backend`
  - `docker tag <local_db_image> localhost:5000/lr_postgres`

- Now push the newly tagged images by `docker push localhost:5000/<new_name>`
- Now remove all the image except `registry` from local machine.
- Run `docker compose -f .\docker-compose-lr.yml up -d --build`

# Day-06 & 07

Follow these instrctions to run frontend

### Run the backend and db container via docker-compose and frontend container separately.

- Run `docker compose up -d --build` to run the backend.
- Run `docker build -f .\frontend\Dockerfile -t frontend:multi  .\frontend\` at the project root folder.
- Run `docker run -d -p 5173:80 --name frontend frontend:multi`

### Run frontend, backend and db container at a time

- Run `docker compose up -d --build` command.
- Ensure local registry is running at port `5000`.
- Run `act push --container-architecture linux/amd64` at the command prompt of project's root directory. This will push the newly built image of frontend and backend.
- To check the images hosted under local registry, run `curl -X GET http://localhost:5000/v2/_catalog` command.
- Now frontend/backend/db images from local machine (not local registry) can be deleted. Then again run `docker compose -f .\docker-compose-lr.yml up -d --build` to pull the images from local registry.

# Day-08

A node.js filesystem based logging system has been implemented. Follow these steps

- (Recommended) Remove previously created images (frontend, backend, postgres) from last working days.
- Run `docker compose up -d --build` to build the images and run containers.
- Go to `localhost:5173` to see the URL.
- Add/Delete/Fetch user.
- at the ./logs/backend directory, there will be two files, one for the error logs only and another for all loggings.

To generate a error log, go to postman and create a user with empty body.

- API: `localhost:3000/api/user`

To generate a warning log, go to the postman and delete a user who doesn't exists on db.

- API: `localhost:3000/api/user/{user_id_that_not_exists_in_db}`

A sample of log file:

```log
[2026-07-24T10:49:18.778Z] [INFO]: users list fetched
[2026-07-24T10:49:18.783Z] [INFO]: GET /api/user 200 - 37ms
[2026-07-24T10:49:28.663Z] [INFO]: users list fetched
[2026-07-24T10:49:28.664Z] [INFO]: GET /api/user 200 - 3ms
[2026-07-24T10:53:13.098Z] [ERROR]: Not Found - /api/userslskhfu
[2026-07-24T10:53:13.103Z] [WARN]: POST /api/userslskhfu 404 - 6ms
[2026-07-24T10:53:40.583Z] [WARN]: User with id 70 not found
[2026-07-24T10:53:40.583Z] [INFO]: DELETE /api/user/70 200 - 45ms
[2026-07-24T11:17:02.557Z] [INFO]: users list fetched
[2026-07-24T11:17:02.562Z] [INFO]: GET /api/user 200 - 20ms
[2026-07-24T11:17:12.466Z] [ERROR]: First name is required
[2026-07-24T11:17:12.467Z] [WARN]: POST /api/user 400 - 2ms
[2026-07-24T11:17:32.332Z] [INFO]: new user created with id 5
[2026-07-24T11:17:32.333Z] [INFO]: POST /api/user 200 - 31ms
[2026-07-24T11:17:36.081Z] [WARN]: User with id 70 not found
[2026-07-24T11:17:36.081Z] [INFO]: DELETE /api/user/70 200 - 17ms
[2026-07-24T11:17:39.783Z] [ERROR]: Not Found - /api/userslskhfu
[2026-07-24T11:17:39.784Z] [WARN]: POST /api/userslskhfu 404 - 1ms

[2026-07-24T11:18:55.139Z] [WARN]: POST /api/userslskhfu 404 - 1ms
[2026-07-24T11:19:38.194Z] [WARN]: User with id 70 not found
[2026-07-24T11:19:38.195Z] [INFO]: DELETE /api/user/70 200 - 11ms
[2026-07-24T11:20:27.935Z] [ERROR]: First name is required
[2026-07-24T11:20:27.936Z] [WARN]: POST /api/user 400 - 1ms
[2026-07-24T11:25:25.218Z] [INFO]: users list fetched
[2026-07-24T11:25:25.219Z] [INFO]: GET /api/user 200 - 17ms
[2026-07-24T11:25:25.225Z] [INFO]: users list fetched
[2026-07-24T11:25:25.226Z] [INFO]: GET /api/user 304 - 5ms
```
