#!/bin/bash
while ! nc -z localhost 4444; do sleep 3; done
