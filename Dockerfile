#En proceso...
FROM ubuntu:latest
LABEL authors="sebav"

ENTRYPOINT ["top", "-b"]