#!/bin/sh

# Script launched by docker compose to start production enviroment

npx prisma migrate deploy

crond

node index.js
