FROM node:8

COPY ./ /srv/service

WORKDIR /srv/service

ENV NODE_PATH "/srv/service/src/"
ENV NODE_ENV "docker_production"
ENV TERM "xterm-256color"
RUN ["npm", "install"]

CMD ["npm", "run", "docker:start"]