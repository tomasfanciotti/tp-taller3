# Treatments Service Readme

Welcome to the treatments repository of our project! This repository contains the backend codebase written in Go for our treatment application.

## Description

This service is responsible for managing treatments and applications of pets within our app. It utilizes DynamoDB as its database to store the information regarding pets.

## Running the Service

To run the service, make sure you have Docker and Docker Compose installed on your machine.

1. Clone this repository to your local machine using `git clone https://github.com//tomasfanciotti/tp-taller3`.
2. Navigate to the project directory in your terminal.
3. Run `docker-compose up` to build and start the Docker containers defined in the `docker-compose.yml` file.
4. Once the containers are up and running, the service should be accessible.

## Accessing the Service

After starting the service, you can access it through the defined endpoints or APIs, depending on the functionality provided by the service.

To access the Swagger documentation, visit [the swagger](http://localhost:9004/treatments/swagger/index.html).

That's it! You should now have the Go service up and running on your local machine, utilizing DynamoDB as its database. If you encounter any issues or have any questions, feel free to reach out to us or consult the documentation. Happy coding!
