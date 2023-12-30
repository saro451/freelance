#!/bin/bash

command="src.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8080"

if [[ -z "$FASTAPI_ENV" ]] || [[ "$FASTAPI_ENV" == "local" ]]; then
    command+=" --reload --workers 1"
else
    command+=" --workers 4"
fi

gunicorn $command
