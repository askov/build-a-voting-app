#!/bin/bash
./shell/startMongoDB.sh &
./shell/startServer.sh &
./shell/startClient.sh &
code .
