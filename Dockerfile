FROM node:16-alpine 

WORKDIR /app

RUN apk update && apk upgrade && apk add bash git openssh
RUN apk add --update python2 krb5 krb5-libs gcc make g++ krb5-dev

RUN git config --global url."https://".insteadOf git://


COPY package*.json .

RUN npm install -g react-scripts

RUN npm install

COPY . .


CMD ["npm","start"]