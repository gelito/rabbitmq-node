FROM node:8

WORKDIR /srv/service

ENV NODE_PATH "/srv/service/src/"
ENV NODE_ENV "docker_development"
ENV TERM "xterm-256color"
RUN ["npm", "install"]

CMD ["npm", "run", "docker:dev"]