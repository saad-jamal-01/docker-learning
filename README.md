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

- Run `docker compose up -d --build` to run the backend.
- Run `docker build -f .\frontend\Dockerfile -t frontend:multi  .\frontend\` at the project root folder.
- Run `docker run -d -p 5173:80 --name frontend frontend:multi`
