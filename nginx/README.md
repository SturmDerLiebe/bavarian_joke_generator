# NGINX Setup:

## Introduction
Due to issues with the live version having its HTTPS responses blocked when coming directly from the NGINX docker instance, the live/production version has a parent NGINX Server _outside of a container_ on the main server strapped in front of it. This parent instance only takes care of general Headers and the SSL Certificate. Everything else gets forwarded to the child NGINX container.
This means there are the following discrepancies between the _development_ and _production_ version regarding NGINX:
- Entrance Server:
    - Production uses the server.nginx.config for its parent NGINX Server, which is **not** running in a container but on the main server itself. This parent webserver forwards all requests to the NGINX server running in the container specified in the [docker-compose.production.yaml](https://github.com/SturmDerLiebe/bavarian_joke_generator/blob/main/docker-compose.production.yaml) file in /.
    - Development has no such parent NGINX webserver. Everything runs in a container specified by the [docker-compose.dev.yaml](https://github.com/SturmDerLiebe/bavarian_joke_generator/blob/main/docker-compose.dev.yaml) file in /. 
- HTTP-Headers:
    - Production sends all general Headers like the Content-Security-Policy & Strict-Transport-Security Headers from the parent NGINX server running on the main server itself.
    - Development does this from its only NGINX server running in a container.

## Notice
Since this current setup is basically a hack to circumvent an unkown bug, the discrepencies might resolve once the cause of the initial issue is found and taken care of. Eventually both Development and Production should solely run in containers.
