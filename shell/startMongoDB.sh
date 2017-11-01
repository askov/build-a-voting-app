#!/bin/bash
cd server
mkdir -p data
gnome-terminal --window-with-profile=MongoTerm -e "mongod --port 27017 --dbpath=./data"
