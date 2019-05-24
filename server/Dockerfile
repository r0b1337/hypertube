FROM node:11.15.0

WORKDIR /server

RUN npm i npm@latest -g

COPY package* /server/
RUN npm install && npm cache clean --force
RUN npm install -g nodemon
RUN set -x \
    && apt-get update -y \
    && apt-get install -y ffmpeg
ENV PATH /server/node_modules/.bin:$PATH

COPY . /server/

CMD ["npm", "start"]
