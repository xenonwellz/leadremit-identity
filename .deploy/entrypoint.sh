#!/bin/sh

node ace migration:run --force
# node ace docs:generate

# cp swagger.yml build/swagger.yml
# cp sak.json build/sak.json
node build/bin/server.js
