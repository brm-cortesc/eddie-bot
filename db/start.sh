#!/bin/sh

# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
docker run --name db -d \
  -e MYSQL_ROOT_PASSWORD=123 \
  -e MYSQL_DATABASE=users -e MYSQL_USER=users_service -e MYSQL_PASSWORD=123 \
  -p 3306:3306 \
  mysql:5.6.40

# Wait for the database service to start up.
echo "Waiting for DB to start up..."

sleep 5 docker exec -i db users --silent --wait=120 -uusers_service -p123

##hay que hacer un wait/timeout para que docker pueda arrancar mysql

# Run the setup script.
echo "Setting up initial data..."
docker exec -i db mysql -uusers_service -p123 users < setup.sql
# sleep 10 docker exec -i db mysql -uusers_service -p123 users < brmgi_g3s.dump